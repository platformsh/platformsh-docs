#!/usr/bin/env bash

ENVIRONMENT=$1
PARENT=$2

# Create the new environment
platform branch $ENVIRONMENT $PARENT

# Open a tunnel to the current environment
platform tunnel:open --no-interaction

# Mock Platform.sh environment variables
export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature

# Install dependencies
pipenv install

# Collect static assets
pipenv run python manage.py collectstatic

# Run the server
pipenv run python manage.py runserver
