---
title: "{{% names/dedicated-gen-3 %}}"
weight: -19
layout: single
description: 
---

{{% names/dedicated-gen-3 %}} runs the same software as on the Grid, but on isolated hosts.
Each service is replicated across three hosts in a failover configuration.
If a host becomes unavailable, the other two take over so your site remains up.

{{% names/dedicated-gen-3 %}} was designed to cater to the needs of organizations that build demanding apps. 
Compared to the Grid, {{% names/dedicated-gen-3 %}} offers increased resources,
high availability for all your services and apps,
stricter isolation requirements,
as well as additional compliance frameworks.

To set up a {{% names/dedicated-gen-3 %}} project on [any supported cloud provider](../development/regions.md#regions),
[contact {{< vendor/name >}}](https://platform.sh/contact).
Note that existing Grid and {{% names/dedicated-gen-2 %}} projects can't be migrated to {{% names/dedicated-gen-3 %}} at this time.

## Highlights

Subscribing to {{% names/dedicated-gen-3 %}} allows you to take advantage
of [the following benefits](https://platform.sh/blog/the-ultimate-generation-of-our-dedicated-offering-is-here/):

- **Tremendous performance with a high availability of 99.99% SLA.**<BR>
  By default, a three-host cluster is associated with your default (production) environment.
  Upon request, you can have another one associated with your staging environment.

- **Greater self serviceability and control over your dedicated resources.**<BR>
  You don't need to submit a support ticket to add, configure,
  or remove your [apps](../create-apps/_index.md), [services](../add-services/_index.md) and [routes](../define-routes/_index.md).
  Just amend your [`.yaml` files](../overview/yaml/_index.md) and push your changes.

  As a {{% names/dedicated-gen-3 %}} user,
  you can take advantage of the [MariaDB Galera multi master cluster](https://mariadb.com/kb/en/galera-cluster/).
  You can also resize your disk yourself to share your disk space across your apps and services as you need.

- **Multi-app support.**<BR>
  {{% names/dedicated-gen-3 %}} is flexible and supports modern architectures, such as headless e-commerce.

- **Data synchronization from {{% names/dedicated-gen-3 %}} to Grid** through a single click from the Console.

- **Better compliance.**<BR>
  Your apps and configurations are fully independent from the machines they run on.
  This allows {{< vendor/name >}} to perform non-disruptive system upgrades to ensure you're always secure and compliant.

## Storage

Each {{% names/dedicated-gen-3 %}} cluster comes with 50GB of storage per environment by default.
This storage is intended for your data (databases, search indexes, user uploaded files, etc.)
and you can subdivide it as you want.

You can request more storage at any time.

## Differences with the Grid

If you upgrade from the Grid to {{% names/dedicated-gen-3 %}},
there are a few differences you need to be aware of.

### Available services

Not every service or version available on the Grid is available on {{% names/dedicated-gen-3 %}}.
The following table shows the currently available services and their versions for {{% names/dedicated-gen-3 %}}.

{{< gen-3-services >}}

Your app can connect to each service by referencing
the exact same [environment variables](../development/variables/_index.md) as for Grid environments.
See the [services documentation](../../add-services/_index.md) for service-specific details.

### Local mounts

{{% names/dedicated-gen-3 %}} provides a redundant infrastructure
and local mounts aren't shared between the three hosts.

If you need a folder to be shared between your hosts,
set up a [network storage mount](../add-services/network-storage.md).

## Differences with {{% names/dedicated-gen-2 %}} 

Just like {{% names/dedicated-gen-3 %}},
[{{% names/dedicated-gen-2 %}}](../../dedicated-gen-2/overview/_index.md) ensures increased uptime
and availability for your apps and services.
But as a {{% names/dedicated-gen-2 %}} user,
you have to go through the {{< vendor/name >}} Customer Success team to make configuration or application topology changes.

{{% names/dedicated-gen-3 %}} gives you both the high availability of {{% names/dedicated-gen-2 %}}
and the self-service flexibility and features of Grid projects.
As a {{% names/dedicated-gen-3 %}} user, you can edit your configuration yourself
and see those changes reflected in your environments on every push without opening a ticket.