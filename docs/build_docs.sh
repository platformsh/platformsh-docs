#!/usr/bin/env bash

# Treat individual build step errors as fatal for the whole build process.
set -e

# Download Hugo
DOWNLOAD=https://github.com/gohugoio/hugo/releases/download/v$HUGOVERSION/hugo_${HUGOVERSION}_Linux-64bit.tar.gz
wget --quiet -c $DOWNLOAD -O - | tar -xz

# Build Interface app for search/autocomplete.
cd $PLATFORM_APP_DIR/static/scripts/xss
npm install
npm run-script build

# Go back home
cd $PLATFORM_APP_DIR
# Copy templates index so it will be served for search to grab
mkdir static/files/indexes && cp data/templates.yaml static/files/indexes/templates.yaml
# Clone the repo itself so that enableGitInfo works properly for "Last updated" & RSS feed.
git clone https://github.com/platformsh/platformsh-docs.git
# Move the .git repo into the root directory of the app, and delete the old working tree
mv .repo/.git .
rm -rf .repo
# Build the Hugo site
./hugo
# Handle/minify assets
npm run assets-dist
