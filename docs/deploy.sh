#!/usr/bin/env bash

moveDataToNS(){
      cp data/templates.yaml public/scripts/xss/dist/config/templates.yaml
      cp public/index.json public/scripts/xss/dist/config/index.json
}

set -e

moveDataToNS

node test.js