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
# Where production's real .env comes from. deploy_aci_prod.sh has always
# copied this file over .env on every deploy; this script used to preserve
# whatever .env happened to hold instead. That is how the app-dir copy
# drifted from the authoritative one and lost NEXT_PUBLIC_SITE_URL, which
# failed a deploy in the prebuild env check while the file it should have
# been copied from had the value all along. One source, both paths.
#
# Unset is supported and means "keep the existing .env" - staging has no
# equivalent file.
ENV_SRC="${ACI_ENV_SRC:-}"
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
# The app's .env as `git status` names it, e.g. aci-infotech/.env.
ENV_REL="${APP_DIR#"$REPO_ROOT"/}/.env"

echo "== deploy start =="
echo "ref=$REF service=$SERVICE app_dir=$APP_DIR repo_root=$REPO_ROOT"
echo "current=$PREVIOUS"

# Preflight, before anything is fetched or reset. If ENV_SRC is configured
# it is the authority on .env, so being unable to read it is not something
# to warn about and carry on from - carrying on means building against a
# stale .env, which is the drift this setting exists to stop. Fail here,
# while the checkout and the service are still untouched.
if [ -n "$ENV_SRC" ] && [ ! -r "$ENV_SRC" ]; then
  echo "!! ACI_ENV_SRC=$ENV_SRC is not readable by $(id -un)" >&2
  if [ -e "$ENV_SRC" ]; then
    # deploy_aci_prod.sh did this copy as root, so the file can be
    # root-only and still have worked by hand for years.
    echo "!! it exists but this user cannot read it. Fix on the box with:" >&2
    echo "!!   chown $(id -un): $ENV_SRC && chmod 600 $ENV_SRC" >&2
  else
    echo "!! no such file. Check ACI_ENV_SRC in the unit." >&2
  fi
  exit 1
fi

restore() {
  echo "!! deploy failed - restoring $PREVIOUS"
  git -C "$REPO_ROOT" reset --hard "$PREVIOUS" || true
  # That reset restored the committed .env over the live one, so put the
  # real env back before rebuilding. Without this the rollback build runs
  # on repo defaults and fails the prebuild check - or worse, succeeds and
  # ships a build wired to the wrong Supabase project.
  install_env
  cd "$APP_DIR"
  npm ci --include=dev --no-audit --no-fund || true
  # Only restart if the rebuild actually produced something servable. A
  # failed build leaves .next without prerender-manifest.json, and
  # `next start` exits immediately on that - so restarting after a failed
  # restore takes a service that was still serving its previously loaded
  # build and turns it into a hard 502.
  #
  # That is not hypothetical. It took ACI staging down for twenty minutes:
  # the deploy build failed before any restart, the service was untouched
  # and healthy, and then this line bounced it onto a half-written .next.
  # Leaving the old process alone is strictly better - it keeps serving
  # while a human decides what to do.
  if build; then
    sudo /usr/bin/systemctl restart "$SERVICE" || true
    echo "!! restored $PREVIOUS and restarted"
  else
    echo "!! restore build ALSO failed - deliberately NOT restarting" >&2
    echo "!! the running process still serves its last good build; leaving it alone" >&2
    echo "!! fix the build, then: sudo systemctl restart $SERVICE" >&2
  fi
}

build() {
  # check-build-env.mjs reads process.env and does not load .env files
  # itself, so source them first exactly as docs/staging.md describes.
  set -a
  # shellcheck disable=SC1091
  . ./.env
  if [ -f ./.env.local ]; then . ./.env.local; fi
  set +a
  npm run build
}

# The prod checkout carries local edits that are not in git: .env is a
# tracked file and is modified on the server, so a plain `reset --hard`
# would overwrite the live Supabase config with whatever was committed.
# Refuse rather than guess. ACI_ALLOW_DIRTY=1 overrides once the dirty
# files are understood.
#
# The app's own .env is excluded: this script installs it from ENV_SRC, so
# it is expected to differ from the commit and is not a surprise anyone
# needs to adjudicate. Excluding it here also replaces the
# `git update-index --skip-worktree` that was set on the box by hand -
# that flag lived in the server's git index where nobody reading this
# script could see it.
DIRTY=$(git -C "$REPO_ROOT" status --porcelain --untracked-files=no |
  awk -v skip="$ENV_REL" '$2 != skip')
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
  if [ -f "$APP_DIR/$f" ]; then cp -a "$APP_DIR/$f" "$ENV_BACKUP/$f"; fi
done
# `if` rather than `[ -f x ] && cp`, and an explicit return 0. A missing
# file is the normal case here - prod has no .env.staging - and with the
# && form the last loop iteration leaves the function returning non-zero.
# Under `set -E` the ERR trap is inherited into functions, so that turned
# "there was no .env.staging to put back" into a failed deploy that
# rolled itself back seconds after the reset.
restore_env() {
  for f in .env .env.local .env.staging; do
    if [ -f "$ENV_BACKUP/$f" ]; then cp -a "$ENV_BACKUP/$f" "$APP_DIR/$f"; fi
  done
  return 0
}

# Puts the env files back after a reset, then lets ENV_SRC win for .env if
# one is configured. Order matters: the backup is the floor, ENV_SRC is the
# authority.
install_env() {
  restore_env
  if [ -n "$ENV_SRC" ] && [ -r "$ENV_SRC" ]; then
    # Plain cp, not cp -a. Preserving ownership needs root when the source
    # belongs to someone else, and this script runs unprivileged. Contents
    # and a 600 mode are what matter; the owner is set by the copy.
    cp "$ENV_SRC" "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
    echo "env: .env installed from $ENV_SRC"
  elif [ -n "$ENV_SRC" ] && [ -e "$ENV_SRC" ]; then
    # Readable matters more than existing: deploy_aci_prod.sh does this
    # copy as root, so the file can be root-only and still have worked by
    # hand for years. Say which it is rather than "missing".
    echo "!! env: ACI_ENV_SRC=$ENV_SRC exists but is not readable by $(id -un)" >&2
    echo "!! env: kept the existing .env - fix with: chown $(id -un) $ENV_SRC" >&2
  elif [ -n "$ENV_SRC" ]; then
    echo "!! env: ACI_ENV_SRC=$ENV_SRC is set but missing - kept the existing .env" >&2
  else
    echo "env: no ACI_ENV_SRC set - kept the existing .env"
  fi
  return 0
}

# Named files only, no recursive delete. ENV_BACKUP is a mktemp -d, but a
# variable that is empty or wrong turns `rm -rf "$ENV_BACKUP"` into
# something far worse than a leaked temp directory, and this script has
# already proved it can surprise us.
cleanup_env_backup() {
  for f in .env .env.local .env.staging; do
    rm -f "$ENV_BACKUP/$f"
  done
  rmdir "$ENV_BACKUP" 2>/dev/null || true
  return 0
}
trap 'install_env; cleanup_env_backup' EXIT

git -C "$REPO_ROOT" fetch --prune origin "$REF"
TARGET=$(git -C "$REPO_ROOT" rev-parse FETCH_HEAD)
echo "target=$TARGET"

if [ "$TARGET" = "$PREVIOUS" ]; then
  echo "already at $TARGET - nothing to deploy"
  exit 0
fi

trap restore ERR

git -C "$REPO_ROOT" reset --hard "$TARGET"
install_env
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
