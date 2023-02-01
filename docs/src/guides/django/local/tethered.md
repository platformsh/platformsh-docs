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

Assuming you have followed the [Django deployment guide](/guides/django/deploy), your `settings.py` should contain a Platformsh-specific block that looks like the below:

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
file=none
highlight=bash
+++
python pip install -r requirements.txt
<--->
+++
title=Pipenv
file=none
highlight=bash
+++
pipenv install
<--->
+++
title=Poetry
file=none
highlight=bash
+++
poetry install
    {{< /codetabs >}}

5. Collect static assets.

    {{< codetabs >}}
+++
title=Pip
file=none
highlight=bash
+++
python manage.py collectstatic
<--->
+++
title=Pipenv
file=none
highlight=bash
+++
pipenv run python manage.py collectstatic
<--->
+++
title=Poetry
file=none
highlight=bash
+++
poetry run python manage.py collectstatic 
    {{< /codetabs >}}

6. Start the local server.

    {{< codetabs >}}
+++
title=Pip
file=none
highlight=bash
+++
python manage.py runserver
<--->
+++
title=Pipenv
file=none
highlight=bash
+++
pipenv run python manage.py runserver
<--->
+++
title=Poetry
file=none
highlight=bash
+++
poetry run python manage.py runserver
    {{< /codetabs >}}

7. Shut down the tunnel.

    ```bash
    platform tunnel:close --all -y
    ```

8. Onboarding collaborators.

    As a part of a larger organization, you may wish to streamline this process for the sake of consistency. 
    You can commit a script to the repository that simplifies setting up a local development environment that contains all of the above steps. 

    {{< codetabs >}}
+++
title=Pip
file=none
highlight=bash
+++
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

platform branch $ENVIRONMENT

platform tunnel:open
export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature

python pip install -r requirements.txt
python manage.py collectstatic
<--->
+++
title=Pipenv
file=none
highlight=bash
+++
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

platform branch $ENVIRONMENT

platform tunnel:open
export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature

pipenv install
pipen run python manage.py collectstatic
<--->
+++
title=Poetry
file=none
highlight=bash
+++
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

platform branch $ENVIRONMENT

platform tunnel:open
export PLATFORM_RELATIONSHIPS="$(platform tunnel:info --encode)"
export PLATFORM_APPLICATION_NAME=django && export PLATFORM_ENVIRONMENT=new-feature

poetry install
poetry run python manage.py collectstatic
    {{< /codetabs >}}

    Any user can then run

    ```bash
    $ platform get PROJECT_ID
    $ cd PROJECT_NAME
    $ ./init-local.sh another-new-feature main
    ```

    to set up their environment once merged into production.
