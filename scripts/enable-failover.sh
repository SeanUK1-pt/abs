#!/usr/bin/env bash
# ONE-TIME setup for zero-downtime deploys. Run ON THE SERVER:  scripts/enable-failover.sh
#
#  1. starts a second copy of the site on port 3100 (PM2 app "abs-website-b")
#  2. replaces /etc/nginx/conf.d/abs.conf with deploy/nginx-abs.conf, so nginx sends
#     visitors to either copy and quietly retries the other if one is restarting
#
# Only this site's nginx file changes (a backup is kept). The change is tested with
# `nginx -t` before nginx is reloaded, and undone automatically if anything fails.
# To undo it later:
#   sudo cp /etc/nginx/conf.d/abs.conf.before-failover /etc/nginx/conf.d/abs.conf
#   sudo nginx -t && sudo nginx -s reload
#   pm2 delete abs-website-b && pm2 save
set -euo pipefail
cd "$(dirname "$0")/.."
CONF=/etc/nginx/conf.d/abs.conf
BACKUP=/etc/nginx/conf.d/abs.conf.before-failover
NEWCONF=deploy/nginx-abs.conf

log() { printf '[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }
die() { log "ERROR: $*"; exit 1; }
code() { curl -s -o /dev/null -m 25 -w '%{http_code}' "$1" 2>/dev/null || true; }

[ -f "$NEWCONF" ] || die "$NEWCONF not found"
sudo -n true 2>/dev/null || die "this needs passwordless sudo for the nginx change"

# 1. second copy
if ! pm2 jlist 2>/dev/null | python3 -c "import json,sys; sys.exit(0 if any(p['name']=='abs-website-b' for p in json.load(sys.stdin)) else 1)"; then
  log "starting the second copy on port 3100"
  pm2 start ecosystem.abs-b.config.cjs >/dev/null
fi
for i in $(seq 1 60); do [ "$(code http://127.0.0.1:3100/)" = 200 ] && break; sleep 1; done
for p in / /pt /boats /contact /privacy-policy; do
  [ "$(code "http://127.0.0.1:3100$p")" = 200 ] || die "second copy does not serve $p - nginx was NOT changed"
done
log "second copy is healthy"

# 2. nginx
[ -f "$BACKUP" ] || sudo cp -a "$CONF" "$BACKUP"
restore() { log "restoring the previous nginx file"; sudo cp -a "$BACKUP" "$CONF"; sudo nginx -t >/dev/null 2>&1 && sudo nginx -s reload; }
sudo cp "$NEWCONF" "$CONF"
if ! sudo nginx -t 2>&1 | tail -2; then restore; die "nginx rejected the new file - restored the old one"; fi
sudo nginx -s reload
sleep 1
for p in / /pt /boats /contact; do
  c=$(curl -sk -o /dev/null -m 25 -w '%{http_code}' --resolve www.algarveboatsales.com:443:127.0.0.1 "https://www.algarveboatsales.com$p" 2>/dev/null || true)
  [ "$c" = 200 ] || { restore; die "https://www.algarveboatsales.com$p returned $c - restored the old nginx file"; }
done
log "nginx now uses both copies; the site answers normally"

pm2 save >/dev/null
log "DONE. Deploys with scripts/deploy.sh are now zero-downtime."
