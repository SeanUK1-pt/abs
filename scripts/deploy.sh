#!/usr/bin/env bash
# Deploy algarveboatsales.com without errors for visitors. Run ON THE SERVER:
#
#   scripts/deploy.sh             build the latest main and switch to it
#   scripts/deploy.sh rollback    switch back to the previous build
#   scripts/deploy.sh status      show what is live and how the site is run
#
# From a laptop:  ssh -i <key> ec2-user@<server> '~/abs-website/scripts/deploy.sh'
#
# How it works
#  * Builds alternate between two folders, .next-a and .next-b. The new build goes
#    into the one that is NOT live, so the running site is never touched.
#  * The new build is smoke-tested on a spare port before anything is switched.
#  * .next-current is a link to the live folder. Each server process reads it once
#    when it starts, so a process stays on its own build until it is restarted.
#  * Old and new builds swap their static files, so a visitor who loaded a page
#    from one build can still fetch its scripts after the switch.
#  * If anything fails after the switch, the previous build is restored.
#
# Two ways of running the site
#  * One copy (abs-website, port 3000): the restart costs about half a second of
#    refused connections.
#  * Two copies behind nginx (abs-website on 3000 + abs-website-b on 3100, with
#    deploy/nginx-abs.conf): copies are restarted one at a time and nginx sends
#    traffic to whichever is up, so visitors see nothing at all. Set this up once
#    with scripts/enable-failover.sh. This script detects it automatically.
set -euo pipefail

cd "$(dirname "$0")/.."
NAME_A=abs-website;   PORT_A=3000
NAME_B=abs-website-b; PORT_B=3100
PORT_TEST=3199
PATHS=(/ /pt /boats /pt/boats /contact /privacy-policy /sitemap.xml)
CMD=${1:-deploy}

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }
die() { log "ERROR: $*"; exit 1; }

command -v pm2 >/dev/null || die "pm2 not found"
command -v flock >/dev/null || die "flock not found"

current()  { readlink .next-current 2>/dev/null || true; }
live_dir() { local c; c=$(current); if [ -n "$c" ]; then echo "$c"; elif [ -d .next ]; then echo .next; fi; }
spare()    { case "$(current)" in .next-a) echo .next-b ;; *) echo .next-a ;; esac; }
build_id() { cat "$1/BUILD_ID" 2>/dev/null || echo "-"; }

pm2_online() {
  pm2 jlist 2>/dev/null | python3 -c "
import json, sys
sys.exit(0 if any(p['name'] == '$1' and p['pm2_env']['status'] == 'online' for p in json.load(sys.stdin)) else 1)"
}

# 000 on any failure
http_code() { curl -s -o /dev/null -m "${2:-25}" -w '%{http_code}' "$1" 2>/dev/null || true; }

