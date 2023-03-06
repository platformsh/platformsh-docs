---
title: "Configure Symfony to use PostgreSQL database engine"
sidebarTitle: "Use PostgreSQL"
weight: -101
description: "Modify your Symfony site to use PostgreSQL."
---

The Symfony Demo skeleton embeds by default a SQLite database engine.

In this how-to tutorial, you can learn how to switch to PostgreSQL database engine.
And if using the Symfony Base version, you can learn how to use PostgreSQL from scratch.


## Make your Platform.sh project use PostgreSQL
1. From your terminal, at the root of your Symfony application, create a new GIT branch:

     ```bash
     symfony branch feat-add-postgresql
     ```
1. Add a PostgreSQL database engine component
    All components used for your Platform.sh environment are listed in the .platform/services.yaml file.
    Database engine is part of it and you need to add a new PostgreSQL component in this file.

    ```yaml
    database:
      type: postgresql:14
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

## Make your Symfony application use PostgreSQL

1. Configure Symfony to use PostgreSQL locally
{{< codetabs >}}
+++
title=Using DDEV
+++
Assumptions:

- Your project is already running locally using [Symfony Server](../local/symfony-server.md)

When managing many projects, it’s complex to handle all the dependencies.
DDEV is useful to embed those needed components into Docker containers without needs of writing complex DockerFile files.
To configure your DDEV project to use PostgreSQL database engine, follow this steps:

1. Delete existing database from your DDEV project
    ```bash
    ddev delete -y
    ```
    This automatically create a snapshot of your existing database into `.ddev/db_snapshots/` folder.

1. Configure your DDEV project to use PostgreSQL
    ```bash
    ddev config --php-version=8.2 --database=postgres:14
    ddev restart
    ddev status
    ```
   From the latest command `ddev status`, `db` service is now using PostgreSQL.

1. Inject `DATABASE_URL` to your DDEV web container
   Modify `.ddev/config.yaml` file to add a new `DATABASE_URL` environment variable
    ```yaml {location=".ddev/config.yaml"}
    web_environment:
        - DATABASE_URL=postgresql://db:db@db:5432/db
   ```
   Adapt database credentials to the ones given by previous `ddev status` command, service `db`

1. Restart your DDEV project
   ````bash
   ddev restart
   ````

1. Clear Symfony Cache
    ```bash
    ddev php bin/console cache:clear
        // Clearing the cache for the prod environment with debug false
        [OK] Cache for the "prod" environment (debug=false) was successfully cleared.
    ```

1. Update your database schema
    ```bash
   ddev php bin/console doctrine:schema:update --force
   ```

1. Import fixtures
    ```bash
    ddev php bin/console doctrine:fixtures:load -y
    ```

{{< note >}}
If you already have custom data in your SQLite database, see this tutorial on [how to migrate from SQLite to PostgreSQL using `pgloader`](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html)
{{< /note >}}

<--->
+++
title=Using Symfony Server
+++

1. Install PostgreSQL locally or use an existing Docker container

    You can either install [PostgreSQL locally](https://www.postgresql.org/download/) or use an existing [PostgreSQL Docker container](https://hub.docker.com/_/postgres)

1. Configure Symfony to use PostgreSQL

    Modify your `.env.local` file with the following:
    ```
    DATABASE_URL=postgresql://<LOGIN>:<PASSWORD>@<HOST>:5432/<DBNAME>
    ```
    Define {{< variable "LOGIN" >}}, {{< variable "PASSWORD" >}}, {{< variable "HOST" >}} and {{< variable "DBNAME" >}} accordingly

1. Clear Symfony Cache
    ```bash
    symfony console cache:clear
        // Clearing the cache for the prod environment with debug false
        [OK] Cache for the "prod" environment (debug=false) was successfully cleared.
    ```

1. Create database
    ```bash
    symfony console doctrine:database:create
    ```

1. Update your database schema
    ```bash
   symfony console doctrine:schema:update --force
   ```

1. Import fixtures
    ```bash
    symfony console doctrine:fixtures:load -y
    ```


{{< note >}}
If you already have custom data in your SQLite database, see this tutorial on [how to migrate from SQLite to PostgreSQL using `pgloader`](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html)
{{< /note >}}

{{< /codetabs >}}

1. Commit your files and deploy

   Commit your modified files into your git branch and then deploy it to your environment.
    ```bash
    git add . && git commit -m "change database engine to PostgreSQL 14" && symfony deploy
    ```
   After deployment, the PostgreSQL database engine is up and ready to use.

1. Deploy PostgresSQL in production

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

{{% tips-and-tricks/symfony/cli-database %}}
