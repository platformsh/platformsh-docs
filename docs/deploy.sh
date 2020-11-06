#!/usr/bin/env bash

createSearchConfig(){
    # Get the data
    export MEILI_INDEX=$(curl -s -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "http://search.internal/indexes" | jq -r ".[0].uid")
    export MEILI_TOKEN=$(curl -s -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "search.internal/keys" | jq -r ".public")
    export MEILI_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id == "search") | .key')
    # Delete config file in mount if it exists
    [ ! -e public/scripts/xss/dist/config.json ] || rm public/scripts/xss/dist/config.json
    # Make the config file
    echo $( jq -n --arg ix $MEILI_INDEX --arg key $MEILI_TOKEN --arg url $MEILI_URL '{index: $ix, public_key: $key, url: $url}' ) >> public/scripts/xss/dist/config.json
}

set -e
createSearchConfig
