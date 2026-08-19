#!/usr/bin/env bash
#
# Production deploy for aciinfotech.com.
#
# Fetches a ref into the prod checkout, rebuilds, restarts the service, and
# rolls back if the build fails or the site does not come back healthy.
#
# Runs as the deploy user (not root). The only privileged thing it does is
# restart one systemd unit, via the narrow sudoers rule in
# /etc/sudoers.d/gha-deploy.
#
# Usage:  aci-deploy <ref>
# Install: /usr/local/bin/aci-deploy  (chmod 755, owned by root)

# -E matters as much as -e here: without errtrace the ERR trap is not
# inherited by shell functions, so a failure inside build() exits without
# ever running restore(). Observed live - a build that aborted in the
# prebuild env check exited in 19s with no rollback and left the checkout
# on the new commit while the service kept serving the old build.
set -Eeuo pipefail

SERVICE="${ACI_SERVICE:-aci-next.service}"
HEALTH_PORT="${ACI_HEALTH_PORT:-3002}"
# In the deploy user's home, not /var/lock: this runs unprivileged, and
# /var/lock is not writable by it on a default AlmaLinux install.
LOCK="${ACI_LOCK:-${HOME:-/tmp}/.aci-deploy.lock}"

REF="${1:-}"
if [ -z "$REF" ]; then
  echo "usage: aci-deploy <ref>" >&2
  exit 2
fi

# A ref reaches this script from a network request, so it never goes near a
# shell unquoted and it has to look like a ref before we use it at all.
if ! printf '%s' "$REF" | grep -qE '^[A-Za-z0-9._/-]{1,255}$'; then
  echo "refusing suspicious ref: $REF" >&2
  exit 2
fi

# One deploy at a time. Two overlapping builds in the same checkout leave
# .next in a state neither of them expects.
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "another deploy is already running" >&2
  exit 75
fi

APP_DIR=$(systemctl show "$SERVICE" -p WorkingDirectory --value)
[ -n "$APP_DIR" ] && [ -d "$APP_DIR" ] || { echo "bad WorkingDirectory: '$APP_DIR'" >&2; exit 1; }

cd "$APP_DIR"
REPO_ROOT=$(git rev-parse --show-toplevel)
PREVIOUS=$(git -C "$REPO_ROOT" rev-parse HEAD)

echo "== deploy start =="
echo "ref=$REF service=$SERVICE app_dir=$APP_DIR repo_root=$REPO_ROOT"
echo "current=$PREVIOUS"

restore() {
  echo "!! deploy failed - restoring $PREVIOUS"
  git -C "$REPO_ROOT" reset --hard "$PREVIOUS" || true
  cd "$APP_DIR"
  npm ci --include=dev --no-audit --no-fund || true
  build || echo "!! restore build failed too - service left on its running process"
  sudo /usr/bin/systemctl restart "$SERVICE" || true
}

build() {
  # check-build-env.mjs reads process.env and does not load .env files
  # itself, so source them first exactly as docs/staging.md describes.
  set -a
  # shellcheck disable=SC1091
  . ./.env
  [ -f ./.env.local ] && . ./.env.local
  set +a
  npm run build
}

# The prod checkout carries local edits that are not in git: .env is a
# tracked file and is modified on the server, so a plain `reset --hard`
# would overwrite the live Supabase config with whatever was committed.
# Refuse rather than guess. ACI_ALLOW_DIRTY=1 overrides once the dirty
# files are understood.
DIRTY=$(git -C "$REPO_ROOT" status --porcelain --untracked-files=no)
if [ -n "$DIRTY" ] && [ "${ACI_ALLOW_DIRTY:-0}" != "1" ]; then
  echo "!! refusing to deploy: tracked files are modified in $REPO_ROOT" >&2
  printf '%s\n' "$DIRTY" >&2
  echo "commit, stash, or re-run with ACI_ALLOW_DIRTY=1 once you know what these are" >&2
  exit 1
fi

# Env files never come from git on this box. Keep them across the reset
# even when ACI_ALLOW_DIRTY is set, because losing them takes the site down
# and the values are not recoverable from the repository.
ENV_BACKUP=$(mktemp -d)
for f in .env .env.local .env.staging; do
  [ -f "$APP_DIR/$f" ] && cp -a "$APP_DIR/$f" "$ENV_BACKUP/$f"
done
restore_env() {
  for f in .env .env.local .env.staging; do
    [ -f "$ENV_BACKUP/$f" ] && cp -a "$ENV_BACKUP/$f" "$APP_DIR/$f"
  done
}
trap 'restore_env; rm -rf "$ENV_BACKUP"' EXIT

git -C "$REPO_ROOT" fetch --prune origin "$REF"
TARGET=$(git -C "$REPO_ROOT" rev-parse FETCH_HEAD)
echo "target=$TARGET"

if [ "$TARGET" = "$PREVIOUS" ]; then
  echo "already at $TARGET - nothing to deploy"
  exit 0
fi

trap restore ERR

git -C "$REPO_ROOT" reset --hard "$TARGET"
restore_env
cd "$APP_DIR"
# --include=dev, always. .env carries NODE_ENV=production, and build()
# sources it with `set -a`, so every npm run after the first inherits it
# and npm ci silently drops devDependencies. next build then cannot
# transpile next.config.ts because typescript is gone. The restore path
# hit exactly this: 327 packages instead of 667, and a rollback that
# could not rebuild. deploy_aci_prod.sh has always passed this flag.
npm ci --include=dev --no-audit --no-fund
build

sudo /usr/bin/systemctl restart "$SERVICE"
trap - ERR

echo "== health check =="
ok=0
for i in $(seq 1 20); do
  sleep 3
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${HEALTH_PORT}/" || echo 000)
  state=$(systemctl is-active "$SERVICE" || true)
  echo "attempt $i: http=$code service=$state"
  if [ "$state" = "active" ] && [ "$code" -ge 200 ] && [ "$code" -lt 400 ]; then
    ok=1
    break
  fi
done

if [ "$ok" -ne 1 ]; then
  echo "!! unhealthy after restart"
  systemctl status "$SERVICE" --no-pager -n 40 || true
  restore
  exit 1
fi

echo "== deployed $TARGET (was $PREVIOUS) =="
echo "roll back: git -C $REPO_ROOT reset --hard $PREVIOUS && cd $APP_DIR && npm ci && npm run build && sudo systemctl restart $SERVICE"
