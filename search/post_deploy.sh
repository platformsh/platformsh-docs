#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP MOUNTS"
    # Delete the existing data in mount. Updates to upstream can cause incompatibility failure.
    rm -rf data.ms/*
    # Clean up output mounts.
    OUTPUT_DIR=output
    rm $OUTPUT_DIR/*.json
}

getDocsData(){
    # Get the frontend URL
    FRONTEND_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary) | .key')
    # Delete docs index in the mount if it exists
    [ ! -e config/index.json ] || rm config/index.json
    # Get the updated index for docs
    curl "${FRONTEND_URL}index.json" >> config/index.json
    # Delete templates index in the mount if it exists
    [ ! -e config/templates.yaml ] || rm config/templates.yaml
    # Get the updated index for templates
    curl "${FRONTEND_URL}files/indexes/templates.yaml" >> config/templates.yaml
    
}

scrape(){
    echo "* SCRAPING SITES"
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

update_index(){
    echo "* UPDATING INDEX"
    # Create indices for templates and docs
    poetry run python createPrimaryIndex.py
    # Update indexes
    poetry run python main.py
    # Update url attribute for docs to retrieve
    # poetry run python update_url.py
}

set -e 

# Source the Poetry command.
. $PLATFORM_APP_DIR/.poetry/env

cleanup 
scrape 
update_index
