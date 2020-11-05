#!/usr/bin/env bash

moveDataToNS(){
      cp data/templates.yaml public/scripts/xss/dist/config/templates.yaml
      cp public/index.json public/scripts/xss/dist/config/index.json
}

set -e

# export PUBLIC_TOKEN=$(curl -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "search.internal/keys" | jq -r ".public")

moveDataToNS

node test.js