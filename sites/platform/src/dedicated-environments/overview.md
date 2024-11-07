---
title: "Overview"
weight: -20
sidebarTitle: "Overview"
layout: single
description:  "Our Dedicated environments are well-suited for those who need more resources and redundancy for their production environment, along with stricter isolation requirements."
---

{{% description %}}

When you create a project on Platform, you can choose to deploy it using one of three types of architecture offerings: Grid, [Dedicated Generation 2](/dedicated-environments/dedicated-gen-2/overview.md) (DG2) or [Dedicated Generation 3](/dedicated-environments/dedicated-gen-3/overview.md) (DG3). 

## What is Dedicated?

DG2 and DG3 are classified as Dedicated environments (Dedicated). This is because your production environment is replicated across at least three virtual servers that are dedicated solely to your project.

In the diagram below, we can see that the Dedicated architecture provides three virtual servers that act as isolated hosts for a site in a failover configuration. Within each server, all the data of your site is synced. 

![The dedicated architecture](/images/dedicated/dedicated-architecture.svg "0.50")

Having three isolated hosts means that when one becomes unavailable, the others take over, so your site will always remain up and running. This differs from the Grid architecture, where a single host runs multiple projects from various customers simultaneously. 

From the Grid architecture diagram below, we can see that projects hosted in Grid share resources. The CPU, memory, and networking with other projects are all running on the same host. 

![The grid architecture](/images/dedicated/grid-architecture.svg "0.50")

## Deployment

With a Dedicated environment, you are given the freedom to deploy into **any region of supported IaaS providers** (currently **AWS, Azure, GCP, OVH**). This differs from the Grid architecture, which is solely available in [public regions](https://platform.sh/regions/). 

For a full  list of public regions and IP addresses, visit the [Regions page](https://docs.platform.sh/development/regions.html#regions).

In a Grid region, incoming and outgoing traffic is handled via central region gateways, and [publicly available IP addresses](https://docs.platform.sh/development/regions.html#public-ip-addresses) can be used for external firewalls. The public IP addresses for these public regions are stable but not guaranteed never to change.

## **Grid vs Dedicated** 

Whether you choose a Grid or Dedicated environment depends on the needs you have. In the table below, you can see the different ways in which either environment might work for you: 

| FEATURE | GRID | DEDICATED |
| --- | --- | --- |
| SLA | 99.9% | 99.99% |
| Infrastructure | Containers with dedicated resources on top of a shared redundant infrastructure | Dedicated 3 node clusters |
| Functioning | A single container is deployed per runtimes and per services | 3 nodes are running all applications and services and are replicated |
| Resources allocation | Resources are spread through the container with fixed sizes after deploy | Resources deployed on 3 nodes |
| Usable regions | Only the publicly available | Any region needed (as long as we can deploy on it) |
| Autonomous upsize | Yes | Managed through PSH - Done upon ticket |
| Upsize / Downsize methods | Redeploy - Possible downtime depending on the hooks | No downtime - each instance is upsize in a rolling fashion |
| Multi-app support (PWA) | Supported natively. | Supported through docroots (additional billing) |
| Production branch | Master/Main branch | Dedicated production branch |
| Custom domains name | Supported on master and any other branches | Supported on the production environment |
| Sync and Merge functionalities | Yes on all branches | Only on dev environments |
| Automated backup | Yes - Managed by PSH | Yes - Managed by PSH |
| On-demand backup | 5 | Not supported |
| Environment clone | Yes on all branches | Only on dev environments |
| Source Operations | Yes | Yes |
| MySQL Replication | None: standalone service container | Yes: 3 services nodes cluster |
| Redis Replication | None: standalone service container | Yes: 3 services nodes cluster |
| MongoDB | Standalone service container | Yes |
| CDN | Fastly for master/main and pre production | Fastly |
| PHP version upgrade | Autonomous: dev team changes it in .platform.app.yaml file | Autonomous: dev team changes it in .platform.app.yaml file (if auto_config : true) |
| NodeJS version upgrade | Autonomous: dev team changes it in .platform.app.yaml file | Autonomous: dev team changes it in .platform.app.yaml file |
| Services : Add, remove, upgrade | Autonomous: dev team changes it in .platform.app.yaml file | Managed by PSH - Done upon ticket |
| Relationships : Add, remove, update | Autonomous: dev team changes it in .platform.app.yaml file | Managed by PSH - Done upon ticket |
| Routes management | Autonomous: dev team changes them in routes.yaml file | Autonomous: dev team changes them in routes.yaml file |
| Crons management | Autonomous: dev team changes the configuration in .platform.app.yaml | Autonomous: dev team changes the configuration in .platform.app.yaml |
| Crons tasks interrupted by deploys | No: a running cron task will block a deployment until it is complete | Yes: a deploy will terminate a running cron task |
| Mounts management | Autonomous: dev team changes it in .platform.app.yaml file | Either autonomous: your dev team would change it in .platform.app.yaml file or manual: by PSH team if the mounts are local one |
| Workers management | Autonomous: dev team changes it in .platform.app.yaml file | Managed by PSH - Done upon ticket |
| Web server internal config : locations | Autonomous: dev team changes it in .platform.app.yaml file | Autonomous: dev team changes it in .platform.app.yaml file |
| Web server internal config : domains | Autonomous: dev team changes it in .platform.app.yaml file | Managed by PSH - Done upon ticket |
| Storage increase | Autonomous: (permanent and has extra cost) | PSH (permanent and has extra cost) |
| Storage allocation between mounts, DB and services | Autonomous: dev team changes it in .platform.app.yaml file | Managed by PSH - Done upon ticket |
| Log exports | "Through filebeat and deployed via the application (using the .platform.app.yaml file). Fastly log export." | "Managed by PSH - Rsyslog exports. Fastly log export" |
| New Relic | APM Supported only | APM + New Relic infrastructure |


For more information about our Dedicated offerings, explore our [Dedicated Gen 2]() and [Dedicated Gen 3]() pages.