#!/bin/bash
# IELTS Liz Vault - Local Server Launcher
# Run in terminal with: bash start.sh (or ./start.sh)

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8085

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌟 IELTS Liz Vault - Local Server Launcher"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Opening: http://localhost:$PORT/index.html"
echo ""
echo "  Press CTRL+C to stop the server."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Open browser after a small delay
(sleep 1.2 && (xdg-open "http://localhost:$PORT/index.html" 2>/dev/null || open "http://localhost:$PORT/index.html" 2>/dev/null)) &

# Run server from directory
cd "$DIR"
python3 -m http.server $PORT
