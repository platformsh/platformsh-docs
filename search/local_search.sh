#!/usr/bin/env bash

# Set the same version as used for the docs
export MEILISEARCH_VERSION=0.30.1
# Determine OS.
SYSTEM=$(python -c "import platform; print platform.system()")
if [ "$SYSTEM" = "Darwin" ]; then
    export RELEASE_FILE=macos-amd64
elif [ "$SYSTEM" = "Linux" ]; then
    export RELEASE_FILE=linux-aarch64
elif [ "$SYSTEM" = "Windows" ]; then
    export RELEASE_FILE=windows-amd64.exe
else
    echo "Your OS is not supported. Exiting."
    exit 1
fi

# 1. Install dependencies and Meilisearch:
cd search
# Install dependencies for communicating with Meilisearch.
poetry install
# Download Meilisearch.
FILE=meilisearch
if test -f "$FILE"; then
    echo "$FILE exists. Skipping installation"
else
    echo "Downloading Meilisearch $MEILISEARCH_VERSION"
    curl -OL "https://github.com/meilisearch/MeiliSearch/releases/download/v$MEILISEARCH_VERSION/$RELEASE_FILE"
    # Make Meilisearch executable – skip for Windows, probably
    mv "$RELEASE_FILE" "meilisearch"
    chmod +x meilisearch
fi

# 2. Run Meilisearch with a master key:

# Set a master key.
export MEILI_MASTER_KEY=test
# Run it.
meilisearch --log-level 'ERROR'
