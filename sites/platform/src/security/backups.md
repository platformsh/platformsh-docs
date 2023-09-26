---
title: "Backup and restore"
description: See backup policies and the recovery point objective (RPO) and recovery time objective (RTO) for various schedules.
---

{{% version/specific %}}
<!-- Platform.sh -->
The frequency of backups varies based on the [backup schedule](../environments/backup.md#backup-schedule).
Retention is governed by the [data retention policy](./data-retention.md).
This section details the recovery point objective (RPO) and recovery time objective (RTO) for each option.

## Preview environments

For preview environments, users can manage their own manual backup and restore functions.
See how to [back up](../environments/backup.md#create-a-manual-backup) and [restore](../environments/restore.md).

**RPO**: User defined.
The RPO is configured by plan owners.

**RTO**: Variable.
Recovery time depends on the size of the data being recovered.

## Basic and Advanced schedules

**RPO**: 24 hours.
Production environments on Basic and Advanced schedules are backed up every 24 hours.

**RTO**: Variable.
Recovery time depends on the size of the data being recovered.

## Premium schedule

**RPO**: 6 hours.
Production environments on a Premium schedule are backed up every 6 hours.

**RTO**: Variable.
Recovery time depends on the size of the data being recovered.

## Dedicated environments

**RPO**: 6 hours.
Dedicated environments are backed up every 6 hours.

**RTO**: Variable.
Recovery time depends on the size of the data being recovered.

<--->
<!-- Upsun -->
The following standard backup policy is applied to your projects and defines how many backups you can take advantage of.

**Production environments:**
- 1 automated backup per day, with a [2-day retention](/security/data-retention.md) (2 days worth of backups are retained at any given point).
  Automated backups are always [live](/environments/backup.md#live-backups).
- 2 manual backups maximum at any given point (the third manual backup replaces the oldest manual backup).

**Preview environments (development and staging):**
- No automated backups.
- 2 manual backups maximum at any given point (the third manual backup replaces the oldest manual backup).

Note that the number of backups is limited per [environment **type**](/glossary/_index.md#preview-environment) and not per project.
Therefore, a {{< vendor/name >}} project can have up to 6 backups at once (2 automated backups and 2 manual backups of the production environment,
plus 2 manual backups of any preview environments).

{{< note >}}

This policy applies during the closed beta phase of {{< vendor/name >}},
during which backups are provided free of charge.
In the future, you'll be able to customize your backup policy depending on your needs and budget.

{{< /note >}}
{{% /version/specific %}}
