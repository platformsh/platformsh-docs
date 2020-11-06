#!/usr/bin/env bash

downloadHugo(){
    DOWNLOAD=https://github.com/gohugoio/hugo/releases/download/v$HUGOVERSION/hugo_${HUGOVERSION}_Linux-64bit.tar.gz
    wget --quiet -c $DOWNLOAD -O - | tar -xz
}

getExampleFiles(){
    # Fetch example files
    npm run fetch-files

    # Update config snippets from registry
    npm run registry-files
}

buildSearchApp(){
    echo "Building the search app"
    # Build Interface app for XSS
    cd $PLATFORM_APP_DIR/static/scripts/xss
    npm install
    # npm run-script build
}

buildDocs(){
    cd $PLATFORM_APP_DIR

    # Copy templates index so it will be served for search to grab
    cp data/templates.yaml static/files/indexes
    
    # Build the Hugo site
    ./hugo

    # Handle/minify assets
    npm run assets-dist

    # Copy templates index so it will be served
}

set -e

downloadHugo
getExampleFiles
buildSearchApp
buildDocs