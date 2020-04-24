#!/usr/bin/env bash

# Scrape sites
./scrape.sh

# Create index for templates
pipenv run python createtemplateindex.py

# Update indexes
pipenv run python main.py

# Update url attribute for docs to retrieve (keep in deploy hook?)
pipenv run python update_url.py
