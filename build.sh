#!/usr/bin/env bash

HUGOVERSION=0.68.3

# Download Hugo
wget https://github.com/gohugoio/hugo/releases/download/v$HUGOVERSION/hugo_${HUGOVERSION}_Linux-64bit.tar.gz
tar xvzf hugo_${HUGOVERSION}_Linux-64bit.tar.gz
rm hugo_${HUGOVERSION}_Linux-64bit.tar.gz

# Fetch example files
npm run fetch-files

# Fetch current templates
npm run fetch-templates

# Update config snippets from registry
npm run registry-files

# Build the site
./hugo
