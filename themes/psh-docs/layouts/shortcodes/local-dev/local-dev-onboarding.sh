#!/usr/bin/env bash

ENVIRONMENT=$1
PARENT=$2

# Create the new environment
{{ `{{< vendor/cli >}}` | .Page.RenderString }} branch $ENVIRONMENT $PARENT

# Open a tunnel to the current environment
{{ `{{< vendor/cli >}}` | .Page.RenderString }} tunnel:open --no-interaction

# Mock {{ `{{< vendor/name >}}` | .Page.RenderString }} environment variables
export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
# Add any other variables you need

# If necessary, install dependencies here

# Add the command to run the server
