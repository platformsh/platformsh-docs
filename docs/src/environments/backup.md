---
title: Back up environments
description: See how to protect yourself from potential data loss by backing up your environments so they can be restored later.
weight: -10
---

When you're making changes to your apps,
you want to be sure those changes only improve things and don't make you lose any data.
You also want to have a disaster recovery plan in place.
Backups help you protect yourself against potential data loss.

Backups represent a complete snapshot of an environment's data.
This includes all persistent data from all running [services](../add-services/_index.md)
and any files stored on [mounts](../create-apps/app-reference.md#mounts).
The snapshot is stored internally and can't be downloaded.
Code is managed through Git and so isn't included.
You can restore previous code using Git commands such as [revert](https://git-scm.com/docs/git-revert).

You might want to make backups of your live environment before merging a different environment into it
or each time you increase the storage space of your services.

You also have regularly scheduled automated backups of your production environments to cover most cases.

You can only backup and restore active environments.
To work with an [inactive environment](../other/glossary.md#inactive-environment),
first activate it.

To back up an environment, you need an [Admin role for that environment type](../administration/users.md).

## Backups and downtime

By default, triggering a manual backup causes a momentary pause in site availability so that all requests can complete.
This means the environment is backed up in a known consistent state.
The total interruption is usually only 15 to 30 seconds.
Any requests during that time are held temporarily, not dropped.

To avoid this downtime, use [live backups](#live-backups).

For consistent backups, create the backups during non-peak hours for your site.

## Retention

For information on how long backups are retained, see the [data retention policy](../security/data-retention.md).

## Backup schedule

Backups for Dedicated environments have a [specific frequency](../dedicated-gen-2/overview/backups.md).

On Grid environments, non-Production environments can have up to 2 [manual backups](#create-a-manual-backup).
The number of available backups for Production environments depends on your schedule.

| Schedule  | Manual backups | Automated backups                |
| --------- | -------------- | -------------------------------- |
| Essential | 2              | 2: daily                         |
| Advanced  | 4              | 21: daily, weekly, and monthly   |
| Premium   | 4              | 44: 6-hourly, daily, and monthly |

The schedules available to you depend on your [tier](https://platform.sh/pricing/).

| Tier             | Default schedule  | Possible upgrade |
| ---------------- | ----------------- | ---------------- |
| Professional     | Essential         | Advanced         |
| Enterprise/Elite | Advanced          | Premium          |

An upgrade comes at an additional cost.
The exact cost depends on the size of your storage.

### Change your backup schedule

To upgrade to the higher schedule, follow these steps:

1. In the [Console](https://console.platform.sh/), navigate to the project where you want to change the schedule.
2. Click **{{< icon settings >}} Settings**.
3. Click **Edit plan**.
4. For **Backups**, click the name of your current schedule.
   If clicking has no effect, you are already on the highest available schedule.
5. Select the target schedule.
6. Click **Save**.

To downgrade to the lower schedule, [contact support](../overview/get-support.md).

## Use automated backups

For Dedicated environments, see more about [backups of Dedicated environments](../dedicated-gen-2/overview/backups.md).

For Grid environments, automated backups are taken for Production environments at least once every day.
The exact number of backups depends on your [backup schedule](#backup-schedule).

Automated backups are always [live](#live-backups).

{{% legacy-regions featureIntro="Live automated backups" featureShort="live automated backups" level=3 plural=true %}}

## Live backups

You can create backups without any downtime.
This means your environment is running and open to connections during the backup.

Because the connections may come in during backup creation, live backups may have data inconsistencies among containers.
They may make restorations less reliable.
To avoid such issues, schedule [manual backups](#create-a-manual-backup) during non-peak hours,
when the short amount of downtime is least noticed.

Automatic backups are always live, including those taken on [{{% names/dedicated-gen-3 %}}](../dedicated-gen-3/overview.md)
and [{{% names/dedicated-gen-2 %}}](../dedicated-gen-2/overview/_index.md) environments.

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

When [creating the backup](#create-a-manual-backup), select **Run live backup** in the last step.

{{< /codetabs >}}

{{% legacy-regions featureIntro="Live backups" featureShort="live backups" level=3 plural=true %}}

## Create a manual backup

You can create a manual backup using the [CLI](../administration/cli/_index.md) or in the [Console](../administration/web/_index.md).

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

1. Navigate to the environment you want to back up.
2. Click **Backups**.
3. Click {{< icon backup >}} **Backup**.
4. Click **Backup**.

{{< /codetabs >}}

## Physical storage location

Backups are stored as binary large objects separate from your environments.
This storage is replicated over multiple data centers in different locations.
This means that in the rare event a data center becomes unavailable, your backups are still available.
