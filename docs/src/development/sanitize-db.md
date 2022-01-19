---
title: Sanitize databases
description: Remove sensitive information from databases on non-production environments to control access.
---

When creating or pushing a branch to Platform.sh, both the code and the database get inherited to a new branch.
Depending on your processes, internal or external teams may check the code changes on that new branch.

Databases of live websites often contain personally identifiable information (PII)
such as full names, mailing addresses, and phone numbers.
To avoid any unauthorized access to PII on the development environment, you can sanitize the database.

## Before you begin

This guide is about sanitizing databases.
This guide doesn't address input validation or input sanitization.
See an introduction to these topics in the [Open Web Application Security Project cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#goals-of-input-validation).
The `log4j` security vulnerability is an example of what missing input sanitization can cause.

NoSQL Databases ([MongoDB](../configuration/services/mongodb/_index.md), ...) can benefit from sanitization but for the sake of simplicity, 
these use cases won't be covered in this guide.

You need:

- A project with a [MySQL database](../configuration/services/mysql/_index.md)
- The [Platform CLI](/development/cli/_index.md#cli-command-line-interface) installed locally

## Sanitize the database

Make sure that you only sanitize development environments and **never** on the production environment.
Otherwise you may lose most or even all of the relevant data stored in your database.

{{< codetabs >}}

---
title=Manually
file=none
highlight=false
---

Assumptions:

- `staging` is the name of the database that you want to sanitize.
- The `staging` database is an exact copy of your production database.
- `user` is the table where all your PII is stored.

1. As a safety precaution, take a [database dump](../configuration/services/mysql.md#exporting-data). Run `platform db:dump -e staging` to get a database dump of your staging environment,
1. Connect to the `staging` database with `platform sql -e staging`.
1. Display all fields from your `user` database with `SELECT * FROM users;`.
   This results in something like the following:

   ```sql
   MariaDB [main]> SELECT * FROM users;
   +----+------------+---------------+---------------------------+---------------+
   | ID | first_name | last_name     | user_email                | display_name  |
   +----+------------+---------------+---------------------------+---------------+
   |  1 | admin      | admin         | admin@yourcompany.com     | admin         |
   |  2 | john       | doe           | john.doe@gmail.com        | john          |
   |  3 | jane       | doe           | janedoe@ymail.com         | jane          |
   +----+------------+---------------+---------------------------+---------------+
   3 rows in set (0.00 sec)
   ```

1. Change the fields where PII Data is contained with [`UPDATE` Queries](https://dev.mysql.com/doc/refman/8.0/en/update.html).
   For example, changing the first name of an user, when the email address is not using the company domain, would result in the following query:

   ```sql
   UPDATE user
   SET first_name='redacted'
   WHERE email NOT LIKE '%@yourcompany%'
   ```

   Adapt and run that query for all fields that you need to sanitized.
   If you modify fields that you shouldn't alter,
   [you can restore them](../administration/backup-and-restore.md#restore) from the dump you took in step 1.

   You can create a script to automate the sanitization process to be able to run it in [your deployment hook](../user_guide/reference/platform-app-yaml.html#hooks):

    ```yaml
    deploy: |
      cd /app/public
      if [ $PLATFORM_ENVIRONMENT = "main" ]; then
        # Do whatever you want on the production site.
      else
        # The sanitization of the database should happen here (since it's non-production)
      fi
    ```

<--->

---
title=When using Drupal
file=none
highlight=false
---

1. Take a [database dump](../configuration/services/mysql/_index.md#exporting-data). In this guide production data won't be altered, consider it merely as a safety precaution. Run `platform db:dump -e staging` to get a database dump of your staging environment,
To sanitize your database and get rid of sensitive, live information, use [the `drush sql-sanitize` command](https://www.drupal.org/project/database_sanitize).
Add the sanitization of the database script in [your hook](../user_guide/reference/platform-app-yaml.html#hooks) for the non-production environment:

  ```yaml
  type: php:7.0
  build:
  flavor: drupal
  hooks:
  build: |
    # Whatever you want to do during the build phase.
  deploy: |
    cd /app/public
    if [ $PLATFORM_ENVIRONMENT = "main" ]; then
      # Do whatever you want on the production site.
    else
      drush -y sql-sanitize --sanitize-email=user_%uid@example.com --sanitize-password=custompassword
    fi
    drush -y updatedb
  ```

{{< /codetabs >}}

## What's next

In this guide you learned how to remove sensitive data from a database.

To keep meaningful data, you could add a `faker` in the process.
A `faker` is a program that generates fake data that looks real.
It can be used to replace sensitive data with fake data.
Having meaningful PII-free data allows you to keep your current Q&A, external reviews, and other processes.
To add a faker, adapt your sanitizing queries to replace each value that contains PII with a new value generated by the faker.

You might also want to make sure that you [implement input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#goals-of-input-validation).

If your database contains a lot of data, consider using the `OPTIMIZE TABLE` query to reduce its size,
as recommended in [MySQL's reference manual](https://dev.mysql.com/doc/refman/8.0/en/optimize-table.html).
