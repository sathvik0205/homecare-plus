#!/usr/bin/env bash
set -euo pipefail

# HomeCare Plus — verify the API flows, then deploy to the prepared Vercel project.
# Requires Node.js 20+ and access to the Vercel team.

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20+ is required. Install Node.js and rerun this script." >&2
  exit 1
fi
node -e 'const major = Number(process.versions.node.split(".")[0]); if (major < 20) { console.error("Node.js 20+ is required."); process.exit(1); }'

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required. Install Node.js 20+ and rerun this script." >&2
  exit 1
fi

echo "Installing project dependencies..."
npm install

echo "Running API smoke tests..."
npm run test:smoke

echo "Signing in to Vercel..."
npx --yes vercel login

echo "Linking the prepared HomeCare Plus Vercel project..."
npx --yes vercel link --project homecare-plus --scope sathvik0205s-projects

echo "Deploying HomeCare Plus to Production..."
npx --yes vercel deploy --prod
