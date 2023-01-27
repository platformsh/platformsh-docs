---
title: "Sanitizing databases: PostgreSQL and Django"
sidebarTitle: (Example) PostgreSQL and Django
description: Sanitize PostgreSQL data in non-production environments for Django apps.
layout: list
---

## Before you begin

You need:

- A project with a [PostgreSQL database](/add-services/postgresql/_index.md).

This guide is about sanitizing PostgreSQL databases.

This guide doesn't address:

- Sanitizing NoSQL Databases (such as [MongoDB](/add-services/mongodb.md))
- Input validation and input sanitization, which both help prevent security vulnerabilities

## Sanitize the database

Make sure that you only sanitize development environments and **never** the production environment.
Otherwise you may lose most or even all of the relevant data stored in your database.

First, take a [database dump](/add-services/postgresql#exporting-data) of your development environment.
You won't alter your production data.
This is just a safety precaution.
To get a database dump, run: `platform db:dump -e <DEVELOPMENT_ENVIRONMENT_NAME>`.

{{< codetabs >}}

+++
title=Manually
file=none
highlight=false
+++

Assumptions:

- `users` is the table where all of your PII is stored in the `staging` development database.
- `staging` is an exact copy of your production database.

1. Connect to the `staging` database by running `platform sql -e staging`.
1. Display all fields from your `users` table, to select which ones need to be redacted.
   Run the following query:

   ```sql
    psql (14.5 (Debian 14.5-1.pgdg100+1), server 12.12 (Debian 12.12-1.pgdg90+1))
    Type "help" for help.

    main=> SELECT * FROM users;
   ```

   You see output like the following:

   ```sql
    id   |                  email                  |       username        
    -----+-----------------------------------------+-----------------------
    3501 | daniel02@brown.biz                      | Jason Brown
    3502 | ismith@kim.com                          | Sandra Griffin
    3503 | olee@coleman-rodriguez.com              | Miss Christine Morgan
   (3 rows)
   ```

1. Change the fields where PII is contained with the [`UPDATE` statement](https://mariadb.com/kb/en/update/).
   For example, to change the username of users to a random redacted value, run the following query:

   ```sql
   UPDATE users
   SET username=substring(md5(username||'$PLATFORM_PROJECT_ENTROPY') for 8);
   ```

   Adapt and run that query for all fields that you need to sanitize.
   If you modify fields that you shouldn't alter,
   [you can restore them](/environments/restore.md) from the dump you took in step 1.

<--->

+++
title=Using a script with Django and psql
file=none
highlight=false
+++

Assumptions:

- `users` is the table where all of your PII is stored in the `staging` development database.
- `database` is the relationship name used for the PostgreSQL service definition.

    ```yaml {location=".platform.app.yaml"}
    relationships:
        database: "db:postgresql"
    ```

1. Retrieve service credentials from the `PLATFORM_RELATIONSHIPS` environment variable.

    Having these credentials will allow you to use the `psql` command interface.
    You can export these values to a [`.environment` file](/development/variables/set-variables#set-variables-via-script), or include them directly in a sanitization script.

    ```bash {location=".environment"}
    # Pull credentials from PLATFORM_RELATIONSHIPS environment variable.
    DB_USER=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].username')
    DB_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].host')
    DB_PORT=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].port')
    DB_PASS=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r '.database[0].password')
    ```

2. Create an executable sanitizing script.

    ```bash
    touch sanitize.sh && chmod +x sanitize.sh
    ```

3. Add the sanitization script.

    The three environment types on Platform.sh are:

    - Production (`PLATFORM_ENVIRONMENT_TYPE` = `production`)
    - Staging (`PLATFORM_ENVIRONMENT_TYPE` = `staging`)
    - Development (`PLATFORM_ENVIRONMENT_TYPE` = `development`)

    In the script below, the built-in environment variable `PLATFORM_ENVIRONMENT_TYPE` is leveraged (along with `PLATFORM_PROJECT_ENTROPY`) to sanitize the `username` and `email` columns of table `users` when called.

    ```bash {location="sanitize.sh"}
    #!/usr/bin/env bash

    if [ "$PLATFORM_ENVIRONMENT_TYPE" != production ]; then
        # Sanitize data
        PGPASSWORD=$DB_PASS psql -c "UPDATE users SET username=substring(md5(username||'$PLATFORM_PROJECT_ENTROPY') for 8);" -U $DB_USER -h $DB_HOST -p $DB_PORT
        PGPASSWORD=$DB_PASS psql -c "UPDATE users SET email=substring(md5(email||'$PLATFORM_PROJECT_ENTROPY') for 8);" -U $DB_USER -h $DB_HOST -p $DB_PORT
    fi   
    ```

4. Update the deploy hook.

    ```yaml {location=".platform.app.yaml"}
    hooks:
        build: ...
        deploy: |
            python manage.py migrate
            bash sanitize.sh
    ```

5. Commit the changes.

    ```bash
    git add .environment sanitize.sh .platform.app.yaml && git commit -m "Add sanitization."
    ```

    Push the changes to `staging` and verify sanitization took place on that environment's database.
    Once merged, all future non-production environment's data will be sanitized when created.

{{< /codetabs >}}

## What's next

{{% sanitize-whats-next %}}

If your database contains a lot of data, consider using the [`REINDEX` statement](https://www.postgresql.org/docs/current/sql-reindex.html) to help improve performance.
