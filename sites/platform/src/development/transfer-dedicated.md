---
title: "Transfer data to and from a {{% names/dedicated-gen-2 %}} cluster"
weight: 13
sidebarTitle: "Sync to {{% names/dedicated-gen-2 %}}"
---

Transferring data to and from [a {{% names/dedicated-gen-2 %}} cluster](/glossary.md#dedicated-gen-2) slightly differs from the process on the Grid.

## Back up your files

{{% vendor/name %}} automatically creates backups of the Staging and Production environments of a {{% names/dedicated-gen-2 %}}  cluster every six hours.
These are only useful to fully restore an environment and are managed by the support team.

You can make a manual local backup yourself by downloading data from your environment to your local system by running the following command:

```bash
{{% vendor/cli %}} scp -r remote:{{< variable "DIRECTORY_TO_SYNCHRONIZE" >}} {{< variable "LOCAL_DIRECTORY" >}}
```

This command copies all files from the `{{< variable "DIRECTORY_TO_SYNCHRONIZE" >}}` in the environment you want to back up
to your `{{< variable "LOCAL_DIRECTORY" >}}`.
Before running the command, make sure that you don't overwrite local data (or do a backup first).

## Back up your database

To back up your database, adapt and run the following command on your local computer:

```bash
{{% vendor/cli %}} db:dump --gzip 
```

For more backup options and examples, see how to [export data from an SQL database](../add-services/mysql/_index.md#exporting-data).

## Synchronize files from Development to Staging/Production

To transfer data into either the Staging or Production environment,
download data from your Development environment to your local system and from there to your Production/Staging environment.

{{< note theme="warning" >}}

Be aware that synchronizing files is a destructive operation that overwrites data.
[Back up your Staging/Production files first](#back-up-your-files).

{{< /note >}}

1. To download data from your Development environment to your local system, adapt the following command:

   ```bash
   {{% vendor/cli %}} scp --environment {{< variable "DEVELOPMENT_ENVIRONMENT" >}} -r remote:{{< variable "DIRECTORY_TO_SYNCHRONIZE" >}} {{< variable "LOCAL_DIRECTORY" >}}
   ```

2. To copy the local directory to the remote Staging/Production mount, adapt the following command:

   ```bash
   {{% vendor/cli %}} scp --environment {{< variable "TARGET_ENVIRONMENT" >}} -r {{< variable "LOCAL_DIRECTORY" >}} remote:{{< variable "DIRECTORY_TO_SYNCHRONIZE" >}}
   ```

## Synchronize a database from Development to Staging/Production

To synchronize a database into either the Staging or Production environment,
export the database from your Development environment to your local system and from there to your Staging/Production environment.

{{< note theme="warning" >}}

Be aware that this is a destructive operation that overwrites data.
[Back up your Staging/Production database first](#back-up-your-database).

{{< /note >}}

To synchronize your database:

1. Export the Development database to your local computer:

   ```bash
   {{% vendor/cli %}} db:dump --environment {{< variable "DEVELOPMENT_ENVIRONMENT" >}} --file=dump.sql
   ```

   For more backup options and examples, see how to [export data from an SQL database](../add-services/mysql/_index.md#exporting-data).

2. Import the Development database dump file into the remote Staging/Production database:

   ```bash
   {{% vendor/cli %}} sql --environment {{< variable "TARGET_ENVIRONMENT" >}} < dump.sql
   ```


## What's next?

For more granular connection options, see [SSH connection details](../development/ssh/_index.md#get-ssh-connection-details).
