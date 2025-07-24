---
title: "Dedicated Gen 3 Development"
weight: 1
sidebarTitle: "DG3 development"
layout: single
build:
  list: local
  render: always
description:  "Learn about the cluster infrastructure of Dedicated Generation 3, and discover key details about deployment, which regions are supported, storage limits, backups, restores and supported languages and frameworks."
---

{{< note theme="note" title="Limited access phase">}}

Dedicated Gen 3 is currently in a limited access phase. During this period, we are limiting new customers to ensure the platform meets our rigorous standards for performance and reliability.

If you need more information, have any questions, or you think you have the perfect use case for Dedicated Gen 3, please [contact](https://platform.sh/contact/) our team.

{{< /note >}}

Learn about the [cluster infrastructure](#cluster-infrastructure) of Dedicated Generation 3, and discover key details about [deployment](#deployment), which [regions](#providers-and-regions) are supported and [storage limits](#storage).

## Cluster infrastructure 

Clusters can be imagined as a mini-Grid region that has no [Ceph](/glossary/_index.md#ceph) dependency, so it can run anywhere. The cluster nodes function as entrypoint, coordinator, storage and host all in one. These clusters usually only contain a single branch while the remainder of the project remains on a Grid host. 

For more information about the Dedicated clusters, visit [Dedicated Gen 2 Development](/dedicated-environments/dedicated-gen-2/development.md#cluster-infrastructure).

![Dedicated cluster architecture](/images/dedicated/cluster-infrastructure.svg "0.50")

On a DG3 cluster, the services (MariaDB, PHP, Redis) run in Highly Available (HA) mode instead of as single, isolated applications. These clusters can be in either of your production or staging environments.

### HTTP clusters

With a HTTP connection, a cloud load balancer sits in front of the hosts and, if Fastly is enabled, Fastly sits in front of the cloud load balancer. Therefore, the web request flow looks like this:

![HTTP cluster architecture](/images/dedicated/http-cluster.svg "0.50")

### SSH clusters

On DG3, customers have direct access to the application containers. This connection is proxied through the Grid region and then to the DG3 cluster like in the diagram below:

![SSH cluster architecture](/images/dedicated/ssh-cluster.svg "0.50")

In the diagram, there are only 3 hosts. Host 1 has both the entry point and app container, and the same goes for hosts 2 and 3. Each service is run on 3 High availability containers spread across each of the 3 dedicated hosts.

## Deployment

On Grid, all project branches are deployed into that same Grid region. On DG3, this behaves the same but the projects deployed are Highly Available (HA), and branches set as default and (optionally) labelled staging are deployed into their own dedicated clusters instead.

While HA environments connected to a DG3 cluster **can** deploy multiple instances of applications and services, they **cannot** dynamically change the number of those instances (for example, from 1 to 3 or 3 to 1).

{{< note title="Note" theme="info" >}}

Existing non-HA projects cannot be converted to HA projects and vice-versa. HA projects must be created as HA.

{{< /note >}}

{{< note >}}

The `PLATFORM_CLUSTER` environment variable isn't yet available on {{% names/dedicated-gen-3 %}}. If your application depends on whether it's running on a {{% names/dedicated-gen-3 %}} host, use `PLATFORM_MODE`.

{{< /note >}}

## Providers and regions

Unlike Grid, you can deploy into [any region](/development/regions.md#regions) of supported IaaS providers with a Dedicated Generation 3 environment. Currently, these providers are listed below:

-   Amazon Web Services (AWS)
-   Microsoft Azure (Azure)
-   Google Cloud Platform (GCP)
-   OVHcloud (OVH) 

For more details on specific regions, consult the region [documentation](/development/regions.md#regions).

## Storage

Each cluster comes with 50GB of storage per environment by default. This storage is intended for your data (databases, search indexes, user uploaded files, etc.) and you can subdivide it as you want. Additional storage can be purchased and added to your cluster at any time.

## Backups

[Automated backups](environments/backup.md#use-automated-backups) are retained for a specific amount of time depending on their type and your [backup schedule](/environments/backup.md#backup-schedule). [Manual backups](/environments/backup.md#create-a-manual-backup) are retained until you delete them or replace them with another backup.

| Type           | Basic               | Advanced        | Premium    |
|----------------|---------------------|-----------------|------------|
| 6-hourly       | -                   | -               | 1 day      |
| Daily          | 2 days              | 1 week          | 1 month    |
| Weekly         | -                   | 4 weeks         | -          |
| Monthly        | -                   | 1 year          | 1 year     |

## Restores

Backups and restores are the same as Grid, so you can use them with the management console and the [Platform.sh CLI](/administration/cli/_index.md).

## Supported languages

Dedicated Generation 3 supports a wide range of languages to power your applications:

- **.NET Core** – Versions 6.0, 7.0, and 8.0 are supported.
- **Elixir**  – Versions 1.18, 1.15 and 1.14 are supported.
- **Java** – Versions 21, 19, 18, 17, 11 and 8 are supported.
- **JavaScript (Node.js)** – Versions 22, 20 and 18 are supported.
- **PHP** – Versions 8.4, 8.3, 8.2 and 8.1 are supported.
- **Python** – Versions 3.13, 3.12, 3.11, 3.10, 3.9 and 3.8 are supported.
- **Ruby** – Versions 3.3, 3.2, 3.1 and 3.0 are supported.
