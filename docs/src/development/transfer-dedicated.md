---
title: "Transfer data to and from a Dedicated cluster"
weight: 13
sidebarTitle: "Sync to Dedicated"
---

Transferring data to and from a Dedicated cluster slightly differs from the grid.
For advanced command line utilities, you might need granular SSH access to a specific host.

## Back up your files

Platform.sh automatically creates backups of the Staging and Production environments of a Dedicated cluster every six hours.
These are only useful to fully restore an environment and are managed by the support team.

You can make a manual, local, backup yourself by downloading data from your environment to your local system with:

```bash
platform scp --project=<PROJECT_ID> --environment=<ENVIRONMENT> -r remote:<DIRECTORY_TO_SYNCHRONIZE> <LOCAL_DIRECTORY>
```

That command copies all files from the `<DIRECTORY_TO_SYNCHRONIZE>` directory in the environment you want to backup to your `<LOCAL_DIRECTORY>`. Before running the command, make sure that you don't overwrite local data (or do a backup first).

For more options, run `platform help scp`.

## Back up your database

To backup your database, you need to adapt and run the following command on your local computer:

```bash
platform db:dump --gzip --project=<PROJECT_ID> --environment=<ENVIRONMENT> 
```

For more options, run `platform help db:dump` or see [database export](../add-services/_index.md#exporting-data).

## Synchronize files from Development to Staging/Production

To transfer data into either the Staging or Production environments,
you can download data from your Development environment to your local system and from there to your Production environment.

{{< note theme="warning" >}}

Be aware that synchronizing files is a destructive operation that overwrites data.
[Backup your files first](#back-up-your-files).

{{< /note >}}

1. To download data from your Development environment to your local system, adapt the following command:

```bash
   platform scp --project=<PROJECT_ID> --environment=<DEVELOPMENT_ENVIRONMENT> -r remote:<DIRECTORY_TO_SYNCHRONIZE> <LOCAL_DIRECTORY>
```

2. To copy the local directory to the remote Production mount:

```bash
   platform scp --project=<PROJECT_ID> --environment=<PRODUCTION_ENVIRONMENT> -r <LOCAL_DIRECTORY> remote:<DIRECTORY_TO_SYNCHRONIZE>
```

For more options, run `platform help scp`.

## Synchronize a database from Development to Staging/Production

To synchronize a database into either the Staging or Production environments,
you can export the database from your Development environment to your local system and from there to your Production environment.

{{< note theme="warning" >}}

Be aware that this is a destructive operation that overwrites data.
[Backup your Production database first](#back-up-your-database).

{{< /note >}}

To synchronize your database:

1. Export the Development database on your local computer:

   ```bash
   platform db:dump --project=<PROJECT_ID> --environment=<DEVELOPMENT_ENVIRONMENT> --file=dump.sql
   ```

   For more options, run `platform help db:dump` or see more on [database export](../add-services/_index.md#exporting-data).

2. Import the Development database dump file into the remote Staging/Production database:

   ```bash
   platform sql --project=<PROJECT_ID> --environment=<PRODUCTION_ENVIRONMENT> < dump.sql
   ```

## Get SSH access

You can access a specific environment of your project via SSH [using the CLI](../development/cli/_index.md):

```bash
platform ssh --project=<PROJECT_ID> --environment=<ENVIRONMENT>
```

For more granular connection options, run `platform help ssh` or [see SSH connection details](../development/ssh/_index.md#get-ssh-connection-details).

## Get the database details

For advanced used cases, you might want to get the database details manually.

To do so:

1. Access the specific environment you need with `platform ssh --project=<PROJECT_ID> --environment=<ENVIRONMENT>`. See more [about SSH](#get-ssh-access).
2. Retrieve the database details with the following command:

   ```bash
   echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
   ```

   Which gives a JSON output similar to:

   ```json
   "database" : [
         {
            "path" : "main",
            "service" : "mysqldb",
            "rel" : "mysql",
            "host" : "database.internal",
            "ip" : "246.0.80.64",
            "scheme" : "mysql",
            "cluster" : "jyu7wavyy6n6q-main-7rqtwti",
            "username" : "user",
            "password" : "",
            "query" : {
               "is_master" : true
            },
            "port" : 3306
      }
   ]
   ```

3. From the previous output, the following values are usually the most relevant ones:

   - `username`
   - `password` (not needed if empty)
   - `host`
   - `path`: the database name (`<DATABASE_NAME>` in the examples on this page)
