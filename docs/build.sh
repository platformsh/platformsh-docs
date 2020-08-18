#!/usr/bin/env bash

# Treat individual build step errors as fatal for the whole build process.
set -e

# Download Hugo
DOWNLOAD=https://github.com/gohugoio/hugo/releases/download/v$HUGOVERSION/hugo_${HUGOVERSION}_Linux-64bit.tar.gz
wget --quiet -c $DOWNLOAD -O - | tar -xz

# Fetch example files
npm run fetch-files

# Fetch current templates - removed temporarily until fully replaced
# npm run fetch-templates

# Update config snippets from registry
npm run registry-files

# Build Interface app for XSS
cd $PLATFORM_APP_DIR/static/scripts/xss
npm install
npm run-script build

# Build the Hugo site
cd $PLATFORM_APP_DIR
./hugo

# Handle/minify assets
npm run assets-dist
