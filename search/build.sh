#!/usr/bin/env bash

# Install Meilisearch
curl -L https://install.meilisearch.com | sh

# Install poetry
curl https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py >> get-poetry.py
python get-poetry.py --version $POETRY_VERSION

. $PLATFORM_APP_DIR/.poetry/env
echo ". $PLATFORM_APP_DIR/.poetry/env" >> ~/.bash_profile

# poetry config virtualenvs.create false
# poetry config virtualenvs.in-project true
poetry install -vvv

# Make scraping script executable
chmod +x ./scrape.sh
# Install Meilisearch
# curl -L https://install.meilisearch.com | sh

# # Install poetry
# # pip install --upgrade pip
# # pip install poetry
# curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
# . .poetry/bin/poetry

# # Install dependencies for scrapy
# poetry install

# # Make scraping script executable
# chmod +x ./scrape.sh
