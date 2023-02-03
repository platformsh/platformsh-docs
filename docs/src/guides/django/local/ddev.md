---
title: DDEV
weight: -110
layout: single
description: |
    Set up an environment with Platform.sh's recommended local development tool, DDEV.
sectionBefore: Integrated environments
---

{{% ddev/definition %}}

## Setting up

### Assumptions

{{% guides/django-local-assumptions %}}

### DDEV requirements and install

{{% ddev/requirements %}}

{{% ddev/install %}}

### Steps

1. Create a new environment off of production.

    ```bash
    platform branch new-feature main
    ```

    If working from a [source integration](/integrations/source), it will be necessary for a merge/pull request environment to be opened beforehand. 
    Otherwise, work from an existing staging environment, and resync to the active merge/pull request environment once it's been activiated. 

2. Add DDEV configuration to the project.

    ```bash
    ddev config --auto
    ```

3. Add a Python alias package to the configuration.

    ```bash
    ddev config --webimage-extra-packages python-is-python3
    ```

4. Add an API token.

    {{% ddev/token %}}

5. Connect DDEV to your project and environment (`new-feature`).

    {{% ddev/connect %}}

6. Update DDEV's `php_version` and `post-start` commands.

    Python support in DDEV and the Platform.sh integration is in active development. 
    At this time, the only officially supported runtime is PHP. 
    With a few changes, however, the generated configuration can be modified to run local Django environments.

    So far, a `.ddev` directory has been created in the repository containing DDEV configuration up to this point. 

    In the file `.ddev/config.platformsh.yaml`, update the `php_version` attribute to a supported version, like `8.0`.

    ```yaml {location=".ddev/config.platformsh.yaml"}
    # Leaving the generated line as is will result in an error.
    # php_version: python:3.10
    php_version: 8.0
    ```

    Second, there is a `hooks.post-start` attribute that has been generated containing the contents of Django's `hooks.build` and `hooks.deploy`. 
    Add another item to the end of that array that contains the start command defined in `.platform.app.yaml`

    {{< codetabs >}}
+++
title=Pip
file=none
highlight=yaml
+++
# .ddev/docker-compose.django.yaml
    hooks:
      post-start:
      ...
      # platformsh start command
      - exec: |
    python manage.py runserver 0.0.0.0:8000
<--->
+++
title=Pipenv
file=none
highlight=yaml
+++
# .ddev/docker-compose.django.yaml
    hooks:
      post-start:
      ...
      # platformsh start command
      - exec: |
    pipenv run python manage.py runserver 0.0.0.0:8000
<--->
+++
title=Poetry
file=none
highlight=yaml
+++
# .ddev/docker-compose.django.yaml
    hooks:
      post-start:
      ...
      # platformsh start command
      - exec: |
    poetry run python manage.py runserver 0.0.0.0:8000
    {{< /codetabs >}}

7. Create a custom `.ddev/docker-compose.django.yaml` file.

    Create a Docker Compose file that defines the port that will be exposed for the container we're building, `web`:

    ```yaml {location=".ddev/docker-compose.django.yaml"}
    version: "3.6"
    services:
        web:
            expose:
                - 8000
            environment:
                - HTTP_EXPOSE=80:8000
                - HTTPS_EXPOSE=443:8000
            healthcheck:
                test: "true"
    ```


8. Create a custom `.ddev/web-build/Dockerfile.python`.

    Similarly, create a custom Dockerfile that installs Python into the container.

    ```{location=".ddev/web-build/Dockerfile.python"}
    RUN apt-get install -y python3.10 python3-pip
    ```

9. Update `ALLOWED_HOSTS`.

    Update `ALLOWED_HOSTS` in `settings.py` to include the expected DDEV domain suffix:

    ```py {location="APP_NAME/settings.py"}
    ALLOWED_HOSTS = [
        'localhost',
        '127.0.0.1',
        '.platformsh.site',
        ".ddev.site"
    ]
    ```

10. Update `DATABASES`.

    Update `DATABASES` configuration in `settings.py` to include environment variables provided by DDEV:

    ```py {location="APP_NAME/settings.py"}
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('POSTGRES_NAME'),
            'USER': os.environ.get('POSTGRES_USER'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
            'HOST': 'db',
            'PORT': 5432,
        }
    }
    ```        

