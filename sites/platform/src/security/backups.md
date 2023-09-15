---
title: "Backup and restore"
description: See backup policies and the recovery point objective (RPO) and recovery time objective (RTO) for various schedules.
---

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
