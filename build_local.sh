#!/usr/bin/env bash

clean_dir () {
    DIRECTORY=$1
    if [ -d "$DIRECTORY" ]; then
        echo "$DIRECTORY exists. Removing..."
        rm -rf $DIRECTORY
        echo "Done."
    else
        echo "$DIRECTORY does not exist. All is well."
    fi
}

clean_file () {
    FILE=$1
    if [ -f "$FILE" ]; then
        echo "$FILE exists. Removing..."
        rm $FILE
        echo "Done."
    else
        echo "$FILE does not exist. All is well."
    fi
}

BUILD_DIR=$1
cd sites/$BUILD_DIR

clean_file postcss.config.js
clean_dir fetchedFilesCache
clean_dir node_modules
clean_dir public
clean_dir resources

cp ../../themes/psh-docs/postcss.config.js .
npm install
npm run build
npm run build:search
hugo

clear

printf "


BUILD COMPLETE

Verify the resulting build by running the command

python3 -m http.server 8888 -d sites/$BUILD_DIR/public

"
