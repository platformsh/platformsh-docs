---
title: "`disk`"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

Optional. Disk for application containers are not committed to YAML files, but instead managed over the API using either the
Console or the `{{% vendor/cli %}} resources:set` command.

For more information, see how to [manage resources](/manage-resources.md).

### Downsize a disk

It's a best practice to [back up your environment](/environments/backup.md) **before and after** you increase **or** decrease the `disk` value (the amount of allocated storage space) of an app or service.

You can decrease the size of an existing disk for an app. If you do so, be aware that:
- Downsizing fails if the amount of <!-- application? --> data exceeds the configured `disk` value. 
- Backups completed before the downsizing a disk are incompatible <!-- with what? --> and can no longer be used to restore applications. You need to [create new backups](/environments/backup.md).

