---
title: "Configure Django for {{% vendor/name %}}"
sidebarTitle: "Configure"
weight: -100
description: |
    Review the basics of what makes up a {{% vendor/name %}} project, including its three principle configuration files and how to define them for Django.
---

{{% guides/config-desc name="Django" %}}

{{% guides/config-app noExample=true /%}}

The examples vary based on whether you use Pip, Pipenv, or Poetry to manage dependencies.

{{< codetabs >}}

+++
title=Pip
+++

```yaml {configFile="app"}
#########################
# Django 4 using pip
##########################
# Container configuration.

# Complete list of all available properties: https://docs.platform.sh/create-apps/app-reference.html

# A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated
# with the app.
name: 'app'

# The runtime the application uses.
# Complete list of available runtimes: https://docs.platform.sh/create-apps/app-reference.html#types
type: 'python:3.10'

# The relationships of the application with services or other applications.
# The left-hand side is the name of the relationship as it will be exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
# More information: https://docs.platform.sh/create-apps/app-reference.html#relationships
relationships:
  database: "db:postgresql"

# The size of the persistent disk of the application (in MB). Minimum value is 128.
disk: 512

# Mounts define directories that are writable after the build is complete. If set as a local source, disk property is required.
# More information: https://docs.platform.sh/create-apps/app-reference.html#mounts
mounts:
  'logs':
    source: local
    source_path: logs

# The web key configures the web server running in front of your app.
# More information: https://docs.platform.sh/create-apps/app-reference.html#web
web:
  # Commands are run once after deployment to start the application process.
  # More information: https://docs.platform.sh/create-apps/app-reference.html#web-commands
  commands:
    # The command to launch your app. If it terminates, it’s restarted immediately.
    start: "gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"

  # More information: https://docs.platform.sh/configuration/app-containers.html#upstream
  upstream:
    # Whether your app should speak to the webserver via TCP or Unix socket. Defaults to tcp
    # More information: https://docs.platform.sh/create-apps/app-reference.html#where-to-listen
    socket_family: unix

  # Each key in locations is a path on your site with a leading /.
  # More information: https://docs.platform.sh/create-apps/app-reference.html#locations
  locations:
    "/":
      # Whether to forward disallowed and missing resources from this location to the app. A string is a path
      # with a leading / to the controller, such as /index.php.
      passthru: true
    "/static":
      # The directory to serve static assets for this location relative to the app’s root directory. Must be an
      # actual directory inside the root directory.
      root: "static"
      # The number of seconds whitelisted (static) content should be cached.
      expires: 1h
      # Whether to allow serving files which don’t match a rule.
      allow: true

# Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
# More information: https://docs.platform.sh/create-apps/app-reference.html#hooks
hooks:
  # The build hook is run after any build flavor.
  # More information: https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#build-hook
  build: |
    set -eu

    # Download the latest version of pip
    python3.10 -m pip install --upgrade pip

    # Install dependencies
    pip install -r requirements.txt

    # Collect static assets
    python manage.py collectstatic    

  # The deploy hook is run after the app container has been started, but before it has started accepting requests.
  # More information: https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#deploy-hook
  deploy: python manage.py migrate
```

<--->
+++
title=Pipenv
+++

```yaml {configFile="app"}
#########################
# Django4 using pipenv
##########################
# Container configuration.

# Complete list of all available properties: https://docs.platform.sh/create-apps/app-reference.html

# A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated
# with the app.
name: 'app'

# The runtime the application uses.
# Complete list of available runtimes: https://docs.platform.sh/create-apps/app-reference.html#types
type: 'python:3.10'

# The relationships of the application with services or other applications.
# The left-hand side is the name of the relationship as it will be exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
# More information: https://docs.platform.sh/create-apps/app-reference.html#relationships
relationships:
  database: "db:postgresql"

# The size of the persistent disk of the application (in MB). Minimum value is 128.
disk: 512

# Mounts define directories that are writable after the build is complete. If set as a local source, disk property is required.
# More information: https://docs.platform.sh/create-apps/app-reference.html#mounts
mounts:
  'logs':
    source: local
    source_path: logs
  '.cache':
    source: local
    source_path: cache

# The web key configures the web server running in front of your app.
# More information: https://docs.platform.sh/create-apps/app-reference.html#web
web:
  # Commands are run once after deployment to start the application process.
  # More information: https://docs.platform.sh/create-apps/app-reference.html#web-commands
  commands:
    # The command to launch your app. If it terminates, it’s restarted immediately.
    start: "pipenv run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"

  # More information: https://docs.platform.sh/configuration/app-containers.html#upstream
  upstream:
    # Whether your app should speak to the webserver via TCP or Unix socket. Defaults to tcp
    # More information: https://docs.platform.sh/create-apps/app-reference.html#where-to-listen
    socket_family: unix

  # Each key in locations is a path on your site with a leading /.
  # More information: https://docs.platform.sh/create-apps/app-reference.html#locations
  locations:
    "/":
      # Whether to forward disallowed and missing resources from this location to the app. A string is a path
      # with a leading / to the controller, such as /index.php.
      passthru: true
    "/static":
      # The directory to serve static assets for this location relative to the app’s root directory. Must be an
      # actual directory inside the root directory.
      root: "static"
      # The number of seconds whitelisted (static) content should be cached.
      expires: 1h
      # Whether to allow serving files which don’t match a rule.
      allow: true

# Installs global dependencies as part of the build process. They’re independent of your app’s dependencies and
# are available in the PATH during the build process and in the runtime environment. They’re installed before
# the build hook runs using a package manager for the language.
# More information: https://docs.platform.sh/create-apps/app-reference.html#dependencies
dependencies:
  python3:
    pipenv: '2022.9.4'

# Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
# More information: https://docs.platform.sh/create-apps/app-reference.html#hooks
hooks:
  # The build hook is run after any build flavor.
  # More information: https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#build-hook
  build: |
    set -eu

    # Download the latest version of pip
    python3.10 -m pip install --upgrade pip

    # Install dependencies
    pipenv install --deploy

    # Collect static assets
    pipenv run python manage.py collectstatic    

  # The deploy hook is run after the app container has been started, but before it has started accepting requests.
  # More information: https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#deploy-hook
  deploy: pipenv run python manage.py migrate
```

