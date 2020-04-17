#!/usr/bin/env bash

# Setting up the Hugo site
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


# Meilisearch

# Install Meilisearch
cd $PLATFORM_APP_DIR/meilisearch
curl -L https://install.meilisearch.com | sh

# Install its dependencies
cd $PLATFORM_APP_DIR/meilisearch

# Setuptools is outdated on node containers, this is a fix.
pip3 install setuptools --upgrade --ignore-installed
pip3 install wheel --upgrade --ignore-installed
pip3 install pipenv --upgrade --ignore-installed
pipenv install

# Allow scrape script to execute
chmod +x ./scrape.sh

# Build Interface
cd $PLATFORM_APP_DIR/static/scripts/xss
# mv interface/* interface/.* public/scripts/xss
npm install
npm run-script build

# Building the Hugo site

cd $PLATFORM_APP_DIR

# Build the site
./hugo

npm run assets-dist

# # Move interface to Hugo source
# mv interface/* interface/.* public/scripts/xss
