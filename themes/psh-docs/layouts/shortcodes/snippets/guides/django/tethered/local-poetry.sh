#!/usr/bin/env bash

ENVIRONMENT=$1
PARENT=$2

# Create the new environment
{{ `{{< vendor/cli >}}` | .Page.RenderString }} branch $ENVIRONMENT $PARENT

# Open a tunnel to the current environment
{{ `{{< vendor/cli >}}` | .Page.RenderString }} tunnel:open --no-interaction

# Mock {{ `{{< vendor/name >}}` | .Page.RenderString }} environment variables
export PLATFORM_RELATIONSHIPS="$({{ `{{< vendor/cli >}}` | .Page.RenderString }} tunnel:info --encode)"
export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature

# Install dependencies
poetry install

# Collect static assets
poetry run python manage.py collectstatic

# Run the server
poetry run python manage.py runserver
