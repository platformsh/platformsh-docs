---
title: "Configure Django for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Django.
---

{{% guides/config-desc name="Django" %}}

## Requests configuration: `routes.yaml`

{{% guides/config-routes template="django4" name="Django" %}}

## Service configuration: `services.yaml`

{{% guides/config-service name="Django" %}}

Below is an example configuration to make [PostgreSQL](/add-services/postgresql) available for your Django application.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/django4" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

The `.platform.app.yaml file` is the heart of your configuration. It has an [extensive set of options](https://docs.platform.sh/create-apps/app-reference.html) that allow you to configure nearly any aspect of your app. Most of it's explained with comments inline. This file changes over time as you build out your site.

Below are three examples of `.platform.app.yaml` files for Django using Pip, Pipenv, or Poetry to manage dependencies.

{{< codetabs >}}
+++
title=Pip
highlight=yaml
markdownify=false
+++
#########################
# Django 4 using pip
##########################
# Container configuration.

#   The name of this app. Must be unique within a project.
name: 'app'

#   The runtime the application uses.
type: 'python:3.10'

##########################
# Builds and variables

hooks:
    build: |
        set -eu

        # Download the latest version of pip
        python3.10 -m pip install --upgrade pip

        # Install dependencies
        pip install -r requirements.txt

        # Collect static assets
        python manage.py collectstatic

    deploy: python manage.py migrate

##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
web:
    upstream:
        socket_family: unix
    commands:
        start: "gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true

##########################
# Services

# The relationships of the application with services or other applications.
#
# The left-hand side is the name of the relationship as it's exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
relationships:
    database: "db:postgresql"

##########################
# Data and mounts

# The size of the persistent disk of the application (in MB).
disk: 512

# Set a local R/W mount for logs
mounts:
    'logs':
        source: local
        source_path: logs

<--->

+++
title=Pipenv
highlight=yaml
markdownify=false
+++
#########################
# Django4 using pipenv
##########################
# Container configuration.

# The name of this app. Must be unique within a project.
name: 'app'

# The runtime the application uses.
type: 'python:3.10'

##########################
# Builds and variables

# The build-time dependencies of the app. Uncomment if using Pipenv.
dependencies:
    python3:
        pipenv: '2022.9.4'

hooks:
    build: |
        set -eu

        # Download the latest version of pip
        python3.10 -m pip install --upgrade pip

        # Install dependencies
        pipenv install --deploy

        # Collect static assets
        pipenv run python manage.py collectstatic

    deploy: pipenv run python manage.py migrate

##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
web:
    upstream:
        socket_family: unix
    commands:
        start: "pipenv run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true

##########################
# Services

# The relationships of the application with services or other applications.
#
# The left-hand side is the name of the relationship as it's exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
relationships:
    database: "db:postgresql"

##########################
# Data and mounts

# The size of the persistent disk of the application (in MB).
disk: 512

# Set a local R/W mount for logs
mounts:
    'logs':
        source: local
        source_path: logs
    '.cache':
        source: local
        source_path: cache

<--->

+++
title=Poetry
highlight=yaml
markdownify=false
+++
#########################
# Django4 using Poetry
##########################
# Container configuration.

#   The name of this app. Must be unique within a project.
name: 'app'

#   The runtime the application uses.
type: 'python:3.10'

##########################
# Builds and variables

# Build-time visible variables.
variables:
    env:
        POETRY_VERSION: '1.1.14'
        POETRY_VIRTUALENVS_IN_PROJECT: true
        POETRY_VIRTUALENVS_CREATE: false

hooks:
    build: |
        set -eu

        # Download the latest version of pip
        python3.10 -m pip install --upgrade pip

        # Install and configure Poetry
        #   NOTE: There is a matching export PATH=... in `.environment`, which allows the use of Poetry
        #     in the deploy hook, start command, and during SSH sessions. Make sure to include in your
        #     own projects.
        export PIP_USER=false
        curl -sSL https://install.python-poetry.org | python3 - --version $POETRY_VERSION
        export PATH="/app/.local/bin:$PATH"
        export PIP_USER=true

        # Install dependencies
        poetry install

        # Collect static assets
        poetry run python manage.py collectstatic

    deploy: poetry run python manage.py migrate

##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
web:
    upstream:
        socket_family: unix
    commands:
        start: "poetry run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true

##########################
# Services

# The relationships of the application with services or other applications.
#
# The left-hand side is the name of the relationship as it's exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
relationships:
    database: "db:postgresql"

##########################
# Data and mounts

# The size of the persistent disk of the application (in MB).
disk: 512

# Set a local R/W mount for logs
mounts:
    'logs':
        source: local
        source_path: logs

{{< /codetabs >}}



### `web.commands.start`

In each of the application configuration examples above, a start command (`web.commands.start`) is defined for an application using `gunicorn` WSGI (Web Server Gateway Interface) and Unix sockets.

{{< codetabs >}}

+++
title=Pip
highlight=yaml
markdownify=false
+++
##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
web:
    upstream:
        socket_family: unix
    commands:
        start: "gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true

##########################
<--->

+++
title=Pipenv
highlight=yaml
markdownify=false
+++
##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
web:
    upstream:
        socket_family: unix
    commands:
        start: "pipenv run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true

##########################
<--->

+++
title=Poetry
highlight=yaml
markdownify=false
+++
##########################
# Web configuration

# The configuration of the application when it's exposed to the web.
web:
    upstream:
        socket_family: unix
    commands:
        start: "poetry run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
    locations:
        "/":
            passthru: true
        "/static":
            root: "static"
            expires: 1h
            allow: true

##########################
{{< /codetabs >}}


If you are using a different web server, update this line, and consult the [web server portion of this section](/languages/python/server) for examples of how to do so.

If following this example exactly, be sure to update the WSGI application Gunicorn calls, which in this case assumes a main `myapp/wsgi.py` present in the repository with a callable `application` defined.

{{< guide-buttons next="Customize Django" >}}
