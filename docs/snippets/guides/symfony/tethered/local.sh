#!/usr/bin/env bash

PROJECT=$1
ENVIRONMENT=$2
PARENT=$3

# Create the new environment
symfony branch $ENVIRONMENT $PARENT

# Open a tunnel to the current environment
symfony tunnel:open --no-interaction

# Start Symfony server
symfony server:start -d
