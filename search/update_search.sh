#!/usr/bin/env bash

. $PLATFORM_APP_DIR/.poetry/env

# Delete the existing data in mount. Updates to upstream can cause incompatibility failure.
rm -rf data.ms/*

# Scrape sites
./scrape.sh

# Create indices for templates and docs
poetry run python createPrimaryIndex.py

# Update indexes
poetry run python main.py

# Update url attribute for docs to retrieve
poetry run python update_url.py
