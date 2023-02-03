---
title: Tethered local
weight: -90
description: |
    Connect a locally running Django server directly to active services on a Platform.sh environment.
---

{{< note theme="info" >}}
{{% guides/local-ddev-note name="Django" link="/guides/django/local/ddev" %}}
{{< /note >}}

On Platform.sh, you have the option to connect a locally running application to service containers on an active environment. 

## Setting up

### Assumptions

{{% guides/django-local-assumptions %}}

Assuming you have followed the [Django deployment guide](/guides/django/deploy), your `settings.py` should contain a Platform.sh specific block that looks like the below:

```py {location="settings.py"}
import os
import json
import base64

...

PLATFORMSH_DB_RELATIONSHIP="database"

# Helper function for decoding base64-encoded JSON variables.
def decode(variable):
    try:
        if sys.version_info[1] > 5:
            return json.loads(base64.b64decode(variable))
        else:
            return json.loads(base64.b64decode(variable).decode('utf-8'))
    except json.decoder.JSONDecodeError:
        print('Error decoding JSON, code %d', json.decoder.JSONDecodeError)

# Import some Platform.sh settings from the environment.
if (os.getenv('PLATFORM_APPLICATION_NAME') is not None):
    DEBUG = False
    if (os.getenv('PLATFORM_APP_DIR') is not None):
        STATIC_ROOT = os.path.join(os.getenv('PLATFORM_APP_DIR'), 'static')
    if (os.getenv('PLATFORM_PROJECT_ENTROPY') is not None):
        SECRET_KEY = os.getenv('PLATFORM_PROJECT_ENTROPY')
    # Database service configuration, post-build only.
    if (os.getenv('PLATFORM_ENVIRONMENT') is not None):
        platformRelationships = decode(os.getenv('PLATFORM_RELATIONSHIPS'))
        db_settings = platformRelationships[PLATFORMSH_DB_RELATIONSHIP][0]
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': db_settings['path'],
                'USER': db_settings['username'],
                'PASSWORD': db_settings['password'],
                'HOST': db_settings['host'],
                'PORT': db_settings['port'],
            },
            'sqlite': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
            }
        }
```

Where a helper function `decode` is also defined in that file to decode base64 encoded JSON objects -- the format of the service credential-containing built-in environment variable `PLATFORM_RELATIONSHIPS`.
Setting up a [tethered connection](/development/local/tethered) to a Platform.sh environment's services leverages this block by mocking the conditions of that environment locally. 

### Steps

1. Create a new environment off of production.

    ```bash
    platform branch new-feature main
    ```

2. Open an SSH tunnel to the new environment's services.

    ```bash
    platform tunnel:open
    ```

    You can verify the connection to the service:

    ```bash
    $ platform tunnels --all
    +-------+---------------+-------------+-----+--------------+
    | Port  | Project       | Environment | App | Relationship |
    +-------+---------------+-------------+-----+--------------+
    | 30000 | ssoxcxcqhqgme | main        | app | database     |
    +-------+---------------+-------------+-----+--------------+

    View tunnel details with: platform tunnel:info
    Close tunnels with: platform tunnel:close
    ```

3. Mock environment variables.

    First, export the `PLATFORMSH_RELATIONSHIPS` environment variable provided when running the `tunnel:open` command:

    ```bash
    export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
    ```

    Then, ensure that the Platform.sh block in `settings.py` is used, but mocking two additional variables present in active environments:

    ```bash
    export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature
    ```

4. Install dependencies.

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


5. Collect static assets.

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


6. Start the local server.

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


7. When finished with your work, shut down the tunnel.

    ```bash
    platform tunnel:close --all -y
    ```

## Next steps

Using the instructions above, you can now use your local environment to develop revisions for review on Platform.sh environments.
Below are some examples.

### Onboard collaborators

It's essential for every developer on your team to have a local development environment to work on revisions from. 
Placing the above configuration into a script helps ensure this, and is a revision that can be merged into production. 

1. [Set up your local development environment](#setting-up) for a new environment called `local-config`.
2. Create an executable script for setting up a local environment for a new Platform.sh environment. 

    ```bash
    touch init-local.sh && chmod +x init-local.sh
    ```

    {{< codetabs >}}
+++
title=Pip
highlight=bash
markdownify=false
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
highlight=docker
markdownify=false
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
highlight=docker
markdownify=false
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
