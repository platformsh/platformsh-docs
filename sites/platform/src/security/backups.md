---
title: "Backup and restore"
description: |
    {{< version/specific >}}
    See backup policies and the recovery point objective (RPO) and recovery time objective (RTO) for various schedules.
    <--->
    See the recovery point objective (RPO) and recovery time objective (RTO) applied to your backups.
    {{< /version/specific >}}
---

{{< version/specific >}}

The frequency of backups varies based on the [backup schedule](../environments/backup.md#backup-schedule).
Retention is governed by the [data retention policy](./data-retention.md).
This section details the recovery point objective (RPO) and recovery time objective (RTO) for each option.

## Development environments

For non-Production environments, users can manage their own manual backup and restore functions.
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

The [frequency of backups](../environments/backup.md#backup-schedule) is the same for all your environments.
They are automatically backed up once a day.

The recovery point objective is therefore 24 hours,
while the recovery time objective depends on the size of the data being recovered.

Retention is governed by the [data retention policy](./data-retention.md).

{{< /version/specific >}}
