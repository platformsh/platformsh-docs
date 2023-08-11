#!/usr/bin/env bash

ENVIRONMENT=$1
PARENT=$2

# Create the new environment
platform branch $ENVIRONMENT $PARENT

# Open a tunnel to the current environment
platform tunnel:open --no-interaction

# Mock Platform.sh environment variables
export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
# Add any other variables you need

# If necessary, install dependencies here

# Add the command to run the server
