
#!/usr/bin/env bash

createSearchConfig() {
    # Get the data
    MEILI_CONFIG_DEST=public/scripts/xss/dist/config/config.json
    MEILI_INDEX=$(curl -s -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "search.internal/indexes" | jq -r ".[0].uid")
    MEILI_TOKEN=$(curl -s -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "search.internal/keys" | jq -r ".public")
    MEILI_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id == "search") | .key')
    # Delete config file in the mount if it exists
    [ ! -e $MEILI_CONFIG_DEST ] || rm $MEILI_CONFIG_DEST
    # Make the config file
    echo $( jq -n --arg ix $MEILI_INDEX --arg key $MEILI_TOKEN --arg url $MEILI_URL '{index: $ix, public_api_key: $key, url: $url}' ) >> $MEILI_CONFIG_DEST
}

set -e
createSearchConfig
