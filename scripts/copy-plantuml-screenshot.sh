#!/usr/bin/env bash
set -euo pipefail

DEST="/Users/ryan/Projects/Anth.us/src/blog/images/grok-bot-plantuml-request.png"

if [[ $# -ge 1 ]]; then
  latest="$1"
  if [[ ! -f "$latest" ]]; then
    echo "Not a file: $latest" >&2
    exit 1
  fi
else
  DESKTOP="/Users/ryan/Desktop"
  shopt -s nullglob
  files=()
  for f in "$DESKTOP"/*; do
    [[ -f "$f" ]] || continue
    [[ "$(basename "$f")" == ".DS_Store" ]] && continue
    files+=("$f")
  done

  if ((${#files[@]} == 0)); then
    echo "No files on Desktop (or Desktop is not readable)." >&2
    echo "" >&2
    echo "Drag the screenshot into the project, or pass the path:" >&2
    echo "  $0 ~/Desktop/Screenshot*.png" >&2
    echo "" >&2
    ls -la "$DESKTOP" 2>&1 || true
    exit 1
  fi

  latest="$(ls -t "${files[@]}" | head -1)"
fi

echo "Using: $latest"

if sips -s format png "$latest" --out "$DEST" >/dev/null 2>&1; then
  echo "Wrote PNG: $DEST"
else
  cp "$latest" "$DEST"
  echo "Copied: $DEST"
fi

sips -g pixelWidth -g pixelHeight "$DEST"
