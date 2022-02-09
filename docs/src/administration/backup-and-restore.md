---
title: "Backup and restore"
weight: 2
description: |
  Backups are triggered directly via the management console or via the CLI. The backup creates a complete snapshot of the environment's data. It includes all persistent data from all running services (MySQL, Solr,...) and any files stored on the mounted volumes. Please note that the snapshot is stored internally and cannot be downloaded.
---

{{< description >}}

Code is managed through Git and can be restored using normal Git routines.
The built code file system isn't affected by backups or restores.

## Backups

You need to have the "admin" role in order to create a backup of an environment.

Backups on Platform.sh Professional are retained for at least 7 days.
They're purged between 7 days and 6 months, at Platform.sh's discretion.
See the [data retention page](/security/data-retention.md) for more information.

{{< note >}}

We advise you to make backups of your live environment before merging an environment to the live environment,
or each time you increase the storage space of your services.

{{< /note >}}

Using the CLI:

```bash
$ platform backup:create
```

Be aware that triggering a backup causes a momentary pause in site availability so that all requests can complete,
allowing the backup to be taken against a known consistent state.
The total interruption is usually only 15 to 30 seconds
and any requests during that time are held temporarily, not dropped.

### Backups and downtime

A backup does cause a momentary pause in service.
We recommend running during non-peak hours for your site.

### Retention

See the [data retention page](/security/data-retention.md).

### Physical storage location

Backups are stored on Binary Large OBject (BLOB) storage separate from your cluster
(for example, projects on an AWS backed region are stored on S3).
Blob storage is replicated over multiple data centers on different locations.
This means that in the rare event of data center unavailability, backups are still available. 
	
In such an event, Platform.sh moves all projects to another data center.
Disaster recovery backups are also stored on BLOB storage and replicated over multiple data centers.
You should still schedule regular backups stored in multiple locations and/or locally alongside this process.

### Live backups

There is an option available to create backups in a "live" state.
This flavor leaves the environment running and open to connections, reducing downtime while the backup is taken.
With live backups, however, there can be inconsistent states that make restorations less reliable.
For this reason Platform.sh recommends instead scheduling [automated backups](#automated-backups) during non-peak hours,
when the short amount of downtime is least noticed. 

You can trigger a live backup through the CLI using the `--live` flag:

```bash
$ platform backup:create --live
```

### Automated backups

Backups aren't triggered automatically on Platform.sh Professional.

Backups may be triggered by calling the CLI from an automated system such as Jenkins or another CI service,
or by installing the CLI tool into your application container and triggering the backup via cron.

#### Automated backups using Cron

{{< note >}}

Automated backups using cron requires you to [get an API token and install the CLI in your application container](/development/cli/api-tokens.md).

{{< /note >}}

We ask that you not schedule a backup task more than once a day to minimize data usage.

Once the CLI is installed in your application container and an API token configured,
you can add a cron task to run once a day and trigger a backup.
The CLI reads the existing environment variables in the container and default to the project and environment it's running on.
In most cases, such backups are only useful on the production environment.

A common cron specification for a daily backup on the production environment looks like this:

```yaml
crons:
    backup:
        spec: '0 5 * * *'
        commands:
            start: |
                if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
                    platform backup:create --yes --no-wait
                fi
```

The above cron task runs once a day at 5 am (UTC),
and, if the current environment is the production environment, it runs `platform backup:create` on the current project and environment
The `--yes` flag skips any user-interaction.
The `--no-wait` flag causes the command to complete immediately rather than waiting for the backup to complete.

{{< note >}}

It is very important to include the `--no-wait` flag.
If you don't, the cron process blocks
and you are unable to deploy new versions of the site until the backup creation process is complete.
{{< /note >}}

## Restore

You can see the backup in the activity feed of your environment in the Platform.sh management console.
You can trigger the restore by clicking on the `restore` link.
You can also restore the backup to a different environment using the CLI.

You can list existing backups with the CLI as follows:

```bash
$ platform backups

Finding backups for the environment main
+---------------------+------------+----------------------+
| Created             | % Complete | Backup name          |
+---------------------+------------+----------------------+
| 2015-06-19 17:11:42 | 100        | 2ca4d90639f706283fee |
| 2015-05-28 15:05:42 | 100        | 1a1fbcb9943849706ee6 |
| 2015-05-21 14:38:40 | 100        | 7dbdcdb16f41f9e1c061 |
| 2015-05-20 15:29:58 | 100        | 4997900d2804d5b2fc39 |
| 2015-05-20 13:31:57 | 100        | c1f2c976263bec03a10e |
| 2015-05-19 14:51:18 | 100        | 71051a8fe6ef78bca0eb |
```

{{< note >}}

The list of backups retrieved from the API, and therefore from the CLI and management console,
represents a list of recent completed backup *activities*, rather than a list of those available for restoration.
In most cases when creating regular backups the list should match up as expected,
but depending on their age some backups may no longer be available as per the [data retention policy](https://docs.platform.sh/administration/backup-and-restore.html#restore).
As a rule, backup often and use the most recent in your restores.

Using the Platform.sh CLI and [`jq`](https://stedolan.github.io/jq/manual/),
you can filter the list of backups returned for a particular environment to those that are actually `restorable`.

```bash
platform project:curl -p <PROJECT_ID> /environments/<ENVIRONMENT_ID>/backups | jq '.[] | select((.restorable=true) and (.safe=true) and (.status="CREATED")) | {id, created_at}'
{
  "id": "mmzqoffpcpxnmy6zas55jjjdaq",
  "created_at": "2021-11-12T19:30:07.680746+00:00"
}
{
  "id": "pkxj46necupbzw627bmoeciz4q",
  "created_at": "2021-11-12T19:25:39.895401+00:00"
}
```

{{< /note >}}

You can then restore a specific backup with the CLI as follows:

```bash
$ platform backup:restore 2ca4d90639f706283fee
```

Or even restore the backup to a different branch with the CLI as follows:

```bash
$ platform backup:restore --target=RESTORE_BRANCH 2ca4d90639f706283fee
```

For this to work, it's important to act on the active branch on which the backup was taken.
Restoring a backup from `develop` when working on the `staging` branch is impossible.
Switch to the acting branch and set your `--target` as above snippet mentions.

If no branch already exists,
you can specify the parent of the branch that is created to restore your backup to as follows:

```bash
$ platform backup:restore --branch-from=PARENT_BRANCH 2ca4d90639f706283fee
```

{{< note >}}
You need "admin" role to restore your environment from a backup.
{{< /note >}}

Be aware that the older US and EU regions don't support restoring backups to different environments.
If your project is on one of the older regions (`us` or `eu`, without a number suffix),
you may file a support ticket to ask that a backup be restored to a different environment for you,
or [migrate your project](/guides/general/region-migration.md) to one of the new regions that supports this feature.
Older regions may not appear in the management console in the same way that newer regions to,
so to verify if this caveat applies to you,
you can check your project's region with the CLI command `platform project:info -p PROJECT_ID`. 

{{< note >}}

Restoring a backup doesn't revert any code changes committed to git.
The next redeploy of the environment uses the current commit from git.

{{< /note >}}
