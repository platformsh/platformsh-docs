
#!/usr/bin/env bash

createSearchConfig() {
    # Get the data
    MEILI_CONFIG_DEST=public/scripts/xss/dist/config/config.json
    # The index won't be built until the post_deploy hook, so we harcode it here.
    MEILI_INDEX="docs"
    # Use the shared PLATFORM_PROJECT_ENTROPY var as MEILI_MASTER_KEY to retrieve the public key for our autocomplete app.
    MEILI_TOKEN=$(curl -s -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "search.internal/keys" | jq -r ".public")
    # Grab the backend URL so we can complete the query string to the backend search app at runtime. 
    MEILI_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id == "search") | .key')
    # Delete config file in the mount if it exists
    rm -f $MEILI_CONFIG_DEST
    # Make the config file containing the above information; save it to the already build search/autocomplete React app settings.
    echo $( jq -n --arg ix $MEILI_INDEX --arg key $MEILI_TOKEN --arg url $MEILI_URL '{index: $ix, public_api_key: $key, url: $url}' ) >> $MEILI_CONFIG_DEST
}

set -e
createSearchConfig
