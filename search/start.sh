#!/usr/bin/env bash

# When we upgrade Meilisearch to a new version, the old database becomes incompatible and search fails to deploy. 
# This function is run before the index is updated. It compares the "live" version @ /version and compares to the 
#   current database version kept in the `data.ms/VERSION` text file. If not equal, the index is deleted prior to updating
#   the index. 
deleteIndexPreMeilisearchUpgrade() {
    MEILIVERSION_DB=$(cat data.ms/VERSION)
    echo "  > Downloaded version: $MEILISEARCH_VERSION"
    echo "  > Current database version: $MEILIVERSION_DB"
    if [ "$MEILISEARCH_VERSION" != "$MEILIVERSION_DB" ]; then
        echo "  > Meilisearch was upgraded. Deleting old index before start."
        rm -rf data.ms/*
    fi
}

# Delete previous database files if upgrading.
deleteIndexPreMeilisearchUpgrade

echo "Starting Meilisearch"
# Start the server.
./meilisearch --http-addr localhost:${PORT} --master-key $PLATFORM_PROJECT_ENTROPY
