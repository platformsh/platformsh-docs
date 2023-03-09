#!/usr/bin/env bash

PROJECT=$1
ENVIRONMENT=$2
PARENT=$3

# Create the new environment
symfony branch $ENVIRONMENT $PARENT

# Dump data from the related environment
symfony cloud:db:dump -f dump.sql

# Start Symfony server
symfony server:start -d

# Import dump file locally
symfony console doctrine:query:sql < dump.sql

# Import assets
symfony cloud:mount:download --mount public/var --target ./public/var

# open your local application
symfony open:local
