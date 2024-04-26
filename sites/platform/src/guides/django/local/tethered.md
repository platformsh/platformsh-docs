---
title: Tethered local
weight: -90
description: Connect a locally running Django server directly to active services on a {{% vendor/name %}} environment.
sectionBefore: Supported environments
---

{{< note theme="info" >}}
{{% ddev/local-note name="Django" link="/guides/django/local/ddev" %}}
{{< /note >}}

To test changes locally, you can connect your locally running Django server
to service containers on an active {{% vendor/name %}} environment.

{{% guides/local-requirements framework="Django" %}}

{{% guides/django/local-assumptions %}}

If you followed the [Django deployment guide](../deploy/_index.md),
you should have a Django configuration file with settings for [decoding variables](../deploy/customize.md#decoding-variables)
and also [overrides for {{% vendor/name %}}](../deploy/customize.md#decoding-variables).

You can use these settings to set up a tethered connection to services running on a {{% vendor/name %}} environment.
The settings are used to mock the conditions of the environment locally.

## Create the tethered connection

1. Create a new environment based on production.

   ```bash
   {{< vendor/cli >}} branch new-feature {{< variable "PRODUCTION_ENVIRONMENT_NAME" >}}
   ```

   If you're using a [source integration](/integrations/source.html),
   open a merge/pull request.

1. To open an SSH tunnel to the new environment's services, run the following command:

   ```bash
   {{< vendor/cli >}} tunnel:open
   ```

   This command returns the addresses for SSH tunnels to all of your services.

1. Export the `PLATFORMSH_RELATIONSHIPS` environment variable with information from the open tunnel:

   ```bash
   export PLATFORM_RELATIONSHIPS="$({{< vendor/cli >}} tunnel:info --encode)"
   ```

1.  To ensure your `settings.py` file acts as if in a {{% vendor/name %}} environment,
    mock two variables present in active environments:

    ```bash
    export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature
    ```

1.  To install dependencies, run the command for your package manager:

    {{< codetabs >}}
+++
title=Pip
highlight=bash
markdownify=false
+++
python pip install -r requirements.txt
<--->
+++
title=Pipenv
highlight=bash
markdownify=false
+++
pipenv install
<--->
+++
title=Poetry
highlight=bash
markdownify=false
+++
poetry install
    {{< /codetabs >}}


1.  Collect static assets.

    {{< codetabs >}}
+++
title=Pip
highlight=bash
markdownify=false
+++
python manage.py collectstatic
<--->
+++
title=Pipenv
highlight=bash
markdownify=false
+++
pipenv run python manage.py collectstatic
<--->
+++
title=Poetry
highlight=bash
markdownify=false
+++
poetry run python manage.py collectstatic 
    {{< /codetabs >}}


1.  To start your local server, run the following command based on your package manager:

    {{< codetabs >}}
+++
title=Pip
highlight=bash
markdownify=false
+++
python manage.py runserver
<--->
+++
title=Pipenv
highlight=bash
markdownify=false
+++
pipenv run python manage.py runserver
<--->
+++
title=Poetry
highlight=bash
markdownify=false
+++
poetry run python manage.py runserver
    {{< /codetabs >}}

1.  When you've finished your work, close the tunnels to your services by running the following command:

    ```bash
    {{< vendor/cli >}} tunnel:close --all -y
    ```

## Next steps

You can now use your local environment to develop changes for review on {{% vendor/name %}} environments.
The following examples show how you can take advantage of that.

### Onboard collaborators

It's essential for every developer on your team to have a local development environment to work on.
Place the local configuration into a script to ensure everyone has this.
You can merge this change into production.

1.  Create a new environment called `local-config`.

1.  To set up a local environment for a new {{% vendor/name %}} environment, create an executable script.

    ```bash
    touch init-local.sh && chmod +x init-local.sh
    ```

1. Fill it with the following example, depending on your package manager:

    {{< codetabs >}}
+++
title=Pip
+++


```bash {location="init-local.sh"}
#!/usr/bin/env bash

PROJECT=$1
ENVIRONMENT=$2
PARENT=$3

# Create the new environment
{{< vendor/cli >}} branch $ENVIRONMENT $PARENT

# Configure DDEV
ddev config --auto
ddev config --web-environment-add PLATFORM_PROJECT=$PROJECT
ddev config --web-environment-add PLATFORM_ENVIRONMENT=$ENVIRONMENT
ddev config --webimage-extra-packages python-is-python3

ddev get drud/ddev-platformsh

# Update .ddev/config.platformsh.yaml
#   1. hooks.post-start
printf "  # {{< vendor/name >}} start command\n  - exec: |\n      python manage.py runserver 0.0.0.0:8000" >> .ddev/config.platformsh.yaml
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
ddev pull {{< vendor/cli >}} -y
ddev restart
```

<--->
+++
title=Pipenv
+++

```bash {location="init-local.sh"}
#!/usr/bin/env bash

PROJECT=$1
ENVIRONMENT=$2
PARENT=$3

# Create the new environment
{{< vendor/cli >}} branch $ENVIRONMENT $PARENT

# Configure DDEV
ddev config --auto
ddev config --web-environment-add PLATFORM_PROJECT=$PROJECT
ddev config --web-environment-add PLATFORM_ENVIRONMENT=$ENVIRONMENT
ddev config --webimage-extra-packages python-is-python3

ddev get drud/ddev-platformsh

# Update .ddev/config.platformsh.yaml
#   1. hooks.post-start
printf "  # {{< vendor/name >}} start command\n  - exec: |\n      pipenv run python manage.py runserver 0.0.0.0:8000" >> .ddev/config.platformsh.yaml
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
ddev pull {{< vendor/cli >}} -y
ddev restart

```

<--->
+++
title=Poetry
+++

```bash {location="init-local.sh"}
#!/usr/bin/env bash

PROJECT=$1
ENVIRONMENT=$2
PARENT=$3

# Create the new environment
{{< vendor/cli >}} branch $ENVIRONMENT $PARENT

# Configure DDEV
ddev config --auto
ddev config --web-environment-add PLATFORM_PROJECT=$PROJECT
ddev config --web-environment-add PLATFORM_ENVIRONMENT=$ENVIRONMENT
ddev config --webimage-extra-packages python-is-python3

ddev get drud/ddev-platformsh

# Update .ddev/config.platformsh.yaml
#   1. hooks.post-start
printf "  # {{< vendor/name >}} start command\n  - exec: |\n      poetry run python manage.py runserver 0.0.0.0:8000" >> .ddev/config.platformsh.yaml
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
ddev pull {{< vendor/cli >}} -y
ddev restart

```

    {{< /codetabs >}}

1. To commit and push the revisions, run the following command:

   ```bash
   git add . && git commit -m "Add local configuration" && git push {{< vendor/cli >}} local-config
   ```

1.  Merge the change into production.

Once the script is merged into production,
any user can set up their local environment by running the following commands:

```bash
{{< vendor/cli >}} {{< variable "PROJECT_ID" >}}
cd {{< variable "PROJECT_NAME" >}}
./init-local.sh {{< variable "PROJECT_ID" >}} another-new-feature {{< variable "PRODUCTION_ENVIRONMENT_NAME" >}}
```

{{% guides/django/local-sanitize-example %}}
