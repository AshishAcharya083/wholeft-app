#!/usr/bin/env bash
# Run after: firebase login (sign in as imashish083@gmail.com)
# Creates wholeft-app-dev and wholeft-app-prod and sets default to dev.

set -e
cd "$(dirname "$0")/.."

echo "Creating Firebase project: wholeft-app-dev (WhoLeft Dev)..."
firebase projects:create wholeft-app-dev --display-name "WhoLeft Dev"

echo "Creating Firebase project: wholeft-app-prod (WhoLeft Prod)..."
firebase projects:create wholeft-app-prod --display-name "WhoLeft Prod"

echo "Setting default project to dev..."
firebase use dev

echo "Done. Use 'firebase use dev' or 'firebase use prod' to switch."
