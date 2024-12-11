---
title: "Dedicated Gen 3 Overview"
weight: -10
sidebarTitle: "DG3 overview"
description:  "Designed to cater to the needs of organizations that build demanding apps, Dedicated Generation 3 (DG3) offers increased resources and High Availability (HA) for all your services, along with stricter isolation requirements and additional compliance frameworks."
---

{{% description %}}

### Key features

-   **High Availability:** 99.99% SLA (service-level agreement) with [Enterprise or Elite](https://platform.sh/pricing/)
-   **Dedicated hosts:** Each DG3 cluster is provisioned with 3 dedicated hosts as the typical configuration
-   **Headless architecture:** Seamless headless architecture with multi-app support
-   **Self-service:** Customers may edit their application and service YAML files and push changes. Customers can also take advantage of MariaDB Galera multi-leader and adding, upgrading or removing services on their own
-   **Data sync from Dedicated to Grid:** Customers can initiate data syncs themselves via Console (restore a Grid HA backup on DG3 and restore a DG3 backup on a Grid HA environment)
-   **Better containerization:** DG3 is containerized and decouples the base operating system (OS) version and [control plane](/glossary.md#control-plane) from the service versions, so the OS and services can be upgraded independently
-   **Better staging:** Dedicated Gen 3 comes with HA staging as default. This allows the data sync between Dedicated and Grid to be simpler, consistent and seamless

{{< note title="Note" theme="info" >}}

Existing Grid and Dedicated Gen 2 projects cannot be migrated to Dedicated Gen 3.

{{< /note >}} 

### Dedicated Gen 3 vs Grid

Much of the tooling used on Grid is used for DG3, but there are still some differences. Please find a list of the similarities and differences below: 

| Feature | DG3 | Grid  |
| --- | --- | --- |
| **Source Operations** | Yes | Yes |
| **PHP version upgrade** | Self-service via YAML config files | Self-service via YAML config files |
| **NodeJS version upgrade** | Self-service via YAML config files | Self-service via YAML config files |
| **Cron management** | Self-service via YAML config files | Self-service via YAML config files |
| **Web server internal config : locations**  | Self-service via YAML config files | Self-service via YAML config files |
| **CDN** | Fastly  | A managed Fastly CDN service can be purchased through Platform.sh |
| **Dedicated IP** | Yes | No |
| **Configuration management** | Self-service via YAML config files | Self-service via YAML config files  |
| **Usable regions** | Any region needed | Only the publicly available |
| **Autonomous upsize** | Managed through Platform.sh | Yes |
| **Upsize or downsize methods** | No downtime - each instance is altered in a rolling fashion | Redeploy - possible downtime depending on the hooks |
| **Production branch** | Self-service | Self-service |
| **Autoscaling** | Yes | No |
| **Multi availability zones** | Yes | No |
| **New Relic** | APM + New Relic Infrastructure | APM Supported only |
| **Multi-app support** | Supported natively | Supported natively |
| **Routes management**  | Self-service via YAML config files | Self-service via YAML config files |
| **Environment clone** | Yes on all branches | Yes on all branches |
| **Services : Add, remove, upgrade**  | Self-service via YAML config files | Self-service via YAML config files |
| **Relationships : Add, remove, update** | Self-service via YAML config files | Self-service via YAML config files |
| **Mounts management** | Self-service via YAML config files | Self-service via YAML config files |
| **Workers management**| Self-service via YAML config files | Self-service via YAML config files |
| **Web server internal config  : domains** | Self-service via YAML config files | Self-service via YAML config files |
| **Storage allocation between mounts, DB and services** | Self-service via YAML config files | Self-service via YAML config files |
| **Storage increase responsibility** | Shared responsibility with Platform.sh | Self-service |
| **Cron tasks interrupted by deploys** | No: a running Cron task will block a deployment until it is complete | No: a running Cron task will block a deployment until it is complete |
| **Sync and merge functionalities** | Yes on all branches | Yes on all branches |
| **SLA** | 99.99% with [Enterprise or Elite](https://platform.sh/pricing/) | 99.9% with [Enterprise or Elite](https://platform.sh/pricing/)|
| **Infrastructure** | Dedicated 3 node cluster | Containers with dedicated resources on top of a shared redundant infrastructure |
| **Functioning** | 3 nodes are running all applications and services are replicated across all 3| A single container is deployed per runtimes and per services |
| **Resources allocation** | Resources are deployed on all 3 nodes | Resources are spread through one container with fixed sizes after deployment |
| **MySQL Replication** | Yes: 3 services nodes cluster | None: standalone service container |
| **Redis Replication**  | Yes: 3 services nodes cluster | None: standalone service container |
| **High availability (HA)**  | Yes | No |
| **Split Architecture** | No | No |
| **Automated backup** | Yes | Yes |
| **Elasticsearch premium**  | Yes | Yes |
| **SFTP password access** | Yes | No |
| **Custom domains name** | On all branches for [Enterprise or Elite](https://platform.sh/pricing/) customers | On all branches for [Enterprise or Elite](https://platform.sh/pricing/) customers |

#### Available services

Your app can connect to each service by referencing the exact same [environment variables](/development/variables.md) as for Grid environments. 

| Service | Supported versions |
| --- | --- |
| **Headless Chrome** | 95 |
| **MariaDB/MySQL** | 10.11 Galera, 10.6 Galera, 10.5 Galera, 10.4 Galera, 10.3 Galera |
| **Network Storage** | 2 |
| **OpenSearch** | 2 |
| **PostgreSQL** | 16, 15, 14, 13, 12 |
| **RabbitMQ** | 3.13, 3.12 |
| **Redis** | 7.2, 7.0, 6.2 |
| **Solr** | 9.6, 9.4, 9.2, 9.1, 8.11 |
| **Vault KMS** | 1.12 |

See the [services documentation](/add-services/_index.md) for service-specific details.

#### Local mounts 

Dedicated Gen 3 provides a redundant infrastructure and local mounts aren’t shared between the three hosts. If you need a folder to be shared between your hosts, such as for common assets, set up a [network storage mount](/add-services/network-storage.md).

### Dedicated Gen 3 vs Dedicated Gen 2

Just like [Dedicated Gen 2](/dedicated-environments/dedicated-gen-2/_index.md), Dedicated Gen 3 ensures increased uptime and availability for your apps and services. But as a Dedicated Gen 2 user, you have to go through the Platform.sh Customer Success team to make configuration or application topology changes.

Dedicated Gen 3 gives you both the high availability of Dedicated Gen 2 and the self-service flexibility and features of Grid projects. As a Dedicated Gen 3 user, you can edit your configuration yourself and see those changes reflected in your environments on every push without opening a ticket. See the table below for more differences and similarities between Dedicated Den 3 and Dedicated Gen 2:

| Feature | Dedicated Gen 2 | Dedicated Gen 3 |
| --- | --- | --- |
| **Source Operations** | Yes | Yes |
| **PHP version upgrade** | Self-service via YAML config files | Self-service via YAML config files |
| **NodeJS version upgrade** | Self-service via YAML config files | Self-service via YAML config files |
| **Cron management** | Self-service via YAML config files | Self-service via YAML config files |
| **Web server internal config : locations**  | Self-service via YAML config files | Self-service via YAML config files |
| **CDN** | Fastly  | Fastly  |
| **Dedicated IP** | Yes | Yes |
| **Usable regions** | Any region needed | Any region needed  |
| **Autonomous upsize** | Managed through Platform.sh | Managed through Platform.sh|
| **Multiple availability zones** | Yes | Yes |
| **New Relic** | APM + New Relic infrastructure | APM + New Relic infrastructure |
| **Multi-app support (PWA)** | Supported through docroots | Supported natively |
| **Routes management**  | Managed by Platform.sh | Self-service via YAML config files |
| **Environment clone** | Only on development environments | Yes on all branches |
| **Services : Add, remove, upgrade**  | Managed by Platform.sh | Self-service via YAML config files |
| **Relationships : Add, remove, update** | Managed by Platform.sh| Self-service via YAML config files |
| **Mounts management** | Self-service or managed by Platform.sh | Self-service via YAML config files |
| **Workers management** | Managed by Platform.sh | Self-service via YAML config files |
| **Web server internal config: domains** | Managed by Platform.sh | Self-service via YAML config files |
| **Storage allocation between mounts, DB and services** | Managed by Platform.sh | Self-service via YAML config files |
| **Storage increase responsibility** | Managed by Platform.sh | Self-service |
| **Cron tasks interrupted by deploys** | Yes: a deploy will terminate a running Cron task | No: a running Cron task will block a deployment until it is complete |
| **Sync and Merge functionalities** | Only on development environments | Yes on all branches |
| **Functioning** | 3 nodes are running all applications and services are replicated | 3 nodes are running all applications and service are replicated |
| **Resources allocation** | Resources deployed on the 3 nodes | Resources deployed on the 3 nodes |
| **MySQL Replication** | Yes: 3 services nodes cluster | Yes: 3 services nodes cluster |
| **Redis Replication**  | Yes: 3 services nodes cluster | Yes: 3 services nodes cluster |
| **Split Architecture** | Yes | No |
| **VPN** | AWS/Azure PrivateLink | AWS/Azure PrivateLink |
| **Automated backup** | Yes | Yes  |
| **Elasticsearch premium**  | Yes | Yes |
| **SFTP password access** | Yes | Yes |
| **Custom domains name** | Available only on Dedicated Environments for [Enterprise or Elite](https://platform.sh/pricing/) customers | On all branches for [Enterprise or Elite](https://platform.sh/pricing/) customers |
| **On-demand backup** | Not supported | Same as grid |

#### Optional features

You can enable the following features on your Dedicated Gen 3 projects. To enable an optional feature or get more information on potential fees, [contact Sales](https://platform.sh/contact/).

##### Multiple availability zones 

The default configuration for Dedicated clusters is to launch them into a single availability zone (AZ) for the following reasons:

-   The members of your cluster communicate with each other via TCP to perform DB replication, cache lookup, and other associated tasks. Therefore, the latency between data centers or AZs can become a significant performance liability. When your entire cluster is deployed within a single AZ, the latency between cluster members is minimal. This has a direct effect on perceived end-user performance.
-   Network traffic between AZs is billed, whereas intra-AZ traffic isn’t. Launching Dedicated clusters across multiple AZs leads to higher costs and decreased performance.
If you prefer the peace of mind of hosting across multiple AZs, you can request a different configuration.

{{< note title="Note" theme="info" >}}

Platform.sh is responsible for meeting the 99.99% uptime SLA, so multiple-AZ deployments should only be considered in cases where they’re truly appropriate. Multi-AZ deployments are available only on select AWS regions.

{{< /note >}} 

##### SFTP 

In addition to SSH accounts, you can create SFTP accounts with a custom user/password to [transfer files](/development/file-transfer.md). 

{{< note title="Note" theme="info" >}}

On Dedicated Gen 3 projects, SFTP access cannot be limited to a specific directory. Instead, access is given to the whole application directory and its mounts. However, write access is restricted to the mounts declared in your YAML config files. SSH public key based authentication is also supported on the SFTP account.

{{< /note >}}
