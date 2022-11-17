---
title: "Exporting data"
description: |
  Platform.sh aims to be a great host, but we never want to lock you in to our service. Your code and your data belong to you, and you should always be able to download your site's data for local development, backup, or to "take your data elsewhere".
---

{{% description %}}

## Downloading code

Your application's code is maintained in Git.
Because Git is a distributed system,
you can download your entire code history by running `git clone` or `platform get`.

## Downloading files

To download files from your built app,
you can [set up mounts](../create-apps/app-reference.md#mounts) 
and run commands using the Platform.sh CLI.
You can also use an SSH client such as `rsync` or `scp`.

For more information, see how to [transfer files to and from a built app](../development/file-transfer.md).

## Download data from services

The mechanism for downloading from each service (such as your database) varies.
For services designed to hold non-persistent information (such as Redis or Solr) it's generally not necessary to download data as it can be rebuilt from the primary data store.

To download data from persistent services ([MySQL](../add-services/mysql/_index.md), [PostgreSQL](../add-services/postgresql.md), [MongoDB](../add-services/mongodb.md), or [InfluxDB](../add-services/influxdb.md)), see each service's page for instructions.

## Get the environment variables

If your project uses some environment variable (tokens, ...) it can be helpful to backup them if you didn't store them separately.

As stated in the Console, several possibilities exist for the environment variables.

* Variables beginning with `env:` are exposed as Unix environment variables
* Variables beginning with `php:` are interpreted as `php.ini` directives.
* All other variables are part of the environment `PLATFORM_VARIABLES` variable

More details can be found [on the environment page](https://docs.platform.sh/administration/web/configure-environment.html#variables)

You can access the content of the environment variable through the Console unless the `--sensitive true` flag was set.

In that case, you can run:
`platform ssh -p <project id> -e <environment>`
to access all the environment variable values

and `platform ssh -p <project id> -e <environment> "echo \$PLATFORM_VARIABLES | base64 -d | jq"` to access the `PLATFORM_VARIABLES`'s values.

 
