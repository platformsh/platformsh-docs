#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP OLD DOCS INDEX"
    rm -f output/platform_docs.json
    rm -f output/friday_docs.json
}

getDocsData() {
    # Get the frontend URLs
    PLATFORM_DOCS_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key')
    FRIDAY_DOCS_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id=="friday") | .key')
    
    # Delete docs index in the mount if it exists
    rm -f data/platform_index.json
    rm -f data/friday_index.json

    # Get the updated index for docs
    curl -s "${PLATFORM_DOCS_URL}index.json" >> data/platform_index.json
    curl -s "${FRIDAY_DOCS_URL}index.json" >> data/friday_index.json

    # Delete templates index in the mount if it exists
    rm -f data/platform_templates.yaml
    rm -f data/friday_templates.yaml

    # Get the updated index for templates
    curl -s "${PLATFORM_DOCS_URL}files/indexes/templates.yaml" >> data/platform_templates.yaml

    # @todo: For now, reuse the same index. To be removed entirely.
    cp data/platform_templates.yaml data/friday_templates.yaml
}

update_index(){
    echo "* UPDATING INDEX"
    POETRY_LOCATION=/app/.local/bin/poetry
    # Create indices for templates and docs
    $POETRY_LOCATION run python createPrimaryIndex.py platform
    $POETRY_LOCATION run python createPrimaryIndex.py friday

    # Update indexes
    $POETRY_LOCATION run python main.py platform
    $POETRY_LOCATION run python main.py friday
}

set -e

cleanup 

# if [ -z ${PLATFORM_APP_DIR+x} ]; then 
#     echo "Using local poetry."

#     POETRY_LOCATION=poetry
# else 
#     getDocsData
# fi

getDocsData
update_index