# Wait for a copy to answer, then request every page once (this also warms it).
wait_healthy() {
  local port=$1 label=$2 deadline=$((SECONDS + 90)) bad=0 code
  while [ $SECONDS -lt $deadline ]; do
    [ "$(http_code "http://127.0.0.1:$port/")" = 200 ] && break
    sleep 1
  done
  for p in "${PATHS[@]}"; do
    code=$(http_code "http://127.0.0.1:$port$p")
    if [ "$code" != 200 ]; then log "  $label: $p -> $code"; bad=1; fi
  done
  return $bad
}

# Is the second copy set up and running? (then we can restart one copy at a time)
rolling() { pm2_online "$NAME_B"; }

restart_all() {
  log "restarting $NAME_A"
  pm2 restart "$NAME_A" >/dev/null
  wait_healthy "$PORT_A" "$NAME_A" || return 1
  if rolling; then
    log "restarting $NAME_B (the other copy is serving meanwhile)"
    pm2 restart "$NAME_B" >/dev/null
    wait_healthy "$PORT_B" "$NAME_B" || return 1
  fi
  return 0
}

point_to() { ln -sfn "$1" .next-current.tmp && mv -T .next-current.tmp .next-current; }

through_nginx_ok() {
  [ "$(curl -sk -o /dev/null -m 25 -w '%{http_code}' --resolve www.algarveboatsales.com:443:127.0.0.1 https://www.algarveboatsales.com/ 2>/dev/null || true)" = 200 ]
}

status() {
  echo "live build   : $(live_dir) (id $(build_id "$(live_dir)"))"
  echo "spare build  : $(spare) (id $(build_id "$(spare)"))"
  echo "mode         : $(if rolling; then echo "two copies, restarted one at a time (zero downtime)"; else echo "one copy (about half a second of refused connections at each restart)"; fi)"
  pm2 jlist 2>/dev/null | python3 -c "
import json, sys
for p in json.load(sys.stdin):
    if p['name'].startswith('abs-website'): print('process      :', p['name'], p['pm2_env']['status'], 'restarts', p['pm2_env']['restart_time'])"
  echo "code         : $(git rev-parse --short HEAD) $(git log -1 --format=%s | cut -c1-70)"
  echo "disk         : $(du -sh .next-a .next-b 2>/dev/null | tr '\n' ' ')"
}

rollback() {
  local to; to=$(spare)
  [ -f "$to/BUILD_ID" ] || die "no previous build to go back to"
  log "rolling back: $(live_dir) -> $to"
  point_to "$to"
  restart_all || die "rollback restart did not verify - check: pm2 logs $NAME_A"
  log "rolled back; now serving $to"
}

deploy() {
  local start=$SECONDS prev target old new
  prev=$(live_dir); target=$(spare)
  log "serving: ${prev:-nothing yet} | building into: $target | mode: $(if rolling; then echo 'zero-downtime'; else echo 'single copy'; fi)"

  # 1. Code
  git checkout -- next-env.d.ts 2>/dev/null || true     # generated; Next rewrites it every build
  old=$(git rev-parse HEAD)
  git pull --ff-only || die "git pull failed (local changes in the way?) - nothing was changed"
  new=$(git rev-parse HEAD)
  log "code: ${old:0:7} -> ${new:0:7}"
  if [ "$old" != "$new" ] && git diff --name-only "$old" "$new" | grep -qE '^package(-lock)?\.json$'; then
    log "dependencies changed: npm install"
    npm install --no-audit --no-fund >/tmp/abs-npm.log 2>&1 || { tail -15 /tmp/abs-npm.log; die "npm install failed - the live site was not touched"; }
  fi

  # 2. Build into the spare folder, at low priority so the live site stays quick
  log "building (this takes about a minute)..."
  mkdir -p "$target"
  if ! NEXT_DIST_DIR="$target" nice -n 10 npm run build >/tmp/abs-build.log 2>&1; then
    tail -30 /tmp/abs-build.log
    die "build failed - the live site was not touched"
  fi
  [ -f "$target/BUILD_ID" ] || die "build produced no BUILD_ID - the live site was not touched"
  log "built: $(grep -E 'Compiled' /tmp/abs-build.log | head -1 | sed 's/^[^A-Za-z]*//')"

  # 3. Let each build serve the other's static files, and keep the image cache
  if [ -n "$prev" ] && [ -d "$prev/static" ]; then
    mkdir -p "$target/static"
    cp -an "$prev/static/." "$target/static/"
    cp -an "$target/static/." "$prev/static/"
  fi
  if [ -n "$prev" ] && [ -d "$prev/cache/images" ]; then
    mkdir -p "$target/cache"
    cp -an "$prev/cache/images" "$target/cache/" 2>/dev/null || true
  fi

  # 4. Smoke-test the new build on a spare port before it goes anywhere near visitors
  [ -z "$(ss -ltn | grep ":$PORT_TEST " || true)" ] || die "port $PORT_TEST is busy - nothing was changed"
  log "smoke-testing the new build on port $PORT_TEST..."
  NEXT_DIST_DIR="$target" NODE_ENV=production node_modules/.bin/next start -p "$PORT_TEST" >/tmp/abs-preflight.log 2>&1 &
  local pf=$!
  if ! wait_healthy "$PORT_TEST" "new build"; then
    tail -20 /tmp/abs-preflight.log; kill "$pf" 2>/dev/null || true
    die "the new build failed its smoke test - the live site was not touched"
  fi
  kill "$pf" 2>/dev/null || true; wait "$pf" 2>/dev/null || true

  # 5. Switch and restart
  point_to "$target"
  log "switched to $target"
  if ! restart_all || ! through_nginx_ok; then
    log "the new build did not verify after the switch - restoring the previous one"
    if [ -n "$prev" ] && [ "$prev" != .next ]; then point_to "$prev"; else rm -f .next-current; fi
    restart_all || log "WARNING: restore restart did not verify - check: pm2 logs $NAME_A"
    die "deploy failed and was rolled back (serving $(live_dir))"
  fi

  # 6. Tidy: once both folders hold a build, the original .next is no longer needed
  if [ -f .next-a/BUILD_ID ] && [ -f .next-b/BUILD_ID ] && [ -d .next ]; then
    log "removing the original .next folder (no longer used)"; rm -rf .next
  fi
  log "DONE in $((SECONDS - start))s: serving $target (id $(build_id "$target")), code ${new:0:7}"
}

case "$CMD" in
  status)   status ;;
  deploy|rollback)
    exec 9>/tmp/abs-deploy.lock
    flock -n 9 || die "another deploy is already running"
    "$CMD"
    ;;
  *) die "usage: scripts/deploy.sh [deploy|rollback|status]" ;;
esac
