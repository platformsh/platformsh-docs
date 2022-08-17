---
title: "Backup and restore"
weight: 2
description: |
  Backups are triggered directly via the Console or via the CLI. The backup creates a complete snapshot of the environment's data. It includes all persistent data from all running services (MySQL, Solr,...) and any files stored on the mounted volumes. Please note that the snapshot is stored internally and cannot be downloaded.
---

{{% description %}}

Code is managed through Git and can be restored using normal Git routines.
The built code file system isn't affected by backups or restores.

{{< note title="Inactive environments" >}}

Only active environments can be backed up and restored.
To work with an [inactive environment](../other/glossary.md#inactive-environment),
first activate it.

{{< /note >}}

## Backups

You need to have the "admin" role in order to create a backup of an environment.

Backups on Platform.sh Professional are retained for at least 7 days.
They're purged between 7 days and 6 months, at Platform.sh's discretion.
See the [data retention page](/security/data-retention.md) for more information.

{{< note >}}

We advise you to make backups of your live environment before merging an environment to the live environment,
or each time you increase the storage space of your services.

{{< /note >}}

## Create a backup manually

You can create a manual backup using the [CLI](./cli/_index.md) or in the [Console](./web/_index.md).

{{< codetabs >}}
---
title=Using the CLI
file=none
highlight=bash
---

platform backup:create

<--->
---
title=In the Console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Navigate to the environment you want to back up.</li>
  <li>Click <strong>Backups</strong>.</li>
  <li>Click {{< icon backup >}} <strong>Backup</strong>.</li>
  <li>Click <strong>Backup</strong>.</li>
</ol>

{{< /codetabs >}}

Be aware that triggering a backup causes a momentary pause in site availability so that all requests can complete,
allowing the backup to be taken against a known consistent state.
The total interruption is usually only 15 to 30 seconds
and any requests during that time are held temporarily, not dropped.

To avoid this issue, create a [live backup](#live-backups).

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

You can create backups without any downtime.
This means your environment is running and open to connections during the backup.

Because the connections may come in during backup creation, live backups may have data inconsistencies among containers.
They may make restorations less reliable.
To avoid such issues, instead schedule [automated backups](#automated-backups) during non-peak hours,
when the short amount of downtime is least noticed.

Backups are automatically live on [Dedicated projects](../dedicated/overview/_index.md),
including [Dedicated Generation 3](../dedicated-gen-3/overview.md).

You can create a manual live backup on a Grid project:

{{< codetabs >}}
---
title=Using the CLI
file=none
highlight=false
---

Use the `--live` flag:

```bash
platform backup:create --live
```

<--->
---
title=In the Console
file=none
highlight=false
---

When [creating the backup](#create-a-backup-manually), select **Run live backup** in the last step.

{{< /codetabs >}}

{{% legacy-regions featureIntro="Live backups" featureShort="live backups" level=4 plural=true %}}

### Automated backups

Backups aren't triggered automatically on Platform.sh Professional plans. For Enterprise and Elite plans, see [backups](../dedicated/overview/backups.md).

Backups may be triggered by calling the CLI from an automated system such as Jenkins or another CI service,
or by installing the CLI tool into your application container and triggering the backup via cron.

#### Automated backups using Cron

{{< note >}}

Automated backups using cron requires you to [get an API token and install the CLI in your application container](./cli/api-tokens.md).

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

You can see the backup in the activity feed of your environment in the Platform.sh Console.
You can trigger the restore by clicking on the `restore` link.
You can also restore the backup to a different environment using the CLI.

You can list existing backups with the CLI as follows:

```bash
$ platform backups

Backups on the project Test app (<PROJECT_ID>), environment main (type: production):
+---------------------------+----------------------------+------------+
| Created                   | Backup ID                  | Restorable |
+---------------------------+----------------------------+------------+
| 2021-11-15T09:48:58+01:00 | 5ouvtgo4v75axijww7sqnftste | true       |
| 2021-12-09T14:17:17+01:00 | 7jks7dru5xpx5p5id5wtypur2y | true       |
| 2022-02-22T18:33:29+01:00 | f3jbyxlhtmalco67fmfoxs7n4m | true       |
+---------------------------+----------------------------+------------+
```

You can then restore a specific restorable backup with the CLI as follows:

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

Restoring a backup doesn't revert any code changes committed to git.
The next redeploy of the environment uses the current commit from git.

{{% legacy-regions featureIntro="Restoring backups to different environments" featureShort="to restore to different environments" %}}

You can also open a support ticket to ask that a backup be restored to a different environment for you.
Older regions may not appear in the Console in the same way that newer regions do.
You can check your project's region with the CLI command `platform project:info -p PROJECT_ID`.
