#!/usr/bin/env bash

# Treat individual build step errors as fatal for the whole build process.
set -e

# Build Interface app for search/autocomplete
npm run build:search

# Copy templates index so it will be served for search to grab
mkdir static/files/indexes && cp ../../shared/data/templates.yaml static/files/indexes/templates.yaml

# Get Hugo
DOWNLOAD="https://github.com/gohugoio/hugo/releases/download/v${HUGOVERSION}/hugo_${HUGOVERSION}_Linux-64bit.tar.gz"
# @todo this assumes that we don't need to worry about cleaning up old versions of the hugo archive because the build
# cache is reset every so often
if [ ! -f "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}/hugo" ]; then
  # we don't have the file. Do we have the original archive?
  echo "Hugo binary is not cached. Going to get it."
  if [ ! -f "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}_Linux-64bit.tar.gz" ]; then
    echo "Hugo archive is not cached. Going to go get it."
    # @todo I wonder if there's a reason we're using wget here instead of curl? :thinkingface:
    wget --quiet -c "${DOWNLOAD}" -P "${PLATFORM_CACHE_DIR}"
  else
    echo "We already have the hugo archive in cache. Continuing."
  fi

  #does our directory for this version of hugo exist?
  if [ ! -d "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}" ]; then
    mkdir -p "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}"
  fi

  #now that we know we have the archive, let's extract
  # extract just the hugo executable from the archive to our cache directory
  echo "Extracting the hugo binary from the hugo archive."
  tar -C "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}" -xf "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}_Linux-64bit.tar.gz" hugo
  echo "Hugo archive extracted."
else
  echo "We already have the hugo binary. Proceeding."
fi

echo "Moving the hugo binary from cache into the application."
cp "${PLATFORM_CACHE_DIR}/hugo_${HUGOVERSION}/hugo" "${PLATFORM_APP_DIR}/sites/platform"

# Build the Hugo site
./hugo
