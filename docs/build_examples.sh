#!/usr/bin/env bash

# Treat individual build step errors as fatal for the whole build process.
set -e

# Fetch example files
npm run fetch-files

# Update config snippets from registry
npm run registry-files
