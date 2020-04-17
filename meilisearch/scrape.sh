#!/usr/bin/env bash
cd $PLATFORM_APP_DIR/meilisearch

rm output/*.json

echo "Indexing docs.platform.sh..."
pipenv run scrapy runspider --output -t=jsonlines -o $PLATFORM_APP_DIR/meilisearch/output/docs.json docs/spiders/docsspider.py -L ERROR
# echo "Indexing community.platform...."
# pipenv run scrapy runspider --output -t=jsonlines -o $PLATFORM_APP_DIR/meilisearch/output/community.json docs/spiders/communityspider.py -L ERROR
echo "Indexing platform.sh..."
pipenv run scrapy runspider --output -t=jsonlines -o $PLATFORM_APP_DIR/meilisearch/output/website.json docs/spiders/websitespider.py -L ERROR
# pipenv run scrapy runspider --output -t=jsonlines -o $PLATFORM_APP_DIR/output/meilisearch/apidocs.json docs/spiders/apidocsspider.py