<--->
+++
title=Poetry
+++

```yaml {configFile="app"}
#########################
# Django4 using Poetry
##########################
# Container configuration.

# Complete list of all available properties: https://docs.platform.sh/create-apps/app-reference.html

# A unique name for the app. Must be lowercase alphanumeric characters. Changing the name destroys data associated
# with the app.
name: 'app'

# The runtime the application uses.
# Complete list of available runtimes: https://docs.platform.sh/create-apps/app-reference.html#types
type: 'python:3.10'

# The relationships of the application with services or other applications.
# The left-hand side is the name of the relationship as it will be exposed
# to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
# side is in the form `<service name>:<endpoint name>`.
# More information: https://docs.platform.sh/create-apps/app-reference.html#relationships
relationships:
  database: "db:postgresql"

# The size of the persistent disk of the application (in MB). Minimum value is 128.
disk: 512

# Mounts define directories that are writable after the build is complete. If set as a local source, disk property is required.
# More information: https://docs.platform.sh/create-apps/app-reference.html#mounts
mounts:
  'logs':
    source: local
    source_path: logs

# The web key configures the web server running in front of your app.
# More information: https://docs.platform.sh/create-apps/app-reference.html#web
web:
  # Commands are run once after deployment to start the application process.
  # More information: https://docs.platform.sh/create-apps/app-reference.html#web-commands
  commands:
    # The command to launch your app. If it terminates, it’s restarted immediately.
    start: "poetry run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"

  # More information: https://docs.platform.sh/configuration/app-containers.html#upstream
  upstream:
    # Whether your app should speak to the webserver via TCP or Unix socket. Defaults to tcp
    # More information: https://docs.platform.sh/create-apps/app-reference.html#where-to-listen
    socket_family: unix

      # Each key in locations is a path on your site with a leading /.
    # More information: https://docs.platform.sh/create-apps/app-reference.html#locations
  locations:
    "/":
      # Whether to forward disallowed and missing resources from this location to the app. A string is a path
      # with a leading / to the controller, such as /index.php.
      passthru: true
    "/static":
      # The directory to serve static assets for this location relative to the app’s root directory. Must be an
      # actual directory inside the root directory.
      root: "static"
      # The number of seconds whitelisted (static) content should be cached.
      expires: 1h
      # Whether to allow serving files which don’t match a rule.
      allow: true

# Variables to control the environment. More information: https://docs.platform.sh/create-apps/app-reference.html#variables
variables:
  env:
    POETRY_VIRTUALENVS_IN_PROJECT: true
    POETRY_VIRTUALENVS_CREATE: false

# Hooks allow you to customize your code/environment as the project moves through the build and deploy stages
# More information: https://docs.platform.sh/create-apps/app-reference.html#hooks
hooks:
  # The build hook is run after any build flavor.
  # More information: https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#build-hook
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

  # The deploy hook is run after the app container has been started, but before it has started accepting requests.
  # More information: https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#deploy-hook
  deploy: poetry run python manage.py migrate
```

{{< /codetabs >}}

### How to start your app

Each of these examples includes a command to start your app under `web.commands.start`.
It uses the Gunicorn WSGI server and Unix sockets.

{{< codetabs >}}

+++
title=Pip
+++

```yaml {configFile="app"}
web:
  upstream:
    socket_family: unix
  commands:
    start: "gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
```

<--->
+++
title=Pipenv
+++

```yaml {configFile="app"}
web:
  upstream:
    socket_family: unix
  commands:
    start: "pipenv run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
```

<--->
+++
title=Poetry
+++

```yaml {configFile="app"}
web:
  upstream:
    socket_family: unix
  commands:
    start: "poetry run gunicorn -w 4 -b unix:$SOCKET myapp.wsgi:application"
```

{{< /codetabs >}}

To use this server, update the command to replace the WSGI application Gunicorn calls.
The example uses a `myapp/wsgi.py` file with a callable `application`.

To use a different web server, change this start command.
For examples of how to do so, see more about [Python web servers](../../../languages/python/server.md).

{{% guides/config-service name="Django" %}}

{{% /guides/config-service %}}

Below is an example configuration to make [PostgreSQL](../../../add-services/postgresql.md) available for your Django application.

```yaml {configFile="services"}
# The services of the project.
#
# Each service listed will be deployed
# to power your Platform.sh project.
# More information: https://docs.platform.sh/add-services.html
# Full list of available services: https://docs.platform.sh/add-services.html#available-services
db:
  type: postgresql:12
  disk: 1024
```

{{% guides/config-routes template="django4" name="Django" %}}

{{< guide-buttons previous="Back" next="Customize Django" >}}
