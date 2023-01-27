---
title: "Sanitizing databases: MariaDB and Drupal"
sidebarTitle: (Example) MariaDB and Drupal
description: Sanitize MariaDB data in non-production environments directly or by using Drush.
layout: list
---

## Before you begin

You need:

- A project with a [MySQL database](/add-services/mysql/_index.md).
- A command interface installed:
  - With Drupal: [Drush](https://www.drush.org/latest/install/)
  - Without Drupal: the [Platform CLI](/administration/cli/_index.md)

This guide is about sanitizing MySQL databases.

This guide doesn't address:

- Sanitizing NoSQL Databases (such as [MongoDB](/add-services/mongodb.md))
- Input validation and input sanitization, which both help prevent security vulnerabilities

## Sanitize the database

Make sure that you only sanitize development environments and **never** the production environment.
Otherwise you may lose most or even all of the relevant data stored in your database.

First, take a [database dump](/add-services/mysql/_index.md#exporting-data) of your development environment.
You won't alter your production data.
This is just a safety precaution.
To get a database dump, run: `platform db:dump -e <DEVELOPMENT_ENVIRONMENT_NAME>`.

{{< codetabs >}}

+++
title=Manually
+++

Assumptions:

- `users` is the table where all of your PII is stored in the `staging` development database.
- `staging` is an exact copy of your production database.

1. Connect to the `staging` database by running `platform sql -e staging`.
1. Display all fields from your `users` table, to select which ones need to be redacted.
   Run the following MySQL query:

   ```sql
   MariaDB [main]> SELECT * FROM users;
   ```

   You see output like the following:

   ```sql
   +----+------------+---------------+---------------------------+---------------+
   | ID | first_name | last_name     | user_email                | display_name  |
   +----+------------+---------------+---------------------------+---------------+
   |  1 | admin      | admin         | admin@yourcompany.com     | admin         |
   |  2 | john       | doe           | john.doe@gmail.com        | john          |
   |  3 | jane       | doe           | janedoe@ymail.com         | jane          |
   +----+------------+---------------+---------------------------+---------------+
   3 rows in set (0.00 sec)
   ```

1. Change the fields where PII is contained with the [`UPDATE` statement](https://mariadb.com/kb/en/update/).
   For example, to change the first name of users with an email address not in your company's domain, run the following query:

   ```sql
   UPDATE users
   SET first_name='redacted'
   WHERE email NOT LIKE '%@yourcompany%'
   ```

   Adapt and run that query for all fields that you need to sanitize.
   If you modify fields that you shouldn't alter,
   [you can restore them](/environments/restore.md) from the dump you took in step 1.

   You can create a script to automate the sanitization process to be run automatically on each new deployment.
   Once you have a working script, add your script to sanitize the database to [a `deploy` hook](/create-apps/hooks/hooks-comparison.md#deploy-hook):

   ```yaml
   deploy: |
       cd /app/public
       if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
           # Do whatever you want on the production site.
       else
           # The sanitization of the database should happen here (since it's non-production)
           sanitize_the_database.sh
       fi
   ```

<--->

+++
title=With Drupal and Drush
+++

1. To sanitize your database and get rid of sensitive, live information, use the `drush sql:sanitize` command.
   Add your script to sanitize the database to [a `deploy` hook](/create-apps/hooks/hooks-comparison.md#deploy-hook)
   for non-production environments:

  ```yaml
  deploy: |
      cd /app/public
      if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
          # Do whatever you want on the production site.
      else
          drush -y sql:sanitize
      fi
      drush -y updatedb
  ```

More options are available.
These are described in [Drush's documentation](https://www.drush.org/latest/commands/sql_sanitize/).

{{< /codetabs >}}

## What's next

{{% sanitize-whats-next %}}

If your database contains a lot of data, consider using the [`OPTIMIZE TABLE` statement](https://mariadb.com/kb/en/optimize-table/)
to reduce its size and help improve performance.