11. Start DDEV.

    Build and start up Django for the first time. 

    ```bash
    ddev start
    ```

    {{< note theme="info" title="Failed to start django" >}}

If the following error occurs when running `ddev start`:

```bash
Failed to start django: Unable to listen on required ports, port 80 is already in use
```

either cancel the running process on port `80`, or edit both

- `router_http_port` to another port like `8080` in `.ddev/config.yaml`
- the `services.web.environment` variable `HTTP_EXPOSE` (i.e. update to `HTTP_EXPOSE=8080:8000`) in `ddev/docker-compose.django.yaml`

    {{< /note >}}

12. Pull data from the environment.

    Exit the currently running process (`CTRL+C`), then retrieve data from the current Platform.sh environment:

    ```bash
    ddev pull platform
    ```

13. Restart DDEV

    ```bash
    ddev restart
    ```

You will now have a local development environment that's in sync with the `new-feature` environment on Platform.sh to work from.

15. When finished with your work, shut down DDEV.

    ```bash
    ddev stop
    ```

## Next steps

Using the instructions above, you can now use your local environment to develop revisions for review on Platform.sh environments.
Below are some examples.

### Onboard collaborators

It's essential for every developer on your team to have a local development environment to work on revisions from. 
Placing the above configuration into a script will help ensure this, and is a simple revision that can be merged into production. 

1. [Set up your local development environment](#setting-up) for a new environment called `local-config`.
2. Create an executable script for setting up a local environment for a new Platform.sh environment. 

    ```bash
    touch init-local.sh && chmod +x init-local.sh
    ```

    {{< codetabs >}}
+++
title=Pip
file=none
highlight=bash
+++
#!/usr/bin/env bash
# init-local.sh

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
printf "  # platformsh start command\n  - exec: |\n      python manage.py runserver 0.0.0.0:8000" >> .ddev/config.platformsh.yaml
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
<--->
+++
title=Pipenv
file=none
highlight=docker
+++
#!/usr/bin/env bash
# init-local.sh

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
printf "  # platformsh start command\n  - exec: |\n      pipenv run python manage.py runserver 0.0.0.0:8000" >> .ddev/config.platformsh.yaml
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
<--->
+++
title=Poetry
file=none
highlight=docker
+++
#!/usr/bin/env bash
# init-local.sh

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
printf "  # platformsh start command\n  - exec: |\n      poetry run python manage.py runserver 0.0.0.0:8000" >> .ddev/config.platformsh.yaml
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
    {{< /codetabs >}}

3. Commit and push the revisions.

    ```bash
    git add . && git commit -m "Add local configuration." && git push platform local-config
    ```

4. Merge the revision.

    ```bash
    platform merge local-config
    ```

Once the script is merged into production, any user can then run

```bash
$ platform get PROJECT_ID
$ cd PROJECT_NAME
$ ./init-local.sh PROJECT_ID another-new-feature main
```

to set up their local environment.

### Sanitize data

It's often a compliance requirement that only a minimal subset of developers within an organization actually have access to production data during their work.
Platform.sh by default, however, provides a model that automatically clones production data into _every_ child environment.

Since the build and deploy lifecycle of an application is customizable, it's possible to include a script that sanitizes the data within every non-production environment created to help here. 

1. [Set up your local development environment](#setting-up) for a new environment called `sanitize-non-prod`.
2. Modify deploy hook to sanitize data.

    Once your local environment has been set up, follow the [sanitizing PostgreSQL with Django](development/sanitize-db/postgresql) example to add a sanitization script to the deploy hook of `.platform.app.yaml` specific to your data, which will run on non-production environments.

3. Commit and push the revisions.

    ```bash
    git add . && git commit -m "Add local configuration." && git push platform sanitize-non-prod
    ```

4. Merge the revision.

    ```bash
    platform merge sanitize-non-prod
    ```

Once the script is merged into production, every non-production environment created on Platform.sh - and the local environments contributors work from - will contain sanitized data free of your users' PII.
