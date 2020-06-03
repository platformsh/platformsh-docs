#!/usr/bin/env bash

HUGOVERSION=0.68.3

# Download Hugo
wget https://github.com/gohugoio/hugo/releases/download/v$HUGOVERSION/hugo_${HUGOVERSION}_Linux-64bit.tar.gz
tar xvzf hugo_${HUGOVERSION}_Linux-64bit.tar.gz
rm hugo_${HUGOVERSION}_Linux-64bit.tar.gz

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

# Copy templates data straight to public
cp data/templates.yaml public/templates.yaml
