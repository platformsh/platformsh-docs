---
title: "Backup and restore"
description: See backup policies and the recovery point objective (RPO) and recovery time objective (RTO) for various schedules.
---

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

This policy applies during the beta phase of {{< vendor/name >}},
during which backups are provided free of charge.
In the future, you'll be able to customize your backup policy depending on your needs and budget.

{{< /note >}}

