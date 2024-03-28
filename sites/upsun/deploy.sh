#!/usr/bin/env bash

# Get the data
MEILI_CONFIG_DEST=public/scripts/xss/dist/config/config.json

# The index won't be built until the post_deploy hook, so we hardcode it here.
MEILI_INDEX="upsun_docs"

createSearchConfig() {
    # Use the shared PLATFORM_PROJECT_ENTROPY var as MEILI_MASTER_KEY to retrieve the public key for our autocomplete app.
    MEILI_TOKEN=$(curl -s -H "Authorization: Bearer ${PLATFORM_PROJECT_ENTROPY}" -X GET "search.internal/keys" | jq -r '.results[] | select(.name | startswith("Default Search API Key")) | .key')
    # Grab the backend URL so we can complete the query string to the backend search app at runtime.
    MEILI_URL=$(echo "${PLATFORM_ROUTES}" | base64 --decode | jq -r 'to_entries[] | select(.value.id == "search") | .key')
    # Make the config file containing the above information; save it to the already build search/autocomplete React app settings.
    echo $( jq -n --arg ix "${MEILI_INDEX}" --arg key "${MEILI_TOKEN}" --arg url "${MEILI_URL}" '{index: $ix, public_api_key: $key, url: $url}' ) > "${MEILI_CONFIG_DEST}"
}

createSearchConfigLocal(){
    # Get the locally exported MEILI_MASTER_KEY var. (See Readme)
    MEILI_TOKEN=$(curl -s -H "Authorization: Bearer ${MEILI_MASTER_KEY}" -X GET "http://127.0.0.1:7700/keys" | jq -r '.results[] | select(.name | startswith("Default Search API Key")) |.key')
    # Meilisearch local server default.
    MEILI_URL="http://127.0.0.1:7700/"

    # Make the config file to the autocomplete app in public.
    echo $( jq -n --arg ix "${MEILI_INDEX}" --arg key "${MEILI_TOKEN}" --arg url "${MEILI_URL}" '{index: $ix, public_api_key: $key, url: $url}' ) > "${MEILI_CONFIG_DEST}"
    # Also copy to the local development structure.
    echo $( jq -n --arg ix "${MEILI_INDEX}" --arg key "${MEILI_TOKEN}" --arg url "${MEILI_URL}" '{index: $ix, public_api_key: $key, url: $url}' ) > static/scripts/xss/dist/config/config.json
}

set -e

if [ -z ${PLATFORM_APP_DIR+x} ]; then
    createSearchConfigLocal
else
    createSearchConfig
fi
