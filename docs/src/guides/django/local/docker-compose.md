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

## Assumptions

{{% guides/django-local-assumptions %}}

## Steps

Starting with a `Dockerfile` for Python 3.10:

{{< codetabs >}}
+++
title=Pip
file=none
highlight=docker
+++
FROM python:3.10
WORKDIR /code
COPY . /code/
RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
<--->
+++
title=Pipenv
file=none
highlight=docker
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
file=none
highlight=docker
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
file=none
highlight=yaml
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
file=none
highlight=yaml
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
file=none
highlight=yaml
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

    If working from a [source integration](/integrations/source), it will be necessary for a merge/pull request environment to be opened beforehand. 
    Otherwise, work from an existing staging environment, and resync to the active merge/pull request environment once it's been activiated. 

2. Retrieve the inherited production data.

    ```bash
    platform db:dump -e new-feature
    ```

    This will create a database dump file with the format: `PROJECT_ID--PLATFORM_BRANCH--SERVICE_NAME--dump.sql` For merge/pull request environments, substitute `new-feature` for the name of the environment (i.e. `pr-42`).

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
DB_USER="postgres"

platform branch $ENVIRONMENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose build
docker-compose up -d
wait 10
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
DB_USER="postgres"

platform branch $ENVIRONMENT
platform db:dump -e $ENVIRONMENT -f $DUMP_FILE

docker-compose build
docker-compose up -d
wait 10
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
DB_USER="postgres"

platform branch $ENVIRONMENT
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

    {{< note title="Sanitizing production data" theme="info" >}}
{{% guides/sanitize-note %}}
    {{< /note >}}
