#!/usr/bin/env bash
#
# Stable launcher for the production deploy. This is the file that gets
# installed to /usr/local/bin/aci-deploy, and it is meant never to change
# again.
#
# Why it exists: the deploy logic used to live in the installed copy, so a
# fix to deploy/aci-deploy.sh could not reach production through a deploy -
# the deploy would fetch the fix into the checkout and then run the stale
# script from /usr/local/bin. That cost a real afternoon: three deploys in
# a row failed on a bug that had already been fixed and pushed.
#
# So the launcher does the smallest possible job. It fetches the requested
# ref, takes the deploy script out of that ref, and runs it. The logic
# ships with the code it deploys.
#
# The script is copied to a temp file before running rather than executed
# from the checkout, because the deploy resets the checkout to the target
# commit - and bash reads a script incrementally as it runs. Replacing the
# file under a running shell makes it execute whatever bytes now sit at the
# offset it had reached, which is a spectacular way to lose a production
# box.
#
# Trust note: the deploy logic now comes from the ref being deployed. That
# is not a new boundary - the hook already builds that ref's code, runs it
# as this user, and restarts the service on it. Anyone who can choose the
# ref could already run their code here.
#
# Usage:  aci-deploy <ref>
# Install: /usr/local/bin/aci-deploy  (chmod 755, owned by root)

set -Eeuo pipefail

SERVICE="${ACI_SERVICE:-aci-next.service}"
DEPLOY_SCRIPT_PATH="${ACI_DEPLOY_SCRIPT_PATH:-deploy/aci-deploy.sh}"

REF="${1:-}"
if [ -z "$REF" ]; then
  echo "usage: aci-deploy <ref>" >&2
  exit 2
fi

# The ref arrives from a network request. Validate here as well as in the
# deploy script itself: this is the process that first hands it to git.
if ! printf '%s' "$REF" | grep -qE '^[A-Za-z0-9._/-]{1,255}$'; then
  echo "refusing suspicious ref: $REF" >&2
  exit 2
fi

APP_DIR=$(systemctl show "$SERVICE" -p WorkingDirectory --value)
if [ -z "$APP_DIR" ] || [ ! -d "$APP_DIR" ]; then
  echo "bad WorkingDirectory for $SERVICE: '$APP_DIR'" >&2
  exit 1
fi
REPO_ROOT=$(git -C "$APP_DIR" rev-parse --show-toplevel)

echo "== launcher: fetching $REF =="
git -C "$REPO_ROOT" fetch --prune origin "$REF"

RUNNER=$(mktemp -t aci-deploy.XXXXXXXX)
trap 'rm -f "$RUNNER"' EXIT
git -C "$REPO_ROOT" show "FETCH_HEAD:$DEPLOY_SCRIPT_PATH" > "$RUNNER"
chmod 700 "$RUNNER"

# A ref whose deploy script is missing, truncated or not a shell script
# should fail here, before anything touches the checkout or the service.
if ! head -n 1 "$RUNNER" | grep -q '^#!'; then
  echo "!! $DEPLOY_SCRIPT_PATH in $REF is not a script" >&2
  exit 1
fi
if ! bash -n "$RUNNER"; then
  echo "!! $DEPLOY_SCRIPT_PATH in $REF does not parse - refusing to run it" >&2
  exit 1
fi

echo "== launcher: running $DEPLOY_SCRIPT_PATH from $REF =="
# Not exec: the EXIT trap above has to survive to remove the temp file.
rc=0
bash "$RUNNER" "$REF" || rc=$?
exit "$rc"
