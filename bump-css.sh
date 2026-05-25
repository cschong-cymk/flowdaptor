#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

CSS_FILE="assets/site.css"
if [ ! -f "$CSS_FILE" ]; then
  echo "Error: $CSS_FILE not found" >&2
  exit 1
fi

if stat -f %m "$CSS_FILE" >/dev/null 2>&1; then
  TS=$(stat -f %m "$CSS_FILE")
else
  TS=$(stat -c %Y "$CSS_FILE")
fi

find . -type f -name "*.html" -not -path "./node_modules/*" -print0 \
  | xargs -0 sed -i '' -E "s|site\.css(\?v=[0-9]+)?|site.css?v=${TS}|g"

echo "Stamped site.css with ?v=${TS}"
