---
title: Docker Compose
weight: -100
description: |
    If already working with Docker and Docker Compose, follow these steps to sync data with active Platform.sh environments.
sectionBefore: Supported environments
---

{{< note theme="info" >}}
{{% guides/local-ddev-note name="Django" link="/guides/django/local/ddev" %}}
{{< /note >}}

## Setting up

### Assumptions

{{% guides/django-local-assumptions %}}

### Steps

Starting with a `Dockerfile` for Python 3.10:

{{< codetabs >}}
+++
title=Pip
highlight=docker
markdownify=false
+++
FROM python:3.10
WORKDIR /code
COPY . /code/
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
<--->
+++
title=Pipenv
highlight=docker
markdownify=false
+++
FROM python:3.10
WORKDIR /code
COPY . /code/
RUN python -m pip install --upgrade pip
RUN pip install pipenv
RUN pipenv install --ignore-pipfile --deploy
<--->
+++
title=Poetry
highlight=docker
markdownify=false
+++
FROM python:3.10
WORKDIR /code
COPY . /code/
ENV POETRY_VERSION='1.1.14'
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV POETRY_VIRTUALENVS_CREATE=false
RUN python3.10 -m pip install --upgrade pip
RUN pip install poetry
RUN poetry install
{{< /codetabs >}}


and a corresponding `docker-compose.yaml` file:

{{< codetabs >}}
+++
title=Pip
highlight=yaml
markdownify=false
+++
services:
  db:
    image: postgres
    volumes:
      - ./data/db:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
  web:
    command: >
      sh -c "python manage.py collectstatic --no-input &&
             python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    environment:
      - POSTGRES_NAME=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    depends_on:
      - db
<--->
+++
title=Pipenv
highlight=yaml
markdownify=false
+++
services:
  db:
    image: postgres
    volumes:
      - ./data/db:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
  web:
    command: >
      sh -c "pipenv run python manage.py collectstatic --no-input &&
             pipenv run python manage.py migrate &&
             pipenv run python manage.py runserver 0.0.0.0:8000"
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    environment:
      - POSTGRES_NAME=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    depends_on:
      - db
<--->
+++
title=Poetry
highlight=yaml
markdownify=false
+++
services:
  db:
    image: postgres
    volumes:
      - ./data/db:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
  web:
    command: >
      sh -c "poetry run python manage.py collectstatic --no-input &&
             poetry run python manage.py migrate &&
             poetry run python manage.py runserver 0.0.0.0:8000"
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    environment:
      - POSTGRES_NAME=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    depends_on:
      - db
{{< /codetabs >}}


1. Create a new environment off of production.

    ```bash
    platform branch new-feature main
    ```

    If working from a [source integration](/integrations/source), it's necessary for a merge/pull request environment to be opened beforehand. 
    Otherwise, work from an existing staging environment, and sync to the active merge/pull request environment once it's been activated. 

2. Retrieve the inherited production data.

    ```bash
    platform db:dump -e new-feature
    ```

    This creates a database dump file with the format: `PROJECT_ID--PLATFORM_BRANCH--SERVICE_NAME--dump.sql` For merge/pull request environments, substitute `new-feature` for the name of the environment (for example, `pr-42`).

3. Make sure to ignore this file in future commits.

    ```bash
    echo "*--dump.sql" >> .gitignore
    ```

4. Build the image.

    ```bash
    docker-compose build
    ```

5. Start the container.

    ```bash
    docker-compose up -d
    ```

    Verify that the containers are running:

    ```bash
    $ docker-compose images
    Container    Repository    Tag       Image Id       Size  
    -----------------------------------------------------------
    django_db_1    postgres     latest   9f3ec01f884d   378.6 MB
    django_web_1   django_web   latest   0065da03c239   1.063 GB
    ```

6. Import the dump into the database.

    ```bash
    docker exec -i $(docker-compose ps -q db) psql -U bigfoot < DATABASE--DUMP--NAME--dump.sql 
    ```

    {{< note >}}
The section `-i $(docker-compose ps -q db)` is used to get the `id` for the `db` service container.
    {{< /note >}}

You now have a local development environment that's in sync with the `new-feature` environment on Platform.sh to work from.

8. When finished with your work, shut down the containers.

    ```bash
    docker-compose down
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
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

DUMP_FILE="$ENVIRONMENT--dump.sql"
SERVICE_NAME="db"
DB_USER="postgres"

platform branch $ENVIRONMENT $PARENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose build
docker-compose up -d
wait 10
docker exec -i $(docker-compose ps -q $SERVICE_NAME) psql -U $DB_USER < $DUMP_FILE
<--->
+++
title=Pipenv
highlight=bash
markdownify=false
+++
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

DUMP_FILE="$ENVIRONMENT--dump.sql"
SERVICE_NAME="db"
DB_USER="postgres"

platform branch $ENVIRONMENT $PARENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose build
docker-compose up -d
wait 10
docker exec -i $(docker-compose ps -q $SERVICE_NAME) psql -U $DB_USER < $DUMP_FILE
<--->
+++
title=Poetry
highlight=bash
markdownify=false
+++
# init-local.sh

ENVIRONMENT=$1
PARENT=$2

DUMP_FILE="$ENVIRONMENT--dump.sql"
SERVICE_NAME="db"
DB_USER="postgres"

platform branch $ENVIRONMENT $PARENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose build
docker-compose up -d
wait 10
docker exec -i $(docker-compose ps -q $SERVICE_NAME) psql -U $DB_USER < $DUMP_FILE
    {{< /codetabs >}}


    Once the script is merged into production, any user can then run

    ```bash
    $ platform get PROJECT_ID
    $ cd PROJECT_NAME
    $ ./init-local.sh another-new-feature main
    ```

    to set up their local environment.

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

It's often a compliance requirement that a minimal subset of developers within an organization have access to production data during their work.
Platform.sh by default provides a model that automatically clones production data into _every_ child environment.

Since the build and deploy lifecycle of an application is customizable, it's possible to include a script that sanitizes the data within every non-production environment created to help here. 

1. [Set up your local development environment](#setting-up) for a new environment called `sanitize-non-prod`.
2. Modify deploy hook to sanitize data.

    Once your local environment has been set up, follow the [sanitizing PostgreSQL with Django](development/sanitize-db/postgresql) example to add a sanitization script to the deploy hook of `.platform.app.yaml` specific to your data, which runs on non-production environments.

3. Commit and push the revisions.

    ```bash
    git add . && git commit -m "Add local configuration." && git push platform sanitize-non-prod
    ```

4. Merge the revision.

    ```bash
    platform merge sanitize-non-prod
    ```

Once the script is merged into production, every non-production environment created on Platform.sh - and the local environments contributors work from - contains sanitized data free of your users' PII (Personally Identifiable Information).
