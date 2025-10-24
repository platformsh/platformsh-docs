---
title: "Overview"
weight: -20
sidebarTitle: "Overview"
layout: single
description:  "Our Dedicated Environments are well-suited for those who need more resources and redundancy, along with stricter isolation requirements."
---

{{% description %}}

When you create an Upsun Fixed project, you can choose to deploy it using one of the following types of architecture offerings: Professional (known as [Grid](/glossary/_index.md#grid)) or [Dedicated Generation 2](/dedicated-environments/dedicated-gen-2/_index.md) (DG2). 

## What is Dedicated?

DG2 is classified as a Dedicated Environment (Dedicated). This is because your production environment is replicated across at least three virtual servers that are dedicated solely to your project.

In the diagram below, we can see that the Dedicated architecture provides three virtual servers that act as isolated hosts for a site in a failover configuration. Within each server, all the data of your site is synced.

![The dedicated architecture](/images/dedicated/dedicated-architecture.svg "0.50")

Having three isolated hosts means that when one becomes unavailable, the others take over, so your site will always remain up and running. This differs from the Grid architecture, where a single host runs multiple projects from various customers simultaneously. 

From the Grid architecture diagram below, we can see that projects hosted in Grid share resources. The CPU, memory, and networking with other projects are all running on the same host. There is only one host that can be relied on in a failover configuration, and this host also holds the resources of various other sites. There is also a [Ceph](/glossary/_index.md#ceph) storage dependency.

![The grid architecture](/images/dedicated/grid-architecture.svg "0.50")

## Deployment

With a Dedicated Environment, you are given the freedom to deploy into **any public region of supported IaaS providers** (currently **AWS, Azure, GCP, OVH**). This differs from the Grid architecture, which is solely available in [public regions](https://upsun.com/regions/).

For a full list of public regions and IP addresses, visit the [Regions page](/development/regions.md#regions).

In a Grid region, incoming and outgoing traffic is handled via central region gateways, and [publicly available IP addresses](/development/regions.md#public-ip-addresses) can be used for external firewalls. The public IP addresses for these public regions are stable but not guaranteed never to change.

## Grid vs Dedicated

Whether you choose a Grid or Dedicated Environment depends on the needs you have. In the table below, you can see the different ways in which either might work for you: 

| FEATURE | GRID | DEDICATED |
| --- | --- | --- |
| **Availability** | All support tiers | Just with [Enterprise or Elite](https://upsun.com/fixed-pricing/) |
| **Uptime SLA** | 99.9% (Advanced Uptime SLA) with [Enterprise or Elite](https://upsun.com/fixed-pricing/)| 99.99% (Premium Uptime SLA) with [Enterprise or Elite](https://upsun.com/fixed-pricing/) |
| **Infrastructure** | Containers with dedicated resources on top of a shared redundant infrastructure| Dedicated 3 node clusters|
| **Functioning** | A single container is deployed per runtime and per service| At least 3 nodes are running all applications and services are replicated across all of them |
| **Resource Allocation** | Resources are spread through one container with fixed sizes after deployment| Resources are deployed across a least 3 nodes
| **Usable regions** | Any public region can be used to deploy | Any public region of supported IaaS providers can be used to deploy |
| **Autonomous upsize** | Yes | Managed through Upsun Fixed |
| **Upsize and downsize methods** | Redeploy - possible downtime depending on the hooks | No downtime - each instance is altered in a rolling fashion |
| **Multi-app support** | Supported natively | Supported through docroots on Dedicated Gen 2 |
| **Custom domains name** | On all branches for Enterprise and Elite customers | On all branches for Enterprise and Elite customers |
| **Sync and merge functionalities** | Yes on all branches | Only on development environments on Dedicated Gen 2 |
| **Environment clone** | Yes on all branches | Only on development environments on Dedicated Gen 2 |
| **MySQL Replication** | None: standalone service container | Yes: at least 3 services nodes cluster that follow the leader-follower principle|
| **Redis Replication** | None: standalone service container | Yes: at least 3 services nodes cluster |
| **MongoDB** | Standalone service container | Yes |
| **CDN** | A managed Fastly CDN service can be purchased through Upsun Fixed | Fastly |
| **PHP version upgrade** | Self-service | Self-service |
| **NodeJS version upgrade**| Self-service | Self-service |
| **Routes management** | Self-service | Self-service |
| **Cron management** | Self-service | Self-service |
| **Cron tasks interrupted by deploys** | No: a running Cron task will block a deployment until it is complete | Yes: a deploy will terminate a running Cron task |
| **Mounts management** | Self-service | Self-service |
| **Workers management** | Self-service | Managed by Upsun Fixed |
| **Storage increase** | Self-service | Managed by Upsun Fixed |
| **Storage allocation between mounts, DB and services** | Self-service | Managed by Upsun Fixed on Dedicated Gen 2 |



For more information about our Dedicated offering, explore our [Dedicated Gen 2](/dedicated-environments/dedicated-gen-2/_index.md) page.
