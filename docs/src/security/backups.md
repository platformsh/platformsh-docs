---
title: "Backup and restore"
description: |
  Backups vary by our offering and their retention is governed by our [data retention policy](./data-retention.md). This section details our Recovery Point Objective (RPO) and Recovery Time Objective (RTO) for our Professional, Enterprise, and Elite offerings.
---

{{% description %}}

## Professional and non-bundled Enterprise/Elite Grid plans

With Professional and non-bundled Enterprise/Elite Grid plans,
users can manage their own backup and restore functions.
See more details on how to [backup](../environments/backup.md) and [restore](../environments/restore.md).

**RPO**: User defined.
The RPO is configured by plan owners.

**RTO**: Variable.
Recovery time depends upon the size of the data being recovered.

## Bundled Enterprise/Elite Grid plans

**RPO**: 24 hours.
For bundled Enterprise/Elite Grid plans (such as G-XL and G-2XL),
Platform.sh takes a backup of environments every 24 hours.

**RTO**: Variable.
Recovery time depends upon the size of the data being recovered.

## Enterprise/Elite {{% names/dedicated-gen-2 %}}

**RPO**: 6 hours.
Platform.sh takes a backup of Enterprise/Elite {{% names/dedicated-gen-2 %}} environments every 6 hours.

**RTO**: Variable.
Recovery time depends upon the size of the data being recovered.
