---
title: "Exporting data"
description: See how to export your code, files and service's data.
---

Platform.sh never wants to lock you in to our service.
Your code and your data belong to you,
and you should always be able to download your site's data for local development,
backup, or to "take your data elsewhere".
## Before you begin

You need:

- [Git](https://git-scm.com/downloads)
- A Platform.sh account
- Code in your project
- Optional: the [Platform.sh CLI](../administration/cli/_index.md)

## 1. Download your app's code

Your app code is maintained through the Git version control system.

To download your entire app's code history:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

1. List all your projects with:

   ```bash
   platform projects
   ```

2. Retrieve the project you want to backup with:

   ```bash
   platform get {{< variable "PROJECT_ID" >}}
   ```

<--->

---
title=Using Git
file=none
highlight=false
---

1. In the [Console](https://console.platform.sh/), open your project and click **Code {{< icon chevron >}}**.
2. Click **Git**.
3. Click **{{< icon copy >}}** to copy the command.
4. Run the command to clone the repository.
   It looks similar to the following:

   ```text
   git clone abcdefgh1234567@git.eu.platform.sh:abcdefgh1234567.git project-name
   ```

{{< /codetabs >}}

## 2. Download your files

Some files might not be stored in Git,
such as data your app writes [in mounts](../create-apps/app-reference.md#mounts).

To download your files:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

1. Get a list of all your mounts:

   ```bash
   platform mount:list
   ```

2. Download all of your files from a given mount:

   ```bash
   platform mount:download --mount {{< variable "MOUNT_PATH" >}} --target ./{{< variable "LOCAL_FOLDER" >}}
   ```

<--->

---
title=Using SSH
file=none
highlight=false
---

See how to transfer files [using `scp`](../development/file-transfer.md#scp) or [`rsync`](../development/file-transfer.md#rsync).

{{< /codetabs >}}

For more examples, see how to [transfer files to and from a built app](../development/file-transfer.md).

## 3. Download data from services

The mechanism for downloading from each service (such as your database) varies.

For services designed to hold non-persistent data, such as Redis or Solr,
it's generally not necessary to download data as it can be rebuilt from the primary data store.

For services designed to hold persistent data, see each service's page for instructions:

- [MySQL](../add-services/mysql/_index.md#exporting-data)
- [PostgreSQL](../add-services/postgresql.md#exporting-data)
- [MongoDB](../add-services/mongodb.md#exporting-data)
- [InfluxDB](../add-services/influxdb.md#exporting-data)

## 4. Get the environment variables

Environment variables can contain critical information such as tokens or additional configuration options for your app.

Environment variables beginning with:

- `env:` are exposed [as Unix environment variables](../development/variables/_index.md#top-level-environment-variables).
- `php:` are interpreted [as `php.ini` directives](../development/variables/_index.md#php-specific-variables).

All other variables are [part of `$PLATFORM_VARIABLES`](../development/variables/use-variables.md#use-platformsh-provided-variables).

To backup your environment variables:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

1. Get the variable's values, by running:

   ```bash
   platform ssh --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT" >}} -- 'echo $PLATFORM_VARIABLES | base64 -d | jq'
   ```

2. Optional: To get all the environment variable values, run:

   ```bash
   platform ssh --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT" >}} -- env
   ```

3. Store the data on your local computer in the way you see fit, for example in an encrypted text file for sensitive tokens.

<--->

---
title=In the Console
file=none
highlight=false
---

1. In the [Console](https://console.platform.sh/), open your project and click **{{< icon settings >}}**.
2. Click **Project Settings {{< icon chevron >}}**.
3. Click **Variables** and access your variable's values and settings.
4. Store the data on your local computer in the way you see fit, for example in an encrypted text file for sensitive tokens.

Note that in the Console, you can't access the value of variables that have been created using the [`--sensitive true` flag](../development/variables/set-variables.md#variable-options).
Use the CLI instead to retrieve these values.

{{< /codetabs >}}

## What's next

- Set up your [local development environment](../development/local/_index.md)
- Migrate to [another region](../projects/region-migration.md)