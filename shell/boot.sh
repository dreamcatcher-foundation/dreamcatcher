#!/bin/bash
if [ $# -lt 1 ]; then
  echo "Bash: command: $1 <program>"
  exit 1
fi
echo "Bash: booting up $1"
FILE="./code/backend/$1/shell.ts"
if [ ! -f "$FILE" ]; then
  echo "Bash: file '$FILE' does not exist"
  exit 1
fi
bun run $FILE