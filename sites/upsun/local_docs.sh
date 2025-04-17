#!/usr/bin/env bash

echo "Setting up the frontend docs process"
pwd

# 1. Build the search interface.
cd docs
npm install
npm run dev
# npm run build:search
hugo

# 2. Update the Meilisearch server.

cd ../search
# Update the index
./post_deploy.sh

# 3. Run the docs development server.
cd ../docs
hugo serve
