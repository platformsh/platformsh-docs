#!/usr/bin/env bash

# Treat individual build step errors as fatal for the whole build process.
set -e

# Download Hugo
DOWNLOAD=https://github.com/gohugoio/hugo/releases/download/v$HUGOVERSION/hugo_${HUGOVERSION}_Linux-64bit.tar.gz
wget --quiet -c $DOWNLOAD -O - | tar -xz

# Build Interface app for search/autocomplete
npm run build:search

# Copy templates index so it will be served for search to grab
mkdir static/files/indexes && cp data/templates.yaml static/files/indexes/templates.yaml
# Build the Hugo site
./hugo
# Handle/minify assets
npm run assets-dist