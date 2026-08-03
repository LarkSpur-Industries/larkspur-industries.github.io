#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-4173}"

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is required but was not found." >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Error: python3 is required to run the local preview server." >&2
  exit 1
fi

cd "$ROOT_DIR"

echo "Building the production website..."
npm run build

echo
echo "Serving dist/ at http://127.0.0.1:${PORT}"
echo "Press Ctrl+C to stop."
echo

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory dist
