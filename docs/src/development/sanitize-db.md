---
title: Sanitize databases
description: Remove sensitive information from databases on non-production environments to control access.
---

When working on a new feature on your website, you want to use a new branch.
Using a new branch makes sure that you don't risk breaking your live, production website.

Creating a branch on Platform.sh copies both the code and the database to that new development branch.
These code and database changes need to be tested before being merged into production.
Depending on your processes, internal or external teams may interact with the development environment branch.

Databases of live websites often contain personally identifiable information (PII)
such as full names, mailing addresses, and phone numbers.
To ensure people reviewing the code changes can't access information they shouldn't, sanitize the database of any PII that it may contain.

## Before you begin

You need:

- A project with a [MySQL database](../add-services/mysql/_index.md).
- A command interface installed:
  - With Drupal: [Drush](https://www.drush.org/latest/install/)
  - Without Drupal: the [Platform CLI](../administration/cli/_index.md)

This guide is about sanitizing MySQL databases.

This guide doesn't address:

- Sanitizing NoSQL Databases (such as [MongoDB](../add-services/mongodb.md))
- Input validation and input sanitization, which both help prevent security vulnerabilities

## Sanitize the database

Make sure that you only sanitize development environments and **never** the production environment.
Otherwise you may lose most or even all of the relevant data stored in your database.

First, take a [database dump](../add-services/mysql/_index.md#exporting-data) of your development environment.
You won't alter your production data.
This is just a safety precaution.
To get a database dump, run: `platform db:dump -e <DEVELOPMENT_ENVIRONMENT_NAME>`.

{{< codetabs >}}

---
title=Manually
file=none
highlight=false
---

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

1. Change the fields where PII is contained with the [`UPDATE` statement](https://dev.mysql.com/doc/refman/8.0/en/update.html).
   For example, to change the first name of users with an email address not in your company's domain, run the following query:

   ```sql
   UPDATE users
   SET first_name='redacted'
   WHERE email NOT LIKE '%@yourcompany%'
   ```

   Adapt and run that query for all fields that you need to sanitize.
   If you modify fields that you shouldn't alter,
   [you can restore them](../environments/restore.md) from the dump you took in step 1.

   You can create a script to automate the sanitization process to be run automatically on each new deployment.
   Once you have a working script, add your script to sanitize the database to [a `deploy` hook](../create-apps/hooks/hooks-comparison.md#deploy-hook):

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

---
title=With Drupal and Drush
file=none
highlight=false
---

1. To sanitize your database and get rid of sensitive, live information, use the `drush sql:sanitize` command.
   Add your script to sanitize the database to [a `deploy` hook](../create-apps/hooks/hooks-comparison.md#deploy-hook)
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

You learned how to remove sensitive data from a database.

To replace sensitive data that with other meaningful data, you can add a `faker` to the process.
A `faker` is a program that generates fake data that looks real.
Having meaningful PII-free data allows you to keep your current Q&A, external reviews, and other processes.
To add a faker, adapt your sanitizing queries to replace each value that contains PII with a new value generated by the faker.

You might also want to make sure that you [implement input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#goals-of-input-validation).

If your database contains a lot of data, consider using the [`OPTIMIZE TABLE` statement](https://dev.mysql.com/doc/refman/8.0/en/optimize-table.html)
to reduce its size and help improve performance.
