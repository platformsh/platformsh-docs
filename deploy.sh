#!/usr/bin/env bash

cd $PLATFORM_APP_DIR/meilisearch

# Scrape sites
./scrape.sh

# Update indexes
pipenv run python main.py
