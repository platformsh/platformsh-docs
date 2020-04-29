#!/usr/bin/env bash

# Scrape sites
./scrape.sh

# Create indices for templates and docs
pipenv run python createPrimaryIndex.py

# Update indexes
pipenv run python main.py

# Update url attribute for docs to retrieve
pipenv run python update_url.py
