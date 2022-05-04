---
title: "Backup and restore"
description: |
  Backups vary by our offering and their retention is governed by our [data retention](/security/data-retention.md). This section details our Recovery Point Objective (RPO) and Recovery Time Objective (RTO) for our Platform.sh Professional and Platform.sh Enterprise offerings.
---

{{< description >}}

## Platform.sh Professional and Enterprise Grid (non-bundled plans)

With Platform.sh Professional and and Enterprise Grid (non-bundled plans), we have enabled our clients to manage their own backup and restore functions. Please see the [backup and restore](/administration/backup-and-restore.md) page for details.

**RPO**: User defined.The RPO is configured by our clients.

**RTO**: Variable. Recovery time will depend upon the size of the data we are recovering

## Platform.sh Enterprise Grid (bundled plans)

**RPO**: 24 hours. Platform.sh takes a backup of Platform.sh Enterprise Grid (bundled plans, e.g. G-XL, G-2XL) environments every 24 hours.

**RTO**: Variable. Recovery time will depend upon the size of the data we are recovering

## Platform.sh Enterprise Dedicated (Generation 2)

**RPO**: 6 hours. Platform.sh takes a backup of Platform.sh Enterprise Dedicated (Generation 2) environments every 6 hours.

**RTO**: Variable. Recovery time will depend upon the size of the data we are recovering
