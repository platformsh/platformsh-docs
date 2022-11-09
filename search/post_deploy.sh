#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP OLD DOCS INDEX"
    rm -f output/docs.json
}

getDocsData() {
    # Get the frontend URL
    FRONTEND_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key')
    # Delete docs index in the mount if it exists
    rm -f data/index.json
    # Get the updated index for docs
    curl -s "${FRONTEND_URL}index.json" >> data/index.json
    # Delete templates index in the mount if it exists
    rm -f data/templates.yaml
    # Get the updated index for templates
    curl -s "${FRONTEND_URL}files/indexes/templates.yaml" >> data/templates.yaml
}

update_index(){
    echo "* UPDATING INDEX"
    # Create indices for templates and docs
    $POETRY_LOCATION run python createPrimaryIndex.py
    # Update indexes
    $POETRY_LOCATION run python main.py
}

set -e

cleanup 

POETRY_LOCATION=/app/.local/bin/poetry

if [ -z ${PLATFORM_APP_DIR+x} ]; then 
    echo "Using local poetry."

    POETRY_LOCATION=poetry
else 
    getDocsData
fi

update_index
