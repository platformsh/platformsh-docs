---
title: Configure infrastructure
subtitle: Deploying {{% param "framework" %}} to {{% vendor/name %}}
weight: -16
description: Configure infrastructure for {{% param "framework" %}} in a single YAML file. 
framework: Django
---
<!-- {{% guides/steps ordered="true" root="/get-started/express/deploy" %}} -->

<!-- Status of the integration (failure) -->
{{% guides/deploy/configure/status %}}

<!-- Project:init -->
{{% guides/deploy/configure/project-init "django" %}}

- Choose **Python** for the language.
- Give the project a name, something like `{{% vendor/cli %}}_django`.
- Choose any combination of services you need for your project. If you are working with the project skeleton (selected the **Start from Scratch**) option, a common choice is **PostgreSQL** and **Redis**.

This command will generate two files for you:

- A `.environment` file, where you can save environment variables that will be sourced into the environment.
- A `{{% vendor/configfile "app" %}}` file - the main {{% vendor/name %}} configuration file.

1. **(Optional) Configure root**. The configuration generated assumes that the Django project root is the repository root.
If this is not the case, and your Django code is nested within a directory, add the following `source.root` configuration to `{{% vendor/configfile "app" %}}`.

    ```yaml {configFile="app"}
    applications:
        APP_NAME:
            # ...GENERATED CONFIGURATION...

            source:
                root: NESTED_DIR

            # ...GENERATED CONFIGURATION...
    ```

1. **Configure the build and deploy**. The `{{% vendor/configfile "app" %}}` contains a `hooks` block, containing configuration for how Django should be built and deployed. 
The configuration for the "From scratch" app is shown below.
Update your own build and deploy steps using it as an example.

    ```yaml {configFile="app"}
    applications:
        APP_NAME:
            # ...GENERATED CONFIGURATION...

            hooks:
                build: |
                    set -eux

                    # Upgrade pip
                    python -m pip install --upgrade pip
                    
                    # Install dependencies
                    pip install -r requirements/local.txt
                    pip install -r requirements/production.txt

                    # Collect static assets
                    python manage.py collectstatic

                deploy: |
                    set -eux

                    # Migrations.
                    python manage.py migrate
                    
            # ...GENERATED CONFIGURATION...
    ```

1. **Configure how the app is started and served**. There is a `web` block in `{{% vendor/configfile "app" %}}` that describes a `start` command for Django, as well as other details for important path `locations` that should be served in specific ways. 
The configuration for the "From scratch" app is shown below.
Update your own build and deploy steps using it as an example.

    ```yaml {configFile="app"}
    applications:
        APP_NAME:
            # ...GENERATED CONFIGURATION...

            web:
                commands:
                    start: "gunicorn -w 4 -b unix:$SOCKET APP_NAME.wsgi:application"

                upstream:
                    socket_family: unix

                locations:
                    "/":
                        passthru: true
                    "/static":
                        root: "static"
                        expires: 1h
                        allow: true

            # ...GENERATED CONFIGURATION...
    ```

    The example above uses a Gunicorn server to run the application.
    Be sure to substitute the placeholder `APP_NAME` with your own application name.
    For the "From scratch" skeleton project, replace `APP_NAME` with `my_awesome_project`.

1. Update `.environment`?

{{% /guides/deploy/configure/project-init %}}

{{% guides/buttons next="/get-started/django/deploy/resources" %}}

