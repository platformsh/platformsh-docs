---
title: Back up environments
description: See how to protect yourself from potential data loss by backing up your environments so they can be restored later.
weight: -10
---

When you're making changes your apps,
you want to be sure those changes only improve things and don't make you lose any data.
You also want to have a disaster recovery plan in place.
Backups help you protect yourself against potential data loss.

Backups represent a complete snapshot of an environment's data.
This includes all persistent data from all running [services](../add-services/_index.md)
and any files stored on [mounts](../create-apps/app-reference.md#mounts).
The snapshot is stored internally and can't be downloaded.
Code is managed through Git and so isn't included.
You can restore previous code using Git commands such as [revert](https://git-scm.com/docs/git-revert).

You might want to make backups of your live environment before merging a different environment into it.
or each time you increase the storage space of your services.

You also have regularly scheduled automated backups of your production environments to cover most cases.

You can only backup and restore active environments.
To work with an [inactive environment](../other/glossary.md#inactive-environment),
first activate it.

## Backups

To back up an environment, you need an [Admin role for that environment type](../administration/users.md).

### Backups and downtime

By default, triggering a backup causes a momentary pause in site availability so that all requests can complete.
This enables the backup to be taken against a known consistent state.
The total interruption is usually only 15 to 30 seconds
and any requests during that time are held temporarily, not dropped.

To avoid this issue, use [live backups](#live-backups).

To keep consistent backups, create the backups during non-peak hours for your site.

### Retention

For information on how long backups are retained, see the [data retention policy](../security/data-retention.md).

### Create a backup manually

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

- Navigate to the environment you want to back up.
- Click **Backups**.
- Click {{< icon backup >}} **Backup**.
- Click **Backup**.

{{< /codetabs >}}

### Live backups

You can create backups without any downtime.
This means your environment is running and open to connections during the backup.

Because the connections may come in during backup creation, live backups may have data inconsistencies among containers.
They may make restorations less reliable.
To avoid such issues, instead schedule [automated backups](#automated-backups) during non-peak hours,
when the short amount of downtime is least noticed.

Backups are automatically live on [{{% names/dedicated-gen-3 %}}](../dedicated-gen-3/overview.md)
and [{{% names/dedicated-gen-2 %}}](../dedicated-gen-2/overview/_index.md) projects.

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

For Dedicated environments, [backups are taken automatically](../dedicated-gen-2/overview/backups.md).
For Grid environments, automated backups are taken for Production environments.

You can trigger regular backups using the [CLI](../administration/cli/_index.md).
Call it from your CI process or using a cron job.

#### Automate backups with cron jobs

To automate the backup process in a cron job, follow these steps:

1. Create a [machine user](../administration/cli/api-tokens.md#create-a-machine-user).
2. Get an [API token for that user](../administration/cli/api-tokens.md#get-a-token).
3. Use the token to [authenticate and install the CLI in a build hook](../administration/cli/api-tokens.md#on-a-platformsh-environment).
4. Add a cron job to run once a day.
   The following example runs a backup operation every day at 05:00 UTC only on the production environment:

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

Some recommendations:

* To minimize data usage, don't schedule backups more than once per day.
* To skip any interaction, use the `--yes` flag.
* To prevent the cron job from blocking other tasks such as builds and deploys, use the `--no-wait` flag.
  
  Not using this flag means the cron job waits for the backup to complete,
  which may take a while depending on how much data you have.
  Passing the flag allows the cron job to end while the backup itself continues.

### Physical storage location

Backups are stored as binary large objects separate from your environments.
This storage is replicated over multiple data centers in different locations.
This means that in the rare event a data center becomes unavailable, your backups are still available.
