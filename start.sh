#!/usr/bin/env bash
# ── Start the Enjoy Image Transformer frontend ───────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "[ERROR] Node.js not found. Please install Node.js >= 16."
  exit 1
fi

# Install dependencies if needed
if [ ! -d node_modules ]; then
  echo "[INFO] Installing npm dependencies..."
  npm install
fi

echo ""
echo "==========================================="
echo "  Enjoy Image Transformer — Frontend"
echo "  http://0.0.0.0:3000"
echo "==========================================="
echo ""

npm start
