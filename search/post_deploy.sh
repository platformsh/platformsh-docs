#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP OLD DATA"
    # Clean up output mounts.
    OUTPUT_DIR=output
    rm -f $OUTPUT_DIR/*.json
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

scrape(){
    echo "* SCRAPING EXTERNAL SITES"
    # Scrape all indexes defined in config/scrape.json
    DATA=scrape.json
    for i in $(jq '.indexes | keys | .[]' $DATA); do
        index=`echo $i | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/'`
        index_spider=$(jq --arg index "$index" '.indexes[$index].spider' $DATA)
        spider=`echo $index_spider | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/'`
        echo "- Scraping $index..."
        poetry run scrapy runspider --output -t=jsonlines -o output/$index.json $spider -L ERROR
    done
}

# When we upgrade Meilisearch to a new version, the old database becomes incompatible and search fails to deploy. 
# This function is run before the index is updated. It compares the "live" version @ /version and compares to the 
#   current database version kept in the `data.ms/VERSION` text file. If not equal, the index is deleted prior to updating
#   the index. 
deleteIndexPreMeilisearchUpgrade() {

    # Local
    if [ -z ${PLATFORM_PROJECT_ENTROPY+x} ]; then 
        MEILI_URL=http://127.0.0.1:7700
        MEILIVERSION_LIVE=$(curl -s -H "X-Meili-API-Key: $MEILI_MASTER_KEY" -X GET "$MEILI_URL/version" | jq -r ".pkgVersion" )
        MEILIVERSION_DB=$(cat data.ms/VERSION)
        echo "  > Live Meilisearch version: $MEILIVERSION_LIVE"
        echo "  > Current database version: $MEILIVERSION_DB"
        if [ "$MEILIVERSION_LIVE" != "$MEILIVERSION_DB" ]; then
            echo "  > Meilisearch upgraded. Deleting old index."
            rm -rf data.ms/*
        fi
    # Platform.sh
    else
        MEILI_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id == "search") | .key')
        ENDPOINT=version
        MEILIVERSION_LIVE=$(curl -s -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "$MEILI_URL$ENDPOINT" | jq -r ".pkgVersion" )
        MEILIVERSION_DB=$(cat data.ms/VERSION)
        echo "  > Live Meilisearch version: $MEILIVERSION_LIVE"
        echo "  > Current database version: $MEILIVERSION_DB"
        if [ "$MEILIVERSION_LIVE" != "$MEILIVERSION_DB" ]; then
            echo "Meilisearch was upgraded. Deleting old index."
            rm -rf data.ms/*
        fi
    fi

}

update_index(){
    echo "* UPDATING INDEX"
    # Delete data if there is a Meilisearch upgrade.
    deleteIndexPreMeilisearchUpgrade
    # Create indices for templates and docs
    poetry run python createPrimaryIndex.py
    # Update indexes
    poetry run python main.py
}

set -e

cleanup 

if [ -z ${PLATFORM_APP_DIR+x} ]; then 
    echo "Using local poetry."
else 
    # Source the Poetry command.
    . $PLATFORM_APP_DIR/.poetry/env
    getDocsData
fi

scrape 
update_index
