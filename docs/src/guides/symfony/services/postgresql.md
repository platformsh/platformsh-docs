---
title: "Configure Symfony to use a PostgreSQL database engine"
sidebarTitle: "PostgreSQL"
weight: -100
description: "Use PostgreSQL with your Symfony project."
---

[comment]: <> (already exists here: https://symfony.com/doc/current/the-fast-track/en/7-database.html)

[Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application) embeds an SQLite database engine by default.
So if you created your project using Symfony Demo,
you might want to switch to a PostgreSQL database engine.

If you created a standard Symfony project,
you might want to set up PostgreSQL from scratch.

Either way, follow the directions on this page.

{{% guides/local-requirements name="Symfony" %}}
- [Docker app](https://docs.docker.com/engine/install/)
- The [`pdo_pgsql` extension](https://www.php.net/manual/en/ref.pdo-pgsql.php) (likely installed when you set up PHP)

## 1. Create a new branch

To create a new branch, run the following command at the root of your Symfony app:

```bash
symfony cloud:branch feat-add-postgresql
```

## 2. Configure your Symfony app to use PostgreSQL

To manage services, use Docker on your local machine.

{{< note >}}

Alternatively, you can [install PostgreSQL locally](https://www.postgresql.org/download/),
then jump to [updating the PostgreSQL schema](#2-update-the-postgresql-schema).

{{< /note >}}

1. Create a DockerFile for PostgreSQL.

   The generated `docker-compose.yml` file already contains PostgreSQL as a service:

   {{< readFile file="static/files/fetch/appyaml/symfony-docker-compose/platformsh-symfony-template" highlight="yaml" location="docker-compose.yml" >}}

   This installs a PostgreSQL server and configures environment variables that control the database name and credentials.
   The values don't really matter.

2. To expose the PostgreSQL port (`5432`) of the container to the local host,
   add the following configuration:

    ```yaml {location="./docker-compose.override.yml"}
    version: '3'

    services:
    ###> doctrine/doctrine-bundle ###
      database:
        ports:
          - "5432"
    ###< doctrine/doctrine-bundle ###
    ```

3. To start Docker Compose in the background (`-d`), run the following command:

   ```bash
   docker-compose up -d
   ```

   {{< note >}}
    
   When you use [Docker with Symfony Server](https://symfony.com/doc/current/setup/docker.html),
   your Symfony Server can automatically detect your Docker services and expose them as environment variables.
    
   {{< /note >}}

## 2. Update the PostgreSQL schema

If you're using Symfony Demo or if you've already created entities in your Symfony app,
update the PostgreSQL schema by running the following command:

```bash
symfony console doctrine:schema:update --force
```

## 3. Import data

To import data, run the following command depending on the source:

{{< codetabs >}}
+++
title=Demo fixtures
+++

To import demo fixtures locally, run the following command:

```bash
symfony console doctrine:fixtures:load
```

<--->
+++
title=SQL dump
+++
To import an existing SQL dump, run the following command:

```bash
symfony run psql < dump.sql
```

{{< note >}}

If you already have custom data in your previous SQLite database,
see [how to migrate from SQLite to PostgreSQL using `pgloader`](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html).

{{< /note >}}

{{< /codetabs >}}

## 4. Configure your Platform.sh project to use PostgreSQL

1. Add a PostgreSQL database engine component.

   [All the components](../../../add-services#available-services) used for your Platform.sh environment,
   including the cache component, are listed in the `.platform/services.yaml` file.
   To add a new PostgreSQL database engine component, add the following configuration:

    ```yaml {location=".platform/services.yaml"}
    database:
      type: postgresql:15
      disk: 1024
    ```

2. Add a new relationship.

   To manage access to containers within your project, 
   define [relationships](../../../create-apps/app-reference.html#relationships)
   in the `relationships` section of your `.platform.app.yaml` file.
   To do so, add the following configuration:

    ```yaml {location=".platform.app.yaml"}
    relationships:
        database: "database:postgresql"
    ```

3. Add the PHP extension.

   For PHP to communicate with your PostgreSQL database engine component, a `php-ext` is needed.
   All the PHP extensions that need to be installed during runtime are listed
   in the `runtime` section of your `.platform.app.yaml` file.
   Use the following configuration:

    ```yaml {location=".platform.app.yaml"}
    runtime:
       extensions:
          - ...
          #- pdo_sqlite
          - pdo_pgsql
    ```
   comment/remove `pdo_sqlite` php-ext and add `pdo_pgsql` from the list


4. Commit your files and deploy.

   To commit your modified files to your Git branch and deploy those changes to your environment,
   run the following command:

    ```bash
    git add . && git commit -m "change database engine to PostgreSQL" && symfony deploy
    ```

   After deployment, the PostgreSQL database engine is up and ready to use.

5. Import data.

   To import data, run the following command depending on the source:

{{< codetabs >}}

+++
title=Demo fixtures
+++

To import demo fixtures on your Platform.sh project, run the following command:

```bash
symfony ssh -- php bin/console doctrine:fixtures:load -y
```

<--->
+++
title=SQL dump
+++

To import an existing SQL dump, run the following command:

```bash
symfony cloud:sql < dump.sql
```

{{< note >}}

If you already have custom data in your previous SQLite database,
see [how to migrate from SQLite to PostgreSQL using `pgloader`](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html)

{{< /note >}}

{{< /codetabs >}}

6. To deploy PostgreSQL in production, run the following commands:

   ```bash
   symfony checkout main
   symfony merge feat-add-postgresql
   git pull -r
   ```

   {{< note >}}

   The `symfony merge` command merges your `feat-add-postgresql` environment into your production environment.
   But it doesn't pull the merge result locally. To do so, run `git pull -r` before doing anything else on the branch.

   {{< /note >}}

## Tips and tricks

{{% tips-and-tricks/symfony/cli-database-postgres framework="Symfony" %}}