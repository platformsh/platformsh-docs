#!/usr/bin/env bash

# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Install poetry
curl https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py >> get-poetry.py
python get-poetry.py --version $POETRY_VERSION

# Source the Poetry command.
. $PLATFORM_APP_DIR/.poetry/env
# Add Poetry to .bash_profile, so available during SSH.
echo ". $PLATFORM_APP_DIR/.poetry/env" >> ~/.bash_profile

# Install dependencies.
poetry install

# Make scraping script executable
chmod +x ./scrape.sh
