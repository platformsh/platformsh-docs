---
title: Change the project timezone
description: See how to change the timezone for a project and what it affects.
---

The project timezone affects [automated backups](../environments/backup.md).

The project timezone doesn't affect:

- [App runtime](/create-apps/timezone.md).
- [Cron jobs](/create-apps/app-reference/single-runtime-image.md#crons).
- [System logs](/increase-observability/logs/_index.md). UTC is the default timezone for all logs.

To change the timezone for a project, follow these steps:

1. Open the project where you want to change the timezone.
2. Click {{< icon settings >}} **Settings**.
3. Select the timezone from the list.
4. Click **Save**.
