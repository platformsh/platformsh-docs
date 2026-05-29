#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP OLD DOCS INDEX"
    rm -v output/platform_docs.json && echo "output json for platform deleted" || echo "failed to delete output json for platform"
}

getDocsData() {
    # Get the frontend URLs
    PLATFORM_DOCS_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key')
    
    printf "URL for platform docs: %s\n" "${PLATFORM_DOCS_URL}"

    # Delete docs index in the mount if it exists
    rm -v data/platform_index.json && echo "data json for platform deleted" || echo "failed to delete data json for platform"

    # remove the previous headers log
    if [ -f "data/platform-headers.txt" ]; then
      rm data/platform-headers.txt || echo "Failed to delete platform-headers.txt"
    fi

    if [ -f "data/upsun-headers.txt" ]; then
      rm data/upsun-headers.txt || echo "Failed to delete upsun-headers.txt"
    fi

    # Get the updated index for docs
    # * change the user agent so we can more easily locate in the apps' access logs
    # * save the http response as a json file in ./data
    # * save the response headers in ./data
    curl --user-agent "request-search-index-for-platform-docs" -s -D - -o data/platform_index.json "${PLATFORM_DOCS_URL}index.json" >> data/platform-headers.txt
    
    # Delete templates index in the mount if it exists
    rm -f data/platform_templates.yaml || echo "Failed to delete platform_templates.yaml"

    # Get the updated index for templates
    curl -s "${PLATFORM_DOCS_URL}files/indexes/templates.yaml" >> data/platform_templates.yaml || echo "Failed to retrieve templates.yaml"
}

update_index(){
    echo "* UPDATING INDEX"
    POETRY_LOCATION=/app/.local/bin/poetry
    # Create indices for templates and docs
    $POETRY_LOCATION run python createPrimaryIndex.py platform || echo "Failed to run CreatePrimayIndex for platform"
    
    # Update indexes
    $POETRY_LOCATION run python main.py platform || echo "Failed to run main.py for platform"
}

save_headers() {
  docs="${1}"
  timestamp=$(date +%Y-%m-%d-%H-%M-%S)
  if [ -f "./data/${docs}-headers.txt" ]; then
    #rename the file so we can examine it
    mv "./data/${docs}-headers.txt" "./data/${docs}-headers-${timestamp}.txt" || printf "Failed to rename %s\n" "${docs}-headers.txt"
    echo "Header responses for ${docs} saved."
  else
    echo "Header response log file for ${docs} is missing! Unable to save."
  fi
}

# 20251121 - PFG - Product changed how results for activities are reported. If this post deploy script exits with anything
# other than 0 - say an exit 60 because curl hit a cert issue - then the deploy/activate activity is marked as a failure.
# given the state of the environment's deployment is more important than the success of this post-deploy script, the
# suggestion is that we make sure scripts exit with 0. It's possible they will change this behavior, so for now, we'll
# remove set -e to prevent the script from exiting and prevent us from determining if the environment deployed. Our E2E
# tests should catch if the indexes failed to generate correctly. Once they change the behavior, we should be able to
# come back here and re-enable set -e
# set -e

cleanup

# if [ -z ${PLATFORM_APP_DIR+x} ]; then
#     echo "Using local poetry."

#     POETRY_LOCATION=poetry
# else
#     getDocsData
# fi

getDocsData
update_index
exit 0
