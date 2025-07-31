---
title: "`disk`"
weight: 4
description: An `integer` (or `null`) that defines the disk space allocated (in MB) to an app.
---

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images. 

An `integer` (or `null`) that defines the disk space allocated (in MB) to an app.

The maximum total space available to all apps and services is set by the storage in your plan settings.
When deploying your project, the sum of all `disk` keys defined in app and service configurations
must be *equal or less* than the plan storage size.

So if your *plan storage size* is 5&nbsp;GB, you can, for example, assign it in one of the following ways:

- 2&nbsp;GB to your app, 3&nbsp;GB to your database
- 1&nbsp;GB to your app, 4&nbsp;GB to your database
- 1&nbsp;GB to your app, 1&nbsp;GB to your database, 3&nbsp;GB to your OpenSearch service

If you exceed the total space available, you receive an error on pushing your code.
You need to either increase your plan's storage or decrease the `disk` values you've assigned.

You configure the disk size in [MB](/glossary/_index.md#mb). Your actual available disk space is slightly smaller with some space used for formatting and the filesystem journal. When checking available space, note whether it’s reported in MB or MiB.

### Altering `disk` values

It's a best practice to [back up your environment](/environments/backup.md) **before and after** you increase **or** decrease the `disk` value (the amount of allocated storage space) of an app or service.

You can decrease the size of an existing disk for an app. If you do so, be aware that:
- Downsizing fails if the amount of <!-- application? --> data exceeds the configured `disk` value. 
- Backups completed before the downsizing a disk are incompatible <!-- with what? --> and can no longer be used to restore applications. You need to [create new backups](/environments/backup.md).
