#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

CSS_FILE="assets/site.css"
if [ ! -f "$CSS_FILE" ]; then
  echo "Error: $CSS_FILE not found" >&2
  exit 1
fi

TS=$(date +%Y%m%d-%H%M)

find . -type f -name "*.html" -not -path "./node_modules/*" -print0 \
  | xargs -0 sed -i -E "s|site\.css\?v=[^\"']*|site.css?v=${TS}|g"

echo "Stamped site.css with ?v=${TS}"
