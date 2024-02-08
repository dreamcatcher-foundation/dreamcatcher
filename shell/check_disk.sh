#!/bin/bash
if [ $# -lt 1 ]; then
  echo "Bash: command: $1 <program>"
  exit 1
fi
DIRECTORY="./code/backend/$1/private/disk"
if [ ! -d "$DIRECTORY" ]; then
  echo "Bash: directory '$DIRECTORY' does not exist"
  exit 1
fi
for DIR in "$DIRECTORY"/*/; do
  echo "> $(basename "$DIR")"
done