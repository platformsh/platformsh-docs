---
title: "{{% names/dedicated-environments %}} Dedicated Generation 3 Overview"
weight: 1
sidebarTitle: "Overview"
layout: single
description:  "Designed to cater to the needs of organizations that build demanding apps, Dedicated Generation 3 (DG3) offers increased resources and high availability (HA) for all your services, along with stricter isolation requirements and additional compliance frameworks."
---

{{% description %}}

### Key features

-   **High Availability:** 99.99% SLA (service-level agreement)
-   **Dedicated hosts:** Each DG3 cluster is provisioned with 3 dedicated hosts as the typical configuration
-   **Headless e-commerce:** Seamless headless e-commerce with multi-app support
-   **Self-service:** Customers may edit their application and service YAML files and push changes. Customers can also take advantage of MariaDB Galera multi-master, disk resizing and adding, upgrading or removing services on their own
-   **Data sync from Dedicated to Grid:** Customers can initiate data syncs themselves via Console (restore a Grid HA backup on DG3 and restore a DG3 backup on a Grid HA environment)
-   **Better compliance:** DG3 is containerized and decouples the base operating system (OS) version and control plane from the service versions, so the OS and services can be upgraded independently.
-   **Better storage:** LVM storage is available, along with support for local and network storage (eg. GlusterFS). Ceph is also not used.
-   **Better hosting:** The host root file system is **read-only**. Customers can now access and use repositories and Engorgio. There is also no Puppet.
-   **Better staging:** All DG3 environments come with HA staging as default. This allows the data sync between Dedicated and Grid to be simpler, consistent and seamless. 
**Note:** Existing Grid and Dedicated Gen 2 projects cannot be migrated to Dedicated Gen 3 at this time.

### Dedicated Gen 3 vs Grid

Much of the tooling used on Grid regions is used for DG3, but there are still some key differences. Please find a list of the similarities and differences below: 

| Feature | DG3 | Grid  |
| --- | --- | --- |
| Source Operations | Yes | Yes |
| PHP version upgrade | Self-service via yaml config files | Self-service via yaml config files |
| NodeJS version upgrade | Self-service via yaml config files | Self-service via yaml config files |
| Cron management | Self-service via yaml config files | Self-service via yaml config files |
| Web server internal config : locations  | Self-service via yaml config files | Self-service via yaml config files |
| CDN | Fastly  | Fastly  |
| Dedicated IP | Yes | No |
| Configuration management | Split responsibility between Hiera (psh) and yaml files (customer) | only yaml files  |
| Usable regions | Any region needed (as long as we can deploy on it) | Only the publicly available |
| Autonomous upsize | Managed through PSH - Done upon ticket | Yes |
| Upsize / Downsize methods | No downtime - each instance is upsize in a rolling fashion | Redeploy - Possible downtime depending on the hooks |
| Production branch | Managed by PSH | Self-service, configurable, arbitrary |
| Autoscaling | Yes, but not split arch and only based on error rate, not proactive yet. | No |
| Multi AZ | Yes | No |
| New Relic | APM + New Relic infrastructure | APM Supported only |
| Multi-app support (PWA) | Supported natively. | Supported natively. |
| Routes management  | Self-service via yaml config files | Self-service via yaml config files |
| Environment clone | Yes on all branches | Yes on all branches |
| Services : Add, remove, upgrade  | Self-service via yaml config files | Self-service via yaml config files |
| Relationships : Add, remove, update | Self-service via yaml config files | Self-service via yaml config files |
| Mounts management | Self-service via yaml config files | Self-service via yaml config files |
| Workers management | Self-service via yaml config files | Self-service via yaml config files |
| Web server internal config  : domains | Self-service via yaml config files | Self-service via yaml config files |
| Storage allocation between mounts, DB and services | Self-service via yaml config files | Self-service via yaml config files |
| Storage increase responsibility | Autonomous | Autonomous |
| Cron tasks interrupted by deploys | No: a running cron task will block a deployment until it is complete | No: a running cron task will block a deployment until it is complete |
| Log exports | "Log forwarding feature |
| Fastly log export (where available)" | "Log forwarding feature |
| Fastly log export (where available)" |
| Sync and Merge functionalities | Yes on all branches | Yes on all branches |
| SLA | 99.99% | 99.9% |
| Infrastructure | Dedicated 3 node cluster | Containers with dedicated resources on top of a shared redundant infrastructure |
| Functioning | 3 nodes are running all applications and services and are replicated | A single container is deployed per runtimes and per services |
| Resources allocation | Resources deployed on the 3 nodes | Resources are spread through the container with fixed sizes after deploy |
| Failover mode | Hot, but not warm FO | "Supports hot, but mostly warm.  |
|  |
| The DG3 dev envs have hot FO because they have redundancy as the dedicated cluster. " |
| MySQL Replication | Yes: 3 services nodes cluster | None: standalone service container |
| Redis Replication  | Yes: 3 services nodes cluster | None: standalone service container |
| HA  | Yes | No |
| Split Arch | No (yet) | n/a |
| VPN | AWS PrivateLink, not sure for others | No |
| Storage | "NFS issues. |
| Here we use the same NFS than grid, but it's not yet reliable. |
| Gluster / ganesha. " | 100 GB self service max (but can be extended by via support) |
| Automated backup | Yes - Managed by PSH | Yes - Managed by PSH |
| Storgae increase effect on billing | permanent and has extra cost | permanent and has extra cost |
| Elasticsearch premium  | Yes | Yes |
| Hosts, CPU, RAM sizing | "Mostly the same as DG2.  Unknown at the time of writing. DG3 is still considered fragile.  ➡  ask TAM / CSM"
| "Max plan for the prod environment => 16.44 vCPU (2XL plan) This is then spread between all the containers (apps/services/workers) deployed on the environment. Per container: - Max 10 vCPUs for app container (4XL size / HIGH_CPU type). - Max 3 vCPUs for service container (4XL size / HIGH_MEMORY type). Max plan for the prod environment => 24 GB RAM / 32 GB RAM (for the high-memory plan)  This is then spread between all the containers (apps/services/workers) deployed on the environment. Per container: Max 9 GB RAM for app container using the flex resource yaml config. Max 10,496 MB RAM for service container (4XL size / HIGH_MEMORY type). Burst allowed. A region is 3 to 50 currently." |
| Database / services HA | "Same, in containers this time, and even dev envs are, on the grid, just to make sure we have consistency there between dev and prod. PGSQL is redundant/HA in DG3" | We could have redundant services on the grid, the API is there but only available for DG3 dev. |
| SFTP password access | Yes - and highly important for these clients | No |
| Custom domains name | On master + any other branches (brand new feature from March 2023) | On master + any other branches (brand new feature from March 2023) |
| MongoDB | In progress | Standalone service container |
| Postgresql & Replication | Yes | "More data, usually requires more resourcens (mem for cache, CPU for tasks ...) Standalone service container" |

