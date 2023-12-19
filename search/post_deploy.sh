#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP OLD DOCS INDEX"
    rm -v output/platform_docs.json && echo "output json for platform deleted" || echo "failed to delete output json for platform"
    rm -v output/friday_docs.json && echo "output json for upsun deleted" || echo "failed to delete output json for upsun"
}

getDocsData() {
    # Get the frontend URLs
    PLATFORM_DOCS_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key')
    FRIDAY_DOCS_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id=="friday") | .key')

    printf "URL for platform docs: %s\n" "${PLATFORM_DOCS_URL}"
    printf "URL for upsun docs: %s\n" "${FRIDAY_DOCS_URL}"

    # Delete docs index in the mount if it exists
    rm -v data/platform_index.json && echo "data json for platform deleted" || echo "failed to delete data json for platform"
    rm -v data/friday_index.json && echo "data json for upsun deleted" || echo "failed to delete data json for upsun"

    # Get the updated index for docs
    curl -s "${PLATFORM_DOCS_URL}index.json" >> data/platform_index.json && echo "retrieved psh index" || echo "failed to retrieve psh index"
    curl -s "${FRIDAY_DOCS_URL}index.json" >> data/friday_index.json && echo "retrieved upsun index" || echo "failed to retrieve upsun index"

    # How many times does Platform.sh appear in the platform index? Should be 3815
    pshOccurrenceInPsh=$(cat data/platform_index.json | grep -o -i Platform.sh | wc -l)
    # How many times does Platform.sh appear in the Upsun index? should be 33
    pshOccurrenceInUpsun=$(cat data/friday_index.json | grep -o -i Platform.sh | wc -l)
    #How many times does Upsun appear in the platform index? Should be 0
    upsunOccurrenceInPsh=$(cat data/platform_index.json | grep -o -i Upsun | wc -l)
    #how many times does Upsun appear in the upsun index? Should be 4616
    upsunOccurrenceInUpsun=$(cat data/friday_index.json | grep -o -i Upsun | wc -l)

    printf "Upsun appears %d times in the platform index.\nUpsun appears %d times in the Upsun index.\n" "${upsunOccurrenceInPsh}" "${upsunOccurrenceInUpsun}"
    printf "Platform appears %d times in the platform index.\nPlatform appears %d times in the Upsun index.\n" "${pshOccurrenceInPsh}" "${pshOccurrenceInUpsun}"


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
