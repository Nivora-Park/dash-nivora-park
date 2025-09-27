#!/usr/bin/env bash

# PM2 deployment script
# - Builds the Next.js app locally (expects to run from the project root)
# - Copies only the build artifacts (standalone server and static assets) to /opt/dash-nivora-park
# - Copies the repo ecosystem config as a backup and writes a generated ecosystem.config.js in /opt
# - Ensures production dependencies installed in the target (if needed)
# - Starts/restarts PM2 to run the app on port 80

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST_DIR="/opt/dash-nivora-park"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"

print() { echo -e "[pm2-deploy] $*"; }
err() { echo -e "[pm2-deploy][ERROR] $*" >&2; }

if [ "$EUID" -ne 0 ]; then
  err "This script needs to run with sudo/root because it writes to $DEST_DIR and binds port 80. Run with: sudo $0"
  exit 1
fi

cd "$PROJECT_ROOT"

print "Installing dependencies for build (local only)..."
# Use npm ci when package-lock.json exists, otherwise npm install
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

print "Running production build..."
npm run build

# Validate Next standalone output
if [ ! -d ".next/standalone" ]; then
  err "Expected .next/standalone directory not found. Ensure next.config.js has output: 'standalone' and the build succeeded."
  exit 1
fi

print "Preparing destination: $DEST_DIR"
if [ -d "$DEST_DIR" ]; then
  print "Backing up existing $DEST_DIR -> ${DEST_DIR}.bak.$TIMESTAMP"
  rm -rf "${DEST_DIR}.bak.$TIMESTAMP" || true
  mv "$DEST_DIR" "${DEST_DIR}.bak.$TIMESTAMP"
fi

mkdir -p "$DEST_DIR"

print "Copying build artifacts to $DEST_DIR"
# Copy contents of standalone (server.js, node_modules maybe, package.json) into dest
cp -a .next/standalone/. "$DEST_DIR/"

# Copy static assets
if [ -d .next/static ]; then
  mkdir -p "$DEST_DIR/.next"
  cp -a .next/static "$DEST_DIR/.next/"
fi

# Copy a minimal package.json if present at project root (useful for npm install in target)
if [ -f package.json ]; then
  cp package.json "$DEST_DIR/package.json"
fi

# Copy repo ecosystem as a backup
if [ -f ecosystem.config.js ]; then
  cp ecosystem.config.js "$DEST_DIR/ecosystem.config.raw.js"
fi

print "Writing generated PM2 ecosystem to $DEST_DIR/ecosystem.config.js"
cat > "$DEST_DIR/ecosystem.config.js" <<'PM2ECO'
module.exports = {
  apps: [
    {
      name: 'dash-nivora-park',
      // Run the standalone server produced by Next.js
      script: 'server.js',
      cwd: '/opt/dash-nivora-park',
      env: {
        PORT: 80,
        NODE_ENV: 'production'
      },
      exec_mode: 'fork',
      instances: 1,
      watch: false
    }
  ]
};
PM2ECO

cd "$DEST_DIR"

# If node_modules is missing, install production dependencies (package.json must be present)
if [ ! -d node_modules ]; then
  if [ -f package.json ]; then
    print "Installing production dependencies in $DEST_DIR (npm ci --production)..."
    npm ci --only=production || npm install --production
  else
    print "No package.json in $DEST_DIR; if server requires native modules, install them in the target."
  fi
fi

print "Stopping previous PM2 app (if any)"
pm2 stop dash-nivora-park 2>/dev/null || true
pm2 delete dash-nivora-park 2>/dev/null || true

print "Starting app with PM2 using $DEST_DIR/ecosystem.config.js"
pm2 start ecosystem.config.js --env production

print "Saving PM2 process list and enabling startup (systemd)"
pm2 save
if command -v pm2 >/dev/null 2>&1; then
  pm2 startup systemd -u root --hp /root || true
fi

print "Deployment complete. App should be running on port 80."
pm2 status dash-nivora-park || true

exit 0
