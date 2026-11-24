#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/sathvik0205/homecare-plus.git"

if ! command -v git >/dev/null 2>&1; then
  echo "Git is required. Install Git and run this script again."
  exit 1
fi

if ! git config user.name >/dev/null || ! git config user.email >/dev/null; then
  echo "Configure your Git author first:"
  echo '  git config --global user.name "Your Name"'
  echo '  git config --global user.email "your-email@example.com"'
  exit 1
fi

if [ ! -d .git ]; then
  git init -b main
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git add -A
if ! git diff --cached --quiet; then
  git commit -m "Add HomeCare Plus project source and report"
fi

git push -u origin main

echo "Published HomeCare Plus to https://github.com/sathvik0205/homecare-plus"
