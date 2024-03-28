---
title: "Exporting data"
description: See how to export your code, files and service data.
---

As a {{% vendor/name %}} user, your code and data belong to you.
At any time, you can download your site's data for local development, to back up your data, or to change provider.

## Before you begin

You need:

- [Git](https://git-scm.com/downloads)
- A {{% vendor/name %}} account
- Code in your project
- Optional: the [{{% vendor/name %}} CLI](/administration/cli/_index.md)

## 1. Download your app's code

Your app's code is maintained through the Git version control system.

To download your entire app's code history:

{{< codetabs >}}

+++
title=Using the CLI
+++

1. List all your projects by running the following command:

   ```bash
   {{% vendor/cli %}} projects
   ```

2. Retrieve the project you want to back up by running the following command:

   ```bash
   {{% vendor/cli %}} get {{< variable "PROJECT_ID" >}}
   ```

<--->

+++
title=Using Git
+++

1. In the [Console](https://console.{{< vendor/urlraw "host" >}}/), open your project and click **Code {{< icon chevron >}}**.
2. Click **Git**.
3. To copy the command, click **{{< icon copy >}} Copy**.
   The command is similar to the following:

   ```text
   git clone abcdefgh1234567@git.eu.{{< vendor/urlraw "host" >}}:abcdefgh1234567.git project-name
   ```

{{< /codetabs >}}

## 2. Download your files

Some files might not be stored in Git,
such as data your app writes [in mounts](/create-apps/app-reference/single-runtime-image.md#mounts).

You can download your files [using the CLI](/development/file-transfer.md#transfer-files-using-the-cli) or [using SSH](/development/file-transfer.md#transfer-files-using-an-ssh-client).

## 3. Download data from services

The mechanism for downloading from each service (such as your database) varies.

For services designed to hold non-persistent data, such as [Redis](/add-services/redis.md) or [Solr](/add-services/solr.md),
it's generally not necessary to download data as it can be rebuilt from the primary data store.

For services designed to hold persistent data, see each service's page for instructions:

- [MySQL](/add-services/mysql/_index.md#exporting-data)
- [PostgreSQL](/add-services/postgresql.md#exporting-data)
- [MongoDB](/add-services/mongodb.md#exporting-data)
- [InfluxDB](/add-services/influxdb.md#export-data)

## 4. Get environment variables

Environment variables can contain critical information such as tokens or additional configuration options for your app.

Environment variables can have different prefixes:

- Variables beginning with `env:` are exposed [as Unix environment variables](/development/variables/_index.md#top-level-environment-variables).
- Variables beginning with `php:` are interpreted [as `php.ini` directives](/development/variables/_index.md#php-specific-variables).

All other variables are [part of `$PLATFORM_VARIABLES`](/development/variables/use-variables.md#use-provided-variables).

To back up your environment variables:

{{< codetabs >}}

+++
title=Using the CLI
+++

1. Get the variable's values by running the following command:

   ```bash
   {{% vendor/cli %}} ssh -- 'echo $PLATFORM_VARIABLES | base64 -d | jq'
   ```

   Note that you can also get all the environment variable values by running the following command:

   ```bash
   {{% vendor/cli %}} ssh -- env
   ```

2. Store the data somewhere secure on your computer.

<--->

+++
title=In the Console
+++

1. In the [Console](https://console.{{< vendor/urlraw "host" >}}/), open your project and click **{{< icon settings >}}**.
2. Click **Project Settings {{< icon chevron >}}**.
3. Click **Variables** and access your variable's values and settings.
4. Store the data somewhere secure on your computer.

Note that in the Console, you can't access the value of variables that have been [marked as sensitive](/development/variables/set-variables.md#variable-options).
Use the CLI to retrieve these values.

{{< /codetabs >}}

## What's next

- Migrate data from elsewhere [into {{% vendor/name %}}](/learn/tutorials/migrating/_index.md).
- Migrate to [another region](/projects/region-migration.md).
- To use data from an environment locally, export your data and set up your [local development environment](/development/local/_index.md).
