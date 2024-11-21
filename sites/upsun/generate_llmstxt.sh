#!/usr/bin/env bash

# Treat individual build step errors as fatal for the whole build process.
set -e

ls -la public/

## install Pandoc https://pandoc.org/installing.html#linux
git clone https://github.com/jgm/pandoc

ls -la pandoc

./pandoc/pandoc public/llms.txt -o public/llms.txt -f markdown+raw_html -t markdown
