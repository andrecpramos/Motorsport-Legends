#!/usr/bin/env sh
# Launcher for the AI-SDLC starter kit.
#
# Runs against the directory this kit sits in, which is what you want after copying starter-kit/
# into a project. Pass --target=<dir> to point it somewhere else.

set -e

KIT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$KIT_DIR/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Node 22 or newer is required, and no 'node' was found on PATH."
  echo "Install it from https://nodejs.org and run this again."
  exit 1
fi

MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$MAJOR" -lt 22 ]; then
  echo "Node 22 or newer is required. Found $(node -v)."
  exit 1
fi

exec node "$KIT_DIR/setup.mjs" "$@"
