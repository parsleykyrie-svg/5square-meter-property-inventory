#!/usr/bin/env bash
# Sync product context from the SDLC repo into context/product/.
# Usage: bash scripts/sync_product_context.sh [/path/to/SDLC]
#
# Defaults to ../SDLC relative to this repo if no path is given.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SDLC_PATH="${1:-$REPO_ROOT/../SDLC}"

if [ ! -d "$SDLC_PATH" ]; then
  echo "ERROR: SDLC repo not found at $SDLC_PATH"
  echo "Usage: bash scripts/sync_product_context.sh [/path/to/SDLC]"
  exit 1
fi

echo "Syncing from: $SDLC_PATH"

DEST="$REPO_ROOT/context/product"
mkdir -p "$DEST/user_stories"

# Core context files
for f in business_logic.md project_idea.md service_mapping.md; do
  src="$SDLC_PATH/context/$f"
  if [ -f "$src" ]; then
    cp "$src" "$DEST/$f"
    echo "  copied: context/$f"
  else
    echo "  WARNING: $src not found, skipping"
  fi
done

# Approved user stories
US_SRC="$SDLC_PATH/output/user_stories"
if [ -d "$US_SRC" ]; then
  cp "$US_SRC"/*.md "$DEST/user_stories/" 2>/dev/null || true
  count=$(ls "$DEST/user_stories/"*.md 2>/dev/null | wc -l | tr -d ' ')
  echo "  copied: $count user stories"
else
  echo "  WARNING: $US_SRC not found, skipping user stories"
fi

echo ""
echo "Sync complete. Review changes with: git diff context/product/"
echo "Commit when ready: git add context/product/ && git commit -m 'chore: sync product context from SDLC'"
