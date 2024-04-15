#!/usr/bin/env bash

cleanup(){
    echo "* CLEANING UP OLD DOCS INDEX"
    rm -f output/platform_index.json
    rm -f output/upsun_index.json

}

scrape(){
    echo "* SCRAPING EXTERNAL SITES"
    # Scrape all indexes defined in config/scrape.json
    DATA=scrape.json
    for i in $(jq '.indexes | keys | .[]' $DATA); do
        index=`echo $i | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/'`
        echo "* REMOVING OLD $index INDEX"
        rm -f output/$index.json
        index_spider=$(jq --arg index "$index" '.indexes[$index].spider' $DATA)
        spider=`echo $index_spider | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/'`
        echo "- Scraping $index..."
        poetry run scrapy runspider -o output/$index.json $spider -L ERROR
    done
}

update_index(){
    echo "* UPDATING INDEX"
    POETRY_LOCATION=/app/.local/bin/poetry
    # Update indexes
    $POETRY_LOCATION run python createPrimaryIndex.py platform
    $POETRY_LOCATION run python createPrimaryIndex.py upsun
    $POETRY_LOCATION run python main.py platform
    $POETRY_LOCATION run python main.py upsun
}

# scrape
update_index