---
title: Back up an environment
description: See how to protect yourself from potential data loss by backing up your environments so they can be restored later.
weight: -10
---

When you're making changes to your apps,
you want to be sure those changes only improve things and don't make you lose any data.
You also want to have a disaster recovery plan in place.
Backups help you protect yourself against potential data loss.

You might want to create backups of your live environment before merging a different environment into it
or each time you increase the storage space of your services.

You also have regularly scheduled automated backups of your production environments to cover most cases.

Note that you can only create backups and restore active environments.
To work with an [inactive environment](/glossary.md#inactive-environment),
first activate it.

## How backup and restore works

1. As an [admin user](../administration/users.md), you can do a backup of your environment.
   This backup includes the complete data and code of the environment.
   All persistent data from all running [services](../add-services/_index.md)
   and any files stored on [mounts](/create-apps/app-reference/single-runtime-image.md#mounts) are included.
   The backup is stored internally on {{% vendor/name %}}.
   That is, the backup can be applied to environments on {{% vendor/name %}}, but it can't be downloaded.
   If you need to download backups, instead [export your mount and service data](/learn/tutorials/exporting.md)).

2. You restore your environment using the backup.
   At this point, the data and code from the backup are restored to ensure a consistent state.
   The latest code in your repository may have been modified such that it no longer works correctly with the old, restored data.

   {{< note theme="warning" title="Warning" >}}

   {{% vendor/name %}} does not modify your Git repository. Any further changes you make use the latest code in your repository.

   {{< /note >}}

3. Depending on your needs, you can do the following:

   a) To use the code from the time of the backup as a baseline for future changes,
      make sure you restore it yourself in your Git repository.
      To do so, use Git commands such as `revert`.

   b) To use your latest code instead, just redeploy your environment or push a new change.

{{% note %}}

You may not want the code from the backup to be restored at step 2.
For instance, if you have deleted containers since the backup, you may not want them to be restored with the backup.

In this case, you can opt out of restoring the code.
To do so, when you restore your backup, use the `--no-code` flag.

Also, see [how resource allocation works](/manage-resources/resource-init.html#backup-restoration) when you restore a backup.
{{% /note %}}

## Backups and downtime

By default, creating a manual backup causes a momentary pause in site availability so that all requests can complete.
This means the environment is backed up in a known consistent state.
The total interruption is usually only 15 to 30 seconds.
Any requests during that time are held temporarily, not dropped.

To avoid this downtime, use [live backups](#live-backups).

For consistent backups, create the backups during non-peak hours for your site.

## Data retention

### Manual backups

[Manual backups](../environments/backup.md#create-a-manual-backup) are retained until you delete them or replace them with another backup.

You can configure the maximum number of manual backups. Once that number is reached, any new manual backup automatically replaces the oldest backup.

### Automated backups

Automated backups are retained for 2 days when you use the [default backup policy](#default-backup-policy)
(meaning, 2 days worth of backups are retained at any given point).

When you [configure your own automated backup policy](#configure-a-backup-policy),
the retention time varies based on that configuration.

Automated backups are always [live](#live-backups).

## Backup policy

### Default backup policy

By default, {{< vendor/name >}} provides 1 automated backup a day for your production environment,
with a [2-day retention](/security/data-retention.md) (2 days worth of backups are retained at any given point).

You can [configure your own backup policy](#configure-a-backup-policy).
The default backup policy is equivalent to a custom backup policy using a `1d` interval and a count of `2` (see below).

### Configure a backup policy

{{< vendor/name >}} allows you to fully configure your own backup policy.
You can setup a different automated backup schedule per environment type (production, staging, and development environments).

On a given environment type, you can configure:

- The total number of backups (manual and automated)
- The total number of manual backups specifically
- Multiple schedules for automated backups

An automated backup schedule is composed of an interval and a count.</br>
The interval defines the frequency of the backups.
An interval can be a couple of hours, days, weeks, months, or years.
To configure an interval, use the following values:

- ``h`` for hour
- ``d`` for day
- ``w`` for week
- ``M`` for month
- ``y`` for year

The count defines the number of backups to retain.

### Configuration examples

To take a backup every day and keep up to 7 backups,
run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} project:curl settings -X PATCH \
   -d '{
       "data_retention": {
          "production": {
             "default_config": {
                "schedule": [
                  {"interval": "1d", "count": 7}, 
                 ]
              }
           }
        }
      }'
```

#### Configure multiple automated backup schedules

You can use multiple schedules to implement you own backup policy.
For instance, you may want to keep multiple recent backups and fewer older backups,
using a command similar to the following:

```bash {location="Terminal"}
{{% vendor/cli %}} project:curl settings -X PATCH \
   -d '{
       "data_retention": {
          "production": {
             "default_config": {
                "schedule": [
                  {"interval": "1d", "count": 7}, 
                  {"interval": "1w", "count": 4}, 
                  {"interval": "1M", "count": 12}
                 ]
              }
           }
        }
      }'
```

The command results in:

- A backup every day for 7 days
- A backup every week for 4 weeks
- A backup every month for 12 months

#### Set a limit for backups

To configure the maximum number of backups (automated and manual backups alike) on your production environment,
run a command similar to the following:

```bash {location="Terminal"}
{{% vendor/cli %}} project:curl /settings -X PATCH -d '{"data_retention": {"production": {"max_backups": 10}}}'
```

To configure the maximum number of manual backups on the production environment,
run a command similar to the following:

```bash {location="Terminal"}
{{% vendor/cli %}} project:curl /settings -X PATCH -d '{"data_retention": {"production": {"default_config":  {"manual_count": 1}}}}'
```

## Live backups

You can create backups without any downtime.
This means your environment is running and open to connections during the backup.

Because the connections may come in during backup creation, live backups may have data inconsistencies among containers.
They may make restorations less reliable.
To avoid such issues, schedule [manual backups](#create-a-manual-backup) during non-peak hours,
when the short amount of downtime is least noticed.

You can create a manual live backup on a Grid project:

{{< codetabs >}}
+++
title=Using the CLI
+++

Use the `--live` flag:

```bash
{{% vendor/cli %}} backup:create --live
```

<--->
+++
title=In the Console
+++

When [creating the backup](#create-a-manual-backup), select **Run live backup** in the last step.

{{< /codetabs >}}

## Create a manual backup

You can create a manual backup using the [CLI](../administration/cli/_index.md) or in the [Console](../administration/web/_index.md).

{{< codetabs >}}
+++
title=Using the CLI
highlight=bash
+++
{{% vendor/cli %}} backup:create
<--->
+++
title=In the Console
+++

1. Navigate to the environment you want to back up.
2. Click **Backups**.
3. Click {{< icon backup >}} **Backup**.
4. Click **Backup**.

{{< /codetabs >}}

See more information on [backup policies](#backup-policy) and [data retention](#data-retention).

### Automate manual backups

You can also automate the process of creating manual backups through [cron jobs](/create-apps/app-reference/single-runtime-image.md#crons).
The cron job uses the CLI command to back up the environment.
It requires you to [set up the CLI on the environment with an API token](../administration/cli/api-tokens.md#authenticate-in-an-environment).

Although this process is automated,
backups created in this way count as [manual backups](#manual-backups).
They don't affect the automated backups taken as part of [a schedule](#configure-a-backup-policy).

## Physical storage location

Backups are stored as binary large objects separate from your environments.
This storage is replicated over multiple data centers in different locations
[within the region your project is hosted in](https://platform.sh/trust-center/security/data-security/).
This means that in the rare event a data center becomes unavailable, your backups are still available.
