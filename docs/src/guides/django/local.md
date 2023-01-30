---
title: Local development
weight: -110
layout: single
description: |
    Sync Platform.sh with your local environments to start contributing.
---

Both of these guides assume that you have already [deployed a Django project on Platform.sh](/guides/django/deploy), where production data is already present in a PostgreSQL database.
It also assumes that there is a local copy of the project repository on your computer. 

## DDEV

Lorem ipsum

## Docker Compose

This section does not address starting a Python container specifically, only the needed PostgreSQL database, although the steps should not vary much.

Locally, you may have a `docker-compose.yaml` file that looks like the below for PostgreSQL:

```yaml {location="docker-compose.yaml"}
version: "3.10"

services:
    db:
        image: "postgres:latest"
        ports:
            - 5432:5432
        environment:
            POSTGRES_USER: bigfoot
            POSTGRES_PASSWORD: bigfoot
```

1. Create a new environment off of production.

    ```bash
    platform branch new-feature main
    ```

2. Retrieve the inherited production data.

    ```bash
    platform db:dump -e new-feature
    ```

    This will create a database dump file with the format: `PROJECT_ID--PLATFORM_BRANCH--SERVICE_NAME--dump.sql`

3. Make sure to ignore this file in future commits.

    ```bash
    echo "*--dump.sql" >> .gitignore
    ```

4. Start the container.

    ```bash
    docker-compose up -d
    ```

    Verify that the database is running:

    ```bash
    $ docker-compose images
    Container    Repository    Tag       Image Id       Size  
    -----------------------------------------------------------
    django_db_1   postgres     latest   f8dd270e5152   376.1 MB
    ```

5. Install dependencies.

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

6. Run migrations.

    {{< codetabs >}}
+++
title=Pip
file=none
highlight=bash
+++
python manage.py migrate
<--->
+++
title=Pipenv
file=none
highlight=bash
+++
pipenv run python manage.py migrate
<--->
+++
title=Poetry
file=none
highlight=bash
+++
poetry run python manage.py migrate 
    {{< /codetabs >}}

7. Collect static assets.

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

7. Import the dump into the local container.

    ```bash
    docker exec -i $(docker-compose ps -q db) psql -U bigfoot < DATABASE--DUMP--NAME--dump.sql 
    ```

    {{< note >}}
The section `-i $(docker-compose ps -q db)` is used to get the `id` for the `db` service container.
    {{< /note >}}

8. Start the local server.

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

You will now have a local development environment that's in sync with the `new-feature` environment on Platform.sh to work from.

8. Shut down the container.

    ```bash
    docker-compose down
    ```

9. Onboarding collaborators.

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

DUMP_FILE="$ENVIRONMENT--dump.sql"
SERVICE_NAME="db"
DB_USER="bigfoot"

platform branch $ENVIRONMENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose up -d

python pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic

docker exec -i $(docker-compose ps -q $SERVICE_NAME) psql -U $DB_USER < $DUMP_FILE
<--->
+++
title=Pipenv
file=none
highlight=bash
+++
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

DUMP_FILE="$ENVIRONMENT--dump.sql"
SERVICE_NAME="db"
DB_USER="bigfoot"

platform branch $ENVIRONMENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose up -d

pipenv install
pipen run python manage.py migrate
pipen run python manage.py collectstatic

docker exec -i $(docker-compose ps -q $SERVICE_NAME) psql -U $DB_USER < $DUMP_FILE
<--->
+++
title=Poetry
file=none
highlight=bash
+++
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

DUMP_FILE="$ENVIRONMENT--dump.sql"
SERVICE_NAME="db"
DB_USER="bigfoot"

platform branch $ENVIRONMENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose up -d

poetry install
poetry run python manage.py migrate
poetry run python manage.py collectstatic

docker exec -i $(docker-compose ps -q $SERVICE_NAME) psql -U $DB_USER < $DUMP_FILE
    {{< /codetabs >}}

    Any user can then run

    ```bash
    ./init-local.sh new-feature main
    ```

    to set up their environment once merged into production.

    {{< note >}}
{{% guides/sanitize-note %}}
    {{< /note >}}

## Tethered local

On Platform.sh, you have the option to connect a locally running application to service containers on an active environment. 

Assuming you have followed the [Django deployment guide](/guides/django/deploy), your `settings.py` should contain a Platformsh-specific block that looks like the below:

```py {location="settings.py"}
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

Where the helper function `decode` is also defined in that file.
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
    ./init-local.sh new-feature main
    ```

    to set up their environment once merged into production.

    {{< note >}}
{{% guides/sanitize-note %}}
    {{< /note >}}