---
title: "Configure Symfony to use PostgreSQL database engine"
sidebarTitle: "Use PostgreSQL"
weight: -100
description: "Modify your Symfony site to use PostgreSQL."
---

[comment]: <> ( already exists here : https://symfony.com/doc/current/the-fast-track/en/7-database.html)

The Symfony Demo skeleton embeds by default a SQLite database engine.

In this how-to tutorial, you can learn how to switch to PostgreSQL database engine.
And if using the Symfony Base version, you can learn how to use PostgreSQL from scratch.

{{% guides/local-requirements name="Symfony" %}}
- [Docker app](https://docs.docker.com/engine/install/) installed

## Create a new branch
From your terminal, at the root of your Symfony application, create a new Git branch:

```bash
symfony cloud:branch feat-add-postgresql
```

## Configure your Symfony Application to use PostgreSQL
On your local machine, we have decided to use Docker to manage services.
{{< note >}}
If you prefer to [install PostgreSQL locally](https://www.postgresql.org/download/), you can skip this step.
{{< /note >}}

1. Create a DockerFile for PostgreSQL
    The generated docker-compose.yml file already contains PostgreSQL as a service: {{< readFile file="static/files/fetch/appyaml/symfony-docker-compose/platformsh-symfony-template" highlight="yaml" location="docker-compose.yml" >}}

    This will install a PostgreSQL server and configure some environment variables that control the database name and credentials.
    The values do not really matter.

    We also expose the PostgreSQL port (`5432`) of the container to the local host.
    That will help us access the database from our machine:

    ```yaml {location="./docker-compose.override.yml"}
    version: '3'

    services:
    ###> doctrine/doctrine-bundle ###
      database:
        ports:
          - "5432"
    ###< doctrine/doctrine-bundle ###
    ```

    The `pdo_pgsql` extension should have been installed when PHP was set up in a previous step.

1. Start Docker Compose

    Start Docker Compose in the background (-d):
    ```bash
    docker-compose up -d
    ```

{{< note >}}
When using [Docker with Symfony Server](https://symfony.com/doc/current/setup/docker.html), then your Symfony Server can automatically detect your Docker services and expose them as environment variables.
{{< /note >}}

## Update PostgreSQL schema
If you're using Symfony Demo or if you already have created entities in your Symfony application, run the following
```bash
symfony console doctrine:schema:update --force
```

## Import data
Depending on the data source you want to import, run the following:

{{< codetabs >}}
+++
title=Demo fixtures
+++
To import demo fixtures locally, run the following:
```bash
symfony console doctrine:fixtures:load
```

<--->
+++
title=SQL dump
+++
To import an existing SQL dump, run the following:
```bash
symfony run psql < dump.sql
```
{{< note >}}
If you already have custom data in your previous SQLite database, see this tutorial on [how to migrate from SQLite to PostgreSQL using `pgloader`](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html)
{{< /note >}}
{{< /codetabs >}}

You're ready to go locally with PostgreSQL.

## Configure your Platform.sh project to use PostgreSQL

1. Add a PostgreSQL database engine component
    All components used for your Platform.sh environment are listed in the .platform/services.yaml file.
    Database engine is part of it and you need to add a new PostgreSQL component in this file.

    ```yaml {location=".platform/services.yaml"}
    database:
      type: postgresql:15
      disk: 1024
    ```
    Follow this link to get more info on [all available components](../../../add-services#available-services).

1. Add a new relationship
    To manage access to containers within your project, you need to define a relationship to it.
    These relationships are defined in the `.platform.app.yaml` file, section `relationships`.
    ```yaml {location=".platform.app.yaml"}
    relationships:
        database: "database:postgresql"
    ```
   Follow this link to get more info on [relationships](../../../create-apps/app-reference.html#relationships).

1. Add the PHP extension
    For PHP to communicate with the PostgreSQL database engine, a php-ext is needed.
    All PHP extensions that need to be installed during runtime are listed in the `.platform.app.yaml` file, section `runtime`
    runtime:
    ```bash {location=".platform.app.yaml"}
    runtime:
       extensions:
          - ...
          #- pdo_sqlite
          - pdo_pgsql
    ```
   comment/remove `pdo_sqlite` php-ext and add `pdo_pgsql` from the list


1. Commit your files and deploy

   Commit your modified files into your git branch and then deploy it to your environment.
    ```bash
    git add . && git commit -m "change database engine to PostgreSQL" && symfony deploy
    ```
   After deployment, the PostgreSQL database engine is up and ready to use.

1. Import data

   Depending on the data source you want to import, run the following:

{{< codetabs >}}
+++
title=Demo fixtures
+++
To import demo fixtures on your Platform.sh project, run the following:
```bash
symfony ssh -- php bin/console doctrine:fixtures:load -y
```
<--->
+++
title=SQL dump
+++
To import an existing SQL dump, run the following:
```bash
symfony cloud:sql < dump.sql
```
{{< note >}}
If you already have custom data in your previous SQLite database, see this tutorial on [how to migrate from SQLite to PostgreSQL using `pgloader`](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html)
{{< /note >}}
{{< /codetabs >}}

## Deploy PostgresSQL in production

If there is no issue on your Platform.sh environment using the Redis component, you can deploy it to production.
```bash
symfony checkout main
symfony merge feat-add-postgresql
git pull -r
```

{{< note >}}
`symfony merge` command merge your environment `feat-add-postgresql` to your production environment, but it doesn't pull the merge result locally. That’s why you need to run `git pull -r` before doing anything else on that branch.
{{< /note >}}

## Tips and tricks

{{% tips-and-tricks/symfony/cli-database-postgres framework="Symfony" %}}