#### Available services

Your app can connect to each service by referencing the exact same [environment variables](https://docs.platform.sh/development/variables.html) as for Grid environments. 

| Service | Supported versions |
| --- | --- |
| Headless Chrome | 95 |
| MariaDB/MySQL | 10.11 Galera, 10.6 Galera, 10.5 Galera, 10.4 Galera, 10.3 Galera |
| Network Storage | 2 |
| OpenSearch | 2 |
| PostgreSQL | 16, 15, 14, 13, 12 |
| RabbitMQ | 3.13, 3.12 |
| Redis | 7.2, 7.0, 6.2 |
| Ruby | 3.3, 3.2, 3.1, 3.0 |
| Solr | 9.6, 9.4, 9.2, 9.1, 8.11 |
| Vault KMS | 1.12 |

See the [services documentation](https://docs.platform.sh/add-services.html) for service-specific details.

#### Local mounts 

Dedicated Gen 3 provides a redundant infrastructure and local mounts aren’t shared between the three hosts.If you need a folder to be shared between your hosts, set up a [network storage mount](https://docs.platform.sh/add-services/network-storage.html).

### Dedicated Gen 3 vs Dedicated Gen 2

Just like Dedicated Gen 3, [Dedicated Gen 2](https://docs.platform.sh/dedicated-gen-2/overview.html) ensures increased uptime and availability for your apps and services. But as a Dedicated Gen 2 user, you have to go through the Platform.sh Customer Success team to make configuration or application topology changes.

Dedicated Gen 3 gives you both the high availability of Dedicated Gen 2 and the self-service flexibility and features of Grid projects. As a Dedicated Gen 3 user, you can edit your configuration yourself and see those changes reflected in your environments on every push without opening a ticket. See the table below for more differences and similarities between Dedicated Den 3 and Dedicated Gen 2:

| Feature | Dedicated Generation 2 | Dedicated Generation 3 |
| --- | --- | --- |
| Source Operations | Yes | Yes |
| PHP version upgrade | Self-service via yaml config files | Self-service via yaml config files |
| NodeJS version upgrade | Self-service via yaml config files | Self-service via yaml config files |
| Cron management | Self-service via yaml config files | Self-service via yaml config files |
| Web server internal config : locations  | Self-service via yaml config files | Self-service via yaml config files |
| CDN | Fastly  | Fastly  |
| Dedicated IP | Yes | Yes |
| Configuration management | Split responsibility between Hiera (psh) and yaml files (customer) | Split responsibility between Hiera (psh) and yaml files (customer) |
| Usable regions | Any region needed (as long as we can deploy on it) | Any region needed (as long as we can deploy on it) |
| Autonomous upsize | Managed through PSH - Done upon ticket | Managed through PSH - Done upon ticket |
| Upsize / Downsize methods | No downtime - each instance is upsize in a rolling fashion | No downtime - each instance is upsize in a rolling fashion |
| Production branch | Managed by PSH | Managed by PSH |
| Autoscaling | Yes, but not split arch and only based on error rate, not proactive yet. | Yes, but not split arch and only based on error rate, not proactive yet. |
| Multi AZ | Yes | Yes |
| New Relic | APM + New Relic infrastructure | APM + New Relic infrastructure |
| Multi-app support (PWA) | "Supported through docroots (additional billing) | " | Supported natively. |
| Routes management  | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Environment clone | Only on dev environments | Yes on all branches |
| Services : Add, remove, upgrade  | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Relationships : Add, remove, update | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Mounts management | - Autonomous: dev team changes it in .platform.app.yaml file or by Platform.sh if the mounts are local one" | Self-service via yaml config files |
| Workers management | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Web server internal config  : domains | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Storage allocation between mounts, DB and services | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Storage increase responsibility | PSH | Autonomous |
| Cron tasks interrupted by deploys | Yes: a deploy will terminate a running cron task | No: a running cron task will block a deployment until it is complete |
| Log exports | "Managed by PSH - Rsyslog exports or Fastly log export" | "Log forwarding feature, Fastly log export (where available)" |
| Sync and Merge functionalities | Only on dev environments | Yes on all branches |
| SLA | 99.99% | 99.99% |
| Infrastructure | Dedicated 3 node cluster | Dedicated 3 node cluster |
| Functioning | 3 nodes are running all applications and services and are replicated | 3 nodes are running all applications and services and are replicated |
| Resources allocation | Resources deployed on the 3 nodes | Resources deployed on the 3 nodes |
| Failover mode | Hot, but not warm FO | Hot, but not warm FO |
| MySQL Replication | Yes: 3 services nodes cluster | Yes: 3 services nodes cluster |
| Redis Replication  | Yes: 3 services nodes cluster | Yes: 3 services nodes cluster |
| HA  | Yes | Yes |
| Split Arch | Yes | No (yet) |
| VPN | AWS PrivateLink, not sure for others | AWS PrivateLink, not sure for others |
| Storage | "Local disk are accessed either locally or via glusterfs - nfs to provide RW FS to all web instances | "NFS issues. Here we use the same NFS than grid, but it's not yet reliable. Gluster / ganesha. " |
| Automated backup | Yes - Managed by PSH | Yes - Managed by PSH |
| Storgae increase effect on billing | permanent and has extra cost | permanent and has extra cost |
| Elasticsearch premium  | Yes | Yes |
| Hosts, CPU, RAM sizing | "3 nodes min, no real max for apps. Differences between app and services. Services are capped at 3 nodes max.  Note that for services only 1 node is used out of the three. Some serices can be HA'd.  T mobile. 1600 CPU - https://dash.pltfrm.sh/question/3826-largest-current-clusters-by-cpu-count " | "Mostly the same as DG2.  Unknown at the time of writing.  DG3 is still considered fragile.  ➡  ask TAM / CSM" |
| Network, Database / services HA | "Base. Everything is replicated. Redundant. Mariadb is basically on failover. A second db connection can be exposed for RO and local. But there are exceptions. Postgresql, memcached are not HA. But we don't have solutions setups." | "Same, in containers this time, and even dev envs are, on the grid, just to make sure we have consistency there between dev and prod. PGSQL is redundant/HA in DG3" |
| SFTP password access | Yes - and highly important for these clients | Yes - and highly important for these clients. 3 to no limit  |
| Custom domains name | Supported on the production environment | On master + any other branches (brand new feature from March 2023) |
| On-demand backup | Not supported | Same as grid |
| MongoDB | Not supported | In progress |
| Postgresql & Replication | "No. We don't really have PG on DG2. | We don't know really : |- perf - stability - HA - cacheability, We probably usually lose deals with high volume requirements. ➡  how to migrate? Only dumps for now. Replicating in, over the web? Maybe offer DBaaS. Inter project relations, direct accesses to services ..." | Yes |
| Invoice tracking and reporting | Jungle | Jungle |

#### Optional features

You can enable the following features on your Dedicated Gen 3 projects. To enable an optional feature or get more information on potential fees, [contact Sales](https://platform.sh/contact/).

#### Multiple availability zones 

The default configuration for Dedicated clusters is to launch them into a single availability zone (AZ) for the following reasons:

-   The members of your cluster communicate with each other via TCP to perform DB replication, cache lookup, and other associated tasks. Therefore, the latency between data centers or AZs can become a significant performance liability. When your entire cluster is deployed within a single AZ, the latency between cluster members is minimal. This has a direct effect on perceived end-user performance.
-   Network traffic between AZs is billed, whereas intra-AZ traffic isn’t. So launching Dedicated clusters across multiple AZs leads to higher costs for decreased performance.
If you prefer the peace of mind of hosting across multiple AZs, you can request a different configuration.
**Note:** Platform.sh is responsible for meeting the 99.99% uptime SLA, so multiple-AZ deployments should only be considered in cases where they’re truly appropriate. Multi-AZ deployments are available only on select AWS regions.

#### SFTP 

In addition to SSH accounts, you can create SFTP accounts with a custom user/password to [transfer files](https://docs.platform.sh/development/file-transfer.html). 

{{< note title="Note" theme="info" >}}

On Dedicated Gen 3 projects, SFTP access cannot be limited to a specific directory. Instead, access is given to the whole application directory and its mounts. SSH public key based authentication is also supported on the SFTP account.

{{< /note >}}











