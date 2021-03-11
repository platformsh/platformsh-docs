---
title: "Backup and restore"
weight: 2
description: |
  Backups are triggered directly via the management console or via the CLI. The backup creates a complete snapshot of the environment's data. It includes all persistent data from all running services (MySQL, Solr,...) and any files stored on the mounted volumes.
---

{{< description >}}

Code is managed through Git and can be restored using normal Git routines. The built code file system is not affected by backups or restores.

## Backups

You need to have the "admin" role in order to create a backup of an environment.

Backups on Platform.sh Professional are retained for at least 7 days. They will be purged between 7 days and 6 months, at Platform.sh's discretion. Please see the [data retention](/security/data-retention.md) page for more information.

{{< note >}}
We advise you to make backups of your live environment before merging an environment to the live environment, or each time you increase the storage space of your services.
{{< /note >}}

Using the CLI:

```bash
$ platform backup:create
```

Please be aware that triggering a backup will cause a momentary pause in site availability so that all requests can complete, allowing the backup to be taken against a known consistent state.  The total interruption is usually only 15 to 30 seconds and any requests during that time are held temporarily, not dropped.

## Restore

You will see the backup in the activity feed of your environment in the Platform.sh management console. You can trigger the restore by clicking on the `restore` link. You can also restore the backup to a different environment using the CLI.

You can list existing backups with the CLI as follows:

```bash
$ platform backups

Finding backups for the environment master
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
The list of backups retrieved from the API, and therefore from the CLI and management console, represents a list of recent completed backup *activities*, rather than a list of those available for restoration. In most cases when creating regular backups the list should match up as expected, but depending on their age some backups may no longer be available as per our [data retention policy](https://docs.platform.sh/administration/backup-and-restore.html#restore). As a rule, backup often and use the most recent in your restores.
{{< /note >}}

You can then restore a specific backup with the CLI as follows:

```bash
$ platform backup:restore 2ca4d90639f706283fee
```

Or even restore the backup to a different branch with the CLI as follows:

```bash
$ platform backup:restore --target=RESTORE_BRANCH 2ca4d90639f706283fee
```

For this to work, it's important to act on the active branch on which the backup was taken. Restoring a backup from `develop` when working on the `staging` branch is impossible. Switch to the acting branch and set your `--target` as above snippet mentions.

If no branch already exists, you can specify the parent of the branch that will be created to restore your backup to as follows:

```bash
$ platform backup:restore --branch-from=PARENT_BRANCH 2ca4d90639f706283fee
```

{{< note >}}
You need "admin" role to restore your environment from a backup.
{{< /note >}}

Be aware that the older US and EU regions do not support restoring backups to different environments.  If your project is on one of the older regions you may file a support ticket to ask that a backup be restored to a different environment for you, or [migrate your project](/guides/general/region-migration.md) to one of the new regions that supports this feature.


{{< note >}}
Restoring a snapshot does not revert any code changes committed to git. The next redeploy of the environment will use the current commit from git.
{{< /note >}}

## Backups and downtime

A backup does cause a momentary pause in service. We recommend running during non-peak hours for your site.

## Automated backups

Backups are not triggered automatically on Platform.sh Professional.

Backups may be triggered by calling the CLI from an automated system such as Jenkins or another CI service, or by installing the CLI tool into your application container and triggering the backup via cron.

### Automated backups using Cron

{{< note >}}
Automated backups using cron requires you to [get an API token and install the CLI in your application container](/development/cli/api-tokens.md).
{{< /note >}}

We ask that you not schedule a backup task more than once a day to minimize data usage.

Once the CLI is installed in your application container and an API token configured you can add a cron task to run once a day and trigger a backup.  The CLI will read the existing environment variables in the container and default to the project and environment it is running on. In most cases such backups are only useful on the `master` production environment.

A common cron specification for a daily backup on the `master` environment looks like this:

```yaml
crons:
    backup:
        spec: '0 5 * * *'
        cmd: |
            if [ "$PLATFORM_BRANCH" = master ]; then
                platform backup:create --yes --no-wait
            fi
```

(If you have [renamed the default branch](/guides/general/default-branch.md) from `master` to something else, modify the above example accordingly.)

The above cron task will run once a day at 5 am (UTC), and, if the current environment is the master branch, it will run `platform backup:create` on the current project and environment.  The `--yes` flag will skip any user-interaction.  The `--no-wait` flag will cause the command to complete immediately rather than waiting for the backup to complete.

{{< note >}}
It is very important to include the `--no-wait` flag.  If you do not, the cron process will block and you will be unable to deploy new versions of the site until the backup creation process is complete.
{{< /note >}}

### Retention

Please see our [Data Retention Page](/security/data-retention.md).


### Physical storage location

Backups are stored on Binary Large OBject (BLOB) storage separate from your cluster (for an AWS backed region, this is S3).

Blob storage is replicated over multiple datacenters on different locations.
In the rare event, were an entire datacenter is destroyed, unavailable, ... backups should still be available.

Do keep in mind that in such a rare event. _We_ will be using our own disaster recovery backups to move all projects to another datacenter. 
The disaster recovery backups are also stored on blob storage. This means they are also replicated over multiple datacenters.

This being said, as a general word of advice it's common (and good) practise to have backups at several locations but also locally on your own machine.
