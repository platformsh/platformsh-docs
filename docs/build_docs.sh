#!/usr/bin/env bash

# Treat individual build step errors as fatal for the whole build process.
set -e

# Build Interface app for search/autocomplete
npm run build:search

# Copy templates index so it will be served for search to grab
mkdir static/files/indexes && cp data/templates.yaml static/files/indexes/templates.yaml

# Get Hugo
# @todo this assumes that we don't need to worry about cleaning up old versions of the hugo archive because the build
# cache is reset every so often
if [ ! -f "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}_Linux-64bit/hugo" ]; then
  # we don't have the file. Do we have the original archive?
  if [! -f "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}_Linux-64bit.tar.gz"]; then
    wget --quiet -c ${DOWNLOAD} -o ${PLATFORM_CACHE_DIR}
  fi

  #now that we know we have the archive, let's extract
  # extract just the hugo executable from the archive to our cache directory
  tar -C ${PLATFORM_CACHE_DIR} -xf "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}_Linux-64bit.tar.gz" hugo
fi

cp "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}_Linux-64bit/hugo" "${PLATFORM_APP_DIR}"

# Build the Hugo site
./hugo
