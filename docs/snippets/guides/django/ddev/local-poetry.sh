#!/usr/bin/env bash

PROJECT=$1
ENVIRONMENT=$2
PARENT=$3

# Create the new environment
platform branch $ENVIRONMENT $PARENT

# Configure DDEV
ddev config --auto
ddev config --web-environment-add PLATFORM_PROJECT=$PROJECT
ddev config --web-environment-add PLATFORM_ENVIRONMENT=$ENVIRONMENT
ddev config --webimage-extra-packages python-is-python3

ddev get drud/ddev-platformsh

# Update .ddev/config.platformsh.yaml
#   1. hooks.post-start
printf "  # Platform.sh start command\n  - exec: |\n      poetry run python manage.py runserver 0.0.0.0:8000" >> .ddev/config.platformsh.yaml
#   2. php_version
grep -v "php_version" .ddev/config.platformsh.yaml > tmpfile && mv tmpfile .ddev/config.platformsh.yaml
printf "\nphp_version: 8.0" >> .ddev/config.platformsh.yaml

# Create a docker-compose.django.yaml
printf "
version: \"3.6\"
services:
    web:
        expose:
            - 8000
        environment:
            - HTTP_EXPOSE=80:8000
            - HTTPS_EXPOSE=443:8000
        healthcheck:
            test: \"true\"
" > .ddev/docker-compose.django.yaml

# Create Dockerfile.python
printf "
RUN apt-get install -y python3.10 python3-pip
" > .ddev/web-build/Dockerfile.python

ddev start
ddev pull platform -y
ddev restart
