---
title: "Environment differences"
weight: 5
sidebarTitle: "Environment differences"
description: See the differences between your Production/Staging environments (which are Dedicated Gen 2) and your development environments (which are Grid environments).
---

With {{% names/dedicated-gen-2 %}} plans, your Production and Staging environments are on dedicated virtual machines, while your development environments run on the [Grid](/glossary.md#grid), meaning shared redundant infrastructure. This difference means a few configuration options and tools function differently in the different environments.

This is not the case with [{{% names/dedicated-gen-3 %}}](/dedicated-environments/dedicated-gen-3/_index.md) projects.

## Syncing data between environments

Because of the differences between {{% names/dedicated-gen-2 %}} and Grid Environments,
basic [syncs](/glossary.md#sync) and [merges](/glossary.md#merge) aren't available between development environments and production or staging environments. So you don't see working buttons with those options in the Console.

To transfer data between environments, backup your Production/Staging data and then synchronize Development data. See how to [back up and transfer data](../../development/transfer-dedicated.md#synchronize-files-from-development-to-stagingproduction).

## Backups

Production environments are [backed up automatically](/environments/backup.md#backup-schedule).
For other environments, trigger a [manual backup](../../environments/backup.md).

## PHP

### Extensions

The following table shows all of the extensions that are enabled by default in each PHP version.
To add any other extension with a pre-existing package in the Debian Apt repository,
open a [support ticket](/learn/overview/get-support).

{{< php-extensions/dedicated>}}

### Configuration options

{{< note >}}

Most {{% names/dedicated-gen-2 %}} projects allow you to use custom `php.ini` files on your production or staging environments. However, **for a small set of projects**, this isn't supported yet.

{{< /note >}}

If your project doesn't support PHP configuration through a `php.ini` file,
you can still change all PHP options that can be changed at runtime.
For example, change the memory limit using `ini_set('memory_limit','1024M');`.

For other PHP options, such as the following, [open a support ticket](/learn/overview/get-support.md):

* `max_execution_time`
* `max_input_time`
* `max_input_vars`
* `memory_limit`
* `post_max_size`
* `request_order`
* `upload_max_filesize`

### Xdebug

All {{% names/dedicated-gen-2 %}} clusters that have [Xdebug](../../languages/php/xdebug.md) enabled have a second PHP-FPM process. This second process is used only when requests include the correct Xdebug key in a header.

So you can keep Xdebug always on and not worry about performance issues as it's ignored on most requests.

**To obtain the Xdebug key:**

1. Open a [support ticket](/learn/overview/get-support).

{{< note >}}

Staging and Production environments have separate keys.

{{< /note >}}

2. Set that key in the Xdebug helper for your browser. Whenever you have Xdebug enabled, the request uses the alternate development PHP-FPM process with Xdebug.

## Solr

On Grid environments, [Solr](../../add-services/solr.md) runs as a standalone instance.
On {{% names/dedicated-gen-2 %}} Environments, it runs as [SolrCloud](https://solr.apache.org/guide/6_6/solrcloud.html): a cluster of Solr servers to ensure high availability. This shouldn't affect you most of the time, but may influence certain advanced use cases.

## Cron tasks interrupted by deploys

How [cron tasks](/create-apps/app-reference/single-runtime-image.md#crons) interact with deploys changes based on the environment.

On Grid environments, a running cron task blocks a deploy until the cron is complete.
On {{% names/dedicated-gen-2 %}} environments, a deploy terminates a running cron task.

Specifically, when a deploy to either Production or Staging begins,
any active cron tasks are sent a `SIGTERM` message so that they can terminate gracefully.
If they're still running 2 seconds later, a `SIGKILL` message is sent to forcibly terminate the process.

So it's best to ensure your cron tasks can receive a `SIGTERM` message and terminate gracefully.

## Configuration & change management

You can't manage some configuration settings via YAML configuration files on {{% names/dedicated-gen-2 %}} Environments.
In these cases, you need to open a [support ticket](/learn/overview/get-support).
You can have some settings different between staging and production environments.
It's assumed you want the settings the same, unless you state otherwise in the ticket.

The following settings require a [support ticket](/learn/overview/get-support):

* [Worker instances](/create-apps/app-reference/single-runtime-image.md#workers)
* [Service configuration](../../add-services/_index.md)
* Relationships among services and apps
* Plan upsizing
* Increasing storage
* Allocating storage among mounts and services
* [PHP extensions](../../languages/php/extensions.md)
* Web server configuration (the [`web.locations` section of your app configuration](/create-apps/app-reference/single-runtime-image.md#locations))

## Logs

{{% names/dedicated-gen-2 %}} Environments have a slightly different location for [container logs](../../increase-observability/logs/access-logs.md). The difference shouldn't be noticeable if you use the CLI.
