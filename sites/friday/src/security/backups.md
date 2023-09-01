---
title: "Backup and restore"
description: See the recovery point objective (RPO) and recovery time objective (RTO) applied to your backups.
---

The [frequency of backups](../environments/backup.md#backup-schedule) is the same for all your environments.
They are automatically backed up once a day.

The recovery point objective is therefore 24 hours,
while the recovery time objective depends on the size of the data being recovered.

Retention is governed by the [data retention policy](./data-retention.md).
