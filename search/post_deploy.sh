#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP OLD DOCS INDEX"
    rm -v output/platform_docs.json && echo "output json for platform deleted" || echo "failed to delete output json for platform"
    rm -v output/upsun_docs.json && echo "output json for upsun deleted" || echo "failed to delete output json for upsun"
}

getDocsData() {
    # Get the frontend URLs
    PLATFORM_DOCS_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key')
    UPSUN_DOCS_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id=="upsun") | .key')

    printf "URL for platform docs: %s\n" "${PLATFORM_DOCS_URL}"
    printf "URL for upsun docs: %s\n" "${UPSUN_DOCS_URL}"

    # Delete docs index in the mount if it exists
    rm -v data/platform_index.json && echo "data json for platform deleted" || echo "failed to delete data json for platform"
    rm -v data/upsun_index.json && echo "data json for upsun deleted" || echo "failed to delete data json for upsun"

    # remove the previous headers log
    if [ -f "data/platform-headers.txt" ]; then
      rm data/platform-headers.txt
    fi

    if [ -f "data/upsun-headers.txt" ]; then
      rm data/upsun-headers.txt
    fi

    # Get the updated index for docs
    # * change the user agent so we can more easily locate in the apps' access logs
    # * save the http response as a json file in ./data
    # * save the response headers in ./data
    # curl --user-agent "request-to-upsun-docs" -s -D - -o foobar.json "https://docs.upsun.com/index.json" >> headers.txt
    curl --user-agent "request-search-index-for-platform-docs" -s -D - -o data/platform_index.json "${PLATFORM_DOCS_URL}index.json" >> data/platform-headers.txt
    #curl -s "${PLATFORM_DOCS_URL}index.json" >> data/platform_index.json && echo "retrieved psh index" || echo "failed to retrieve psh index"
    curl --user-agent "request-search-index-for-upsun-docs" -s -D - -o data/upsun_index.json "${UPSUN_DOCS_URL}index.json" >> data/upsun-headers.txt
    #curl -s "${UPSUN_DOCS_URL}index.json" >> data/upsun_index.json && echo "retrieved upsun index" || echo "failed to retrieve upsun index"

    # How many times does Platform.sh appear in the platform index? Should be 3815
    pshOccurrenceInPsh=$(cat data/platform_index.json | grep -o -i Platform.sh | wc -l)
    # How many times does Platform.sh appear in the Upsun index? should be 33
    pshOccurrenceInUpsun=$(cat data/upsun_index.json | grep -o -i Platform.sh | wc -l)
    #How many times does Upsun appear in the platform index? Should be 0
    upsunOccurrenceInPsh=$(cat data/platform_index.json | grep -o -i Upsun | wc -l)
    #how many times does Upsun appear in the upsun index? Should be 4616
    upsunOccurrenceInUpsun=$(cat data/upsun_index.json | grep -o -i Upsun | wc -l)

    printf "Upsun appears %d times in the platform index.\nUpsun appears %d times in the Upsun index.\n" "${upsunOccurrenceInPsh}" "${upsunOccurrenceInUpsun}"
    printf "Platform appears %d times in the platform index.\nPlatform appears %d times in the Upsun index.\n" "${pshOccurrenceInPsh}" "${pshOccurrenceInUpsun}"


    if (( pshOccurrenceInUpsun > 100 )); then
      echo "Appears our search indexes have flipped. Platform occurs too many times in the Upsun docs! Saving headers... ";
      save_headers "platform"
    fi

    if (( upsunOccurrenceInPsh > 0 )); then
      echo "Appears our search indexes have flipped. Upsun occurs too many times in the Platform docs! Saving headers... ";
      save_headers "upsun"
    fi

    # Delete templates index in the mount if it exists
    rm -f data/platform_templates.yaml
    rm -f data/upsun_templates.yaml

    # Get the updated index for templates
    curl -s "${PLATFORM_DOCS_URL}files/indexes/templates.yaml" >> data/platform_templates.yaml

    # @todo: For now, reuse the same index. To be removed entirely.
    cp data/platform_templates.yaml data/upsun_templates.yaml
}

update_index(){
    echo "* UPDATING INDEX"
    POETRY_LOCATION=/app/.local/bin/poetry
    # Create indices for templates and docs
    $POETRY_LOCATION run python createPrimaryIndex.py platform
    $POETRY_LOCATION run python createPrimaryIndex.py upsun

    # Update indexes
    $POETRY_LOCATION run python main.py platform
    $POETRY_LOCATION run python main.py upsun
}

save_headers() {
  docs="${1}"
  timestamp=$(date +%Y-%m-%d-%H-%M-%S)
  if [ -f "./data/${docs}-headers.txt" ]; then
    #rename the file so we can examine it
    mv "./data/${docs}-headers.txt" "./data/${docs}-headers-${timestamp}.txt"
    echo "Header responses for ${docs} saved."
  else
    echo "Header response log file for ${docs} is missing! Unable to save."
  fi
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
