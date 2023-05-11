#!/usr/bin/env bash

install_meilisearch() {
    unset "${MEILI_MASTER_KEY}"
    echo "* INSTALLING MEILISEARCH"
    # Replicates Meilisearch download (https://github.com/meilisearch/MeiliSearch/blob/master/download-latest.sh) with locked version.
    release_file="meilisearch-linux-amd64"

    if [ ! -f "${PLATFORM_CACHE_DIR}/${MEILISEARCH_VERSION}-${release_file}" ]; then
      echo "We do not have the meilisearch binary in cache. Retrieving..."
      # if we dont have the meilisearch binary, download the designated version, and save it into the cache dir
      curl -o "${PLATFORM_CACHE_DIR}/${MEILISEARCH_VERSION}-${release_file}" -L "https://github.com/meilisearch/MeiliSearch/releases/download/v${MEILISEARCH_VERSION}/${release_file}"
    fi

    echo "Copying the meilisearch binary from cache into the application."
    cp "${PLATFORM_CACHE_DIR}/${MEILISEARCH_VERSION}-${release_file}" "${PLATFORM_APP_DIR}/meilisearch"
    chmod 744 "${PLATFORM_APP_DIR}/meilisearch"
}

install_poetry(){
    echo "* Updating pip"
    python3.10 -m pip install --upgrade pip
    echo "* Installing poetry"
    # Install poetry
    export PIP_USER=false
    pipx install poetry=="${POETRY_VERSION}"
    echo "* Installing dependencies"
    /app/.local/bin/poetry install
}

set -e

install_meilisearch
install_poetry

