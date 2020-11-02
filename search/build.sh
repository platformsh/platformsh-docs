#!/usr/bin/env bash

# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Install poetry
# pip install --upgrade pip
# pip install poetry
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -

# Install dependencies for scrapy
poetry install

# Make scraping script executable
chmod +x ./scrape.sh
