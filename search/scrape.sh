#!/usr/bin/env bash

# Clean up mounts
OUTPUT_DIR=output
rm $OUTPUT_DIR/*.json

# Source the Poetry command.
# . $PLATFORM_APP_DIR/.poetry/env

# Scrape all indexes defined in config/scrape.json
DATA=scrape.json
for i in $(jq '.indexes | keys | .[]' $DATA); do
  index=`echo $i | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/'`
  index_spider=$(jq --arg index "$index" '.indexes[$index].spider' $DATA)
  spider=`echo $index_spider | sed 's/.\(.*\)/\1/' | sed 's/\(.*\)./\1/'`
  echo "- Scraping $index..."
  poetry run scrapy runspider --output -t=jsonlines -o output/$index.json $spider -L ERROR
done
