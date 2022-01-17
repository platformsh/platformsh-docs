---
title: Sanitize databases on non-production environments
sidebarTitle: Sanitize databases
description: Find out how to sanitize databases when synchronizing or branching data from production to non-production environments.
---

<!-- 
When to use
  When there is a single outcome a user wants to achieve.
  When you want to explain how to get to the outcome in ordered steps.
  https://diataxis.fr/how-to-guides/ 

How to use
  1. Copy this template into the right directory in /src/docs/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
-->

When using the branching feature on platform.sh, your production database gets copied to each new branch.
This is very helpful to test directly if your latest code changes work as expected.
However, in some cases, branching, or copying data from production to non-production (staging, ...) environments might require sanitizing the database.

Sanitizing a database has several benefits: 
- Removing Personally Identifiable Information (PII) from the database avoids unauthorized access to sensitive data.
- Reducing the database size helps reducing the strains on the infrastructure (since non-production environments usually have less resources available than production).

## Before you begin

This guide is about sanitizing databases.
This guide doesn't address input validation and sanitization, however it's a topic worth checking out.
The [Open Web Application Security Project (OWASP) cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#goals-of-input-validation) offers a (free) introduction on that topic. 
The `log4j` security vulnerability is an example of what missing input sanitization can cause as issues.

Prior experience using git and [MySQL databases](../configuration/services/mysql.md) is recommended.
NoSQL Databases ([MongoDB](../configuration/services/mongodb.md), ...) can benefit from sanitization but for the sake of simplicity, these use cases won't be covered in this guide.

You'll need:
- a project set up that uses a [MySQL database](../configuration/services/mysql.md)
- The [Platform CLI](/development/cli.md#cli-command-line-interface) installed locally

{{< codetabs >}}

---
title=Using a customised sanitizing script
file=none
highlight=false
---

Assumptions:
- `staging` is the name of the non-production database that you want to sanitize.
- The `staging` database is a 1:1 copy of your production database.

1. Take a [database dump](../configuration/services/mysql.md#exporting-data). In this guide production data won't be altered, see it merely as a safety precaution. Run `platform db:dump -e production` to get a database dump of your production environment,
1. Connect to the `staging` database with `platform sql -e staging`,
1. <ADD EXAMPLES OF QUERY TO RUN>
1. Add the sanitization of the database in [your hook](../user_guide/reference/platform-app-yaml.html#hooks) for the non-production environment. 
```yaml
deploy: |
  cd /app/public
  if [ $PLATFORM_ENVIRONMENT = "master" ]; then
    # Do whatever you want on the production site.
  else
    # The sanitization of the database should happen here (since it's non-production)
    <ADD EXAMPLES OF QUERY TO RUN>
  fi
```

If your database contains a lot of data, consider using the `OPTIMIZE TABLE` query to reduce it's size, 
as recommended in [MySQL's reference manual](https://dev.mysql.com/doc/refman/8.0/en/optimize-table.html)

<--->

---
title=Using Drupal
file=none
highlight=false
---

With Drupal, you can use [the `drush sql-sanitize` command](https://www.drupal.org/project/database_sanitize) to sanitize your database and get rid of sensitive, live, information.

Make sure that the sanitization only runs on the development environments and **never** on the master environment, otherwise you will loose most — if not all — of the relevant data stored in your database.

```yaml
type: php:7.0
build:
flavor: drupal
hooks:
build: |
  # Whatever you want to do during the build phase.
deploy: |
  cd /app/public
  if [ $PLATFORM_ENVIRONMENT = "master" ]; then
    # Do whatever you want on the production site.
  else
    drush -y sql-sanitize --sanitize-email=user_%uid@example.com --sanitize-password=custompassword
  fi
  drush -y updatedb
```

{{< /codetabs >}}


## What's next

In this guide you learned how to remove sensitive data from a database. 
To keep meaningful data that's not PII-relevant, you could add a `faker` into the process.
A `faker` is a program that generates fake data that looks "real". 
Many OpenSource Fakers are available online.
Having meaning full PII-free data allows you to keep your current Q and A processes, external reviews, ...

To add a faker, consider adapting the queries ran previously.

You might also want to make sure that you [implement input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#goals-of-input-validation).
