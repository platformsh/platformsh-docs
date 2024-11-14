---
title: "Overview"
weight: -20
sidebarTitle: "Overview"
layout: single
description:  "Our Dedicated environments are well-suited for those who need more resources and redundancy for their production environment, along with stricter isolation requirements."
---

{{% description %}}

When you create a project on Platform.sh, you can choose to deploy it using one of three types of architecture offerings: Professional, [Dedicated Generation 2](/dedicated-environments/dedicated-gen-2/_index.md) (DG2) or [Dedicated Generation 3](/dedicated-environments/dedicated-gen-3/_index.md) (DG3). 

## What is Dedicated?

DG2 and DG3 are classified as Dedicated environments (Dedicated). This is because your production environment is replicated across at least three virtual servers that are dedicated solely to your project.

In the diagram below, we can see that the Dedicated architecture provides three virtual servers that act as isolated hosts for a site in a failover configuration. Within each server, all the data of your site is synced. 

![The dedicated architecture](/images/dedicated/dedicated-architecture.svg "0.50")

Having three isolated hosts means that when one becomes unavailable, the others take over, so your site will always remain up and running. This differs from the Grid architecture, where a single host runs multiple projects from various customers simultaneously. 

From the Grid architecture diagram below, we can see that projects hosted in Grid share resources. The CPU, memory, and networking with other projects are all running on the same host. There is only one host that can be relied on in a failover configuration, and this host also holds the resources of various other sites. There is also a Ceph storage dependency.

![The grid architecture](/images/dedicated/grid-architecture.svg "0.50")

## Deployment

With a Dedicated environment, you are given the freedom to deploy into **any region of supported IaaS providers** (currently **AWS, Azure, GCP, OVH**). This differs from the Grid architecture, which is solely available in [public regions](https://platform.sh/regions/). 

For a full  list of public regions and IP addresses, visit the [Regions page](https://docs.platform.sh/development/regions.html#regions).

In a Grid region, incoming and outgoing traffic is handled via central region gateways, and [publicly available IP addresses](/development/regions.md#public-ip-addresses) can be used for external firewalls. The public IP addresses for these public regions are stable but not guaranteed never to change.

## Grid vs Dedicated

Whether you choose a Grid or Dedicated environment depends on the needs you have. In the table below, you can see the different ways in which either environment might work for you: 



| FEATURE | GRID | DEDICATED |
| --- | --- | --- |
| **Availability** | All support tiers | Just with Enterprise or Elite |
| **Uptime SLA** | 99.9% with Enterprise or Elite| 99.99% with Enterprise or Elite |
| **Infrastructure** | Containers with dedicated resources on top of a shared redundant infrastructure| Dedicated 3 node clusters|
| **Functioning** | A single container is deployed per runtime and per service| 3 nodes are running all applications and services are replicated across all of them |
| **Resource Allocation** | Resources are spread through one container with fixed sizes after deployment| Resources are deployed across 3 nodes
| **Usable regions** | Only the publicly available regions can be used | Any region can be used to deploy |
| **Autonomous upsize** | Yes | Managed through Platform.sh |
| **Upsize and downsize methods** | Redeploy - possible downtime depending on the hooks | No downtime - each instance is upsize in a rolling fashion |
| **Multi-app support** | Supported natively | Supported through docroots with additional billing |
| **Production branch** | Master or main branch | Dedicated production branch |
| **Custom domains name** | Supported on master and any other branches | Supported on the production environment |
| **Sync and merge functionalities** | Yes on all branches | Only on Development environments |
| **Environment clone** | Yes on all branches | Only on Development environments |
| **MySQL Replication** | None: standalone service container | Yes: 3 services nodes cluster |
| **Redis Replication** | None: standalone service container | Yes: 3 services nodes cluster |
| **MongoDB** | Standalone service container | Yes |
| **CDN** | Fastly for master or main and pre production | Fastly |
| **PHP version upgrade** | Autonomous | Autonomous |
| **NodeJS version upgrade**| Autonomous | Autonomous |
| **Routes management** | Autonomous | Autonomous |
| **Crons management** | Autonomous | Autonomous |
| **Crons tasks interrupted by deploys** | No: a running cron task will block a deployment until it is complete | Yes: a deploy will terminate a running cron task |
| **Mounts management** | Autonomous | Either autonomous or manual |
| **Workers management** | Autonomous | Managed by Platform.sh |
| **Storage increase** | Autonomous | Managed by Platform.sh |
| **Storage allocation between mounts, DB and services** | Autonomous | Managed by Platform.sh |



For more information about our Dedicated offerings, explore our [Dedicated Gen 2](/dedicated-environments/dedicated-gen-2) and [Dedicated Gen 3](/dedicated-environments/dedicated-gen-3) pages.