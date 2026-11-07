// The second copy of the site (port 3100), used only for zero-downtime deploys.
// The first copy is the existing "abs-website" process on port 3000.
// Set up once with scripts/enable-failover.sh; scripts/deploy.sh then restarts the
// two copies one at a time while nginx sends visitors to whichever one is up.
// Settings (database, mail, keys) come from .env.local, which Next reads itself.
module.exports = {
  apps: [
    {
      name: 'abs-website-b',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3100',
      kill_timeout: 15000,
      env: { NODE_ENV: 'production' },
    },
  ],
}
