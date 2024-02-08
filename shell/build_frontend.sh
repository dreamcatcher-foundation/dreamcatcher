#!/bin/bash
if [ $# -lt 1 ]; then
  echo "Bash: command: $1 <program>"
  exit 1
fi
echo "Bash: building routes for $1"
DIRECTORY="./code/frontend/$1/src/route"
if [ ! -d "$DIRECTORY" ]; then
  echo "Bash: cannot find directory '$DIRECTORY'"
  exit 1
fi
DIST="./code/frontend/$1/dist"
rm -rf "$DIST"
mkdir -p "$DIST"
for FOLDER in "$DIRECTORY"/*/; do
  if [ -d "$FOLDER" ]; then
    for TSX_FILE in "$FOLDER"*.tsx; do
      if [ -f "$TSX_FILE" ]; then
        OUTPUT_DIRECTORY="$DIST/${FOLDER#"$DIRECTORY"/}"
        mkdir -p "$OUTPUT_DIRECTORY"
        bun build "$TSX_FILE" --outdir "$OUTPUT_DIRECTORY"
        HTML_FILE="${TSX_FILE%.tsx}.html"
        if [ -f "$HTML_FILE" ]; then
          cp "$HTML_FILE" "$OUTPUT_DIRECTORY"
        else
          echo "Bash: failed to build html $HTML_FILE"
        fi
      fi
    done
  fi
done
echo "Bash: successfully built routes for $1 at '$DIST'"