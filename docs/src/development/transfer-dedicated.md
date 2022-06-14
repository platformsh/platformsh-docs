---
title: "Transfer data to and from a Dedicated cluster"
weight: 13
sidebarTitle: "Sync to Dedicated"
---

Transferring data to and from a Dedicated cluster slightly differs from the grid.

## Back up your files

Platform.sh automatically creates backups of the Staging and Production environments of a Dedicated cluster every six hours.
These are only useful to fully restore an environment and are managed by the support team.

You can make a manual local backup yourself by downloading data from your environment to your local system by running the following command:

```bash
platform scp --project <PROJECT_ID> --environment <ENVIRONMENT> -r remote:<DIRECTORY_TO_SYNCHRONIZE> <LOCAL_DIRECTORY>
```

This command copies all files from the `<DIRECTORY_TO_SYNCHRONIZE>` in the environment you want to backup
to your `<LOCAL_DIRECTORY>`.
Before running the command, make sure that you don't overwrite local data (or do a backup first).

## Back up your database

To backup your database, adapt and run the following command on your local computer:

```bash
platform db:dump --gzip --project <PROJECT_ID> --environment <ENVIRONMENT> 
```

For more backup options and examples, see [MariaDB/MySQL](../add-services/mysql/_index.md#exporting-data).

## Synchronize files from Development to Staging/Production

To transfer data into either the Staging or Production environments,
download data from your Development environment to your local system and from there to your Production environment.

{{< note theme="warning" >}}

Be aware that synchronizing files is a destructive operation that overwrites data.
[Backup your Staging/Production files first](#back-up-your-files).

{{< /note >}}

1. To download data from your Development environment to your local system, adapt the following command:

   ```bash
   platform scp --project <PROJECT_ID> --environment <DEVELOPMENT_ENVIRONMENT> -r remote:<DIRECTORY_TO_SYNCHRONIZE> <LOCAL_DIRECTORY>
   ```

2. To copy the local directory to the remote Production mount, adapt the following command:

   ```bash
   platform scp --project <PROJECT_ID> --environment <PRODUCTION_ENVIRONMENT> -r <LOCAL_DIRECTORY> remote:<DIRECTORY_TO_SYNCHRONIZE>
   ```

## Synchronize a database from Development to Staging/Production

To synchronize a database into either the Staging or Production environments,
export the database from your Development environment to your local system and from there to your Production environment.

{{< note theme="warning" >}}

Be aware that this is a destructive operation that overwrites data.
[Backup your Staging/Production database first](#back-up-your-database).

{{< /note >}}

To synchronize your database:

1. Export the Development database on your local computer:

   ```bash
   platform db:dump --project <PROJECT_ID> --environment <DEVELOPMENT_ENVIRONMENT> --file=dump.sql
   ```

   For more backup options and examples, see [MariaDB/MySQL](../add-services/mysql/_index.md#exporting-data).

2. Import the Development database dump file into the remote Staging/Production database:

   ```bash
   platform sql --project <PROJECT_ID> --environment <PRODUCTION_ENVIRONMENT> < dump.sql
   ```


## What's next?

For more granular connection options, [see SSH connection details](../development/ssh/_index.md#get-ssh-connection-details).
