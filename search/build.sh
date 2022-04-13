#!/usr/bin/env bash

install_meilisearch() {
    unset $MEILI_MASTER_KEY
    echo "* INSTALLING MEILISEARCH"
    # Replicates Meilisearch download (https://github.com/meilisearch/MeiliSearch/blob/master/download-latest.sh) with locked version.
    release_file="meilisearch-linux-amd64"
    curl -OL "https://github.com/meilisearch/MeiliSearch/releases/download/v$MEILISEARCH_VERSION/$release_file"
    mv "$release_file" "meilisearch"
    chmod 744 "meilisearch"
}

install_poetry(){
    echo "* Updating pip"
    python3.9 -m pip install --upgrade pip
    echo "* Installing poetry"
    # Install poetry
    curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
    echo "* Installing dependencies"
    poetry install
}

set -e

install_meilisearch
install_poetry

