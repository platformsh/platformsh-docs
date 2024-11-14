---
title: "Dedicated Gen 3 Overview"
weight: -10
sidebarTitle: "DG3 overview"
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

{{< note title="Note" theme="info" >}}

Existing Grid and Dedicated Gen 2 projects cannot be migrated to Dedicated Gen 3 at this time.

{{< /note >}} 

### Dedicated Gen 3 vs Grid

Much of the tooling used on Grid regions is used for DG3, but there are still some key differences. Please find a list of the similarities and differences below: 

| Feature | DG3 | Grid  |
| --- | --- | --- |
| **Source Operations** | Yes | Yes |
| **PHP version upgrade** | Self-service via yaml config files | Self-service via yaml config files |
| **NodeJS version upgrade** | Self-service via yaml config files | Self-service via yaml config files |
| **Cron management** | Self-service via yaml config files | Self-service via yaml config files |
| **Web server internal config : locations**  | Self-service via yaml config files | Self-service via yaml config files |
| **CDN** | Fastly  | Fastly  |
| **Dedicated IP** | Yes | No |
| **Configuration management** | Split responsibility between Platform.sh and customer | only through yaml files  |
| **Usable regions** | Any region needed | Only the publicly available |
| **Autonomous upsize** | Managed through Platform.sh | Yes |
| **Upsize or downsize methods** | No downtime - each instance is upsize in a rolling fashion | Redeploy - possible downtime depending on the hooks |
| **Production branch** | Managed by Platform.sh| Self-service |
| **Autoscaling** | Yes, but not on split architecture | No |
| **Multi AZ** | Yes | No |
| **New Relic** | APM + New Relic infrastructure | APM Supported only |
| **Multi-app support (PWA)** | Supported natively | Supported natively |
| **Routes management**  | Self-service via yaml config files | Self-service via yaml config files |
| **Environment clone** | Yes on all branches | Yes on all branches |
| **Services : Add, remove, upgrade**  | Self-service via yaml config files | Self-service via yaml config files |
| **Relationships : Add, remove, update** | Self-service via yaml config files | Self-service via yaml config files |
| **Mounts management** | Self-service via yaml config files | Self-service via yaml config files |
| **Workers management**| Self-service via yaml config files | Self-service via yaml config files |
| **Web server internal config  : domains** | Self-service via yaml config files | Self-service via yaml config files |
| **Storage allocation between mounts, DB and services** | Self-service via yaml config files | Self-service via yaml config files |
| **Storage increase responsibility** | Autonomous | Autonomous |
| **Cron tasks interrupted by deploys** | No: a running cron task will block a deployment until it is complete | No: a running cron task will block a deployment until it is complete |
| **Sync and merge functionalities** | Yes on all branches | Yes on all branches |
| **SLA** | 99.99% | 99.9% |
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
| **Custom domains name** | On master + any other branches | On master + any other branches |

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
| **Ruby** | 3.3, 3.2, 3.1, 3.0 |
| **Solr** | 9.6, 9.4, 9.2, 9.1, 8.11 |
| **Vault KMS** | 1.12 |

See the [services documentation](https://docs.platform.sh/add-services.html) for service-specific details.

#### Local mounts 

Dedicated Gen 3 provides a redundant infrastructure and local mounts aren’t shared between the three hosts.If you need a folder to be shared between your hosts, set up a [network storage mount](https://docs.platform.sh/add-services/network-storage.html).

### Dedicated Gen 3 vs Dedicated Gen 2

Just like Dedicated Gen 3, [Dedicated Gen 2](dedicated-environments/dedicated-gen-2) ensures increased uptime and availability for your apps and services. But as a Dedicated Gen 2 user, you have to go through the Platform.sh Customer Success team to make configuration or application topology changes.

Dedicated Gen 3 gives you both the high availability of Dedicated Gen 2 and the self-service flexibility and features of Grid projects. As a Dedicated Gen 3 user, you can edit your configuration yourself and see those changes reflected in your environments on every push without opening a ticket. See the table below for more differences and similarities between Dedicated Den 3 and Dedicated Gen 2:

| Feature | Dedicated Gen 2 | Dedicated Gen 3 |
| --- | --- | --- |
| **Source Operations** | Yes | Yes |
| **PHP version upgrade** | Self-service via yaml config files | Self-service via yaml config files |
| **NodeJS version upgrade** | Self-service via yaml config files | Self-service via yaml config files |
| **Cron management** | Self-service via yaml config files | Self-service via yaml config files |
| **Web server internal config : locations**  | Self-service via yaml config files | Self-service via yaml config files |
| **CDN** | Fastly  | Fastly  |
| **Dedicated IP** | Yes | Yes |
| **Usable regions** | Any region needed | Any region needed  |
| **Autonomous upsize** | Managed through Platform.sh | Managed through Platform.sh|
| **Multi AZ** | Yes | Yes |
| **New Relic** | APM + New Relic infrastructure | APM + New Relic infrastructure |
| **Multi-app support (PWA)** | Supported through docroots | Supported natively |
| **Routes management**  | Managed by Platform.sh | Self-service via yaml config files |
| **Environment clone** | Only on development environments | Yes on all branches |
| **Services : Add, remove, upgrade**  | Managed by Platform.sh | Self-service via yaml config files |
| **Relationships : Add, remove, update** | Managed by Platform.sh| Self-service via yaml config files |
| **Mounts management** | - Autonomous or managed by Platform.sh | Self-service via yaml config files |
| **Workers management** | Managed by Platform.sh | Self-service via yaml config files |
| **Web server internal config: domains** | Managed by Platform.sh | Self-service via yaml config files |
| **Storage allocation between mounts, DB and services** | Managed by Platform.sh | Self-service via yaml config files |
| **Storage increase responsibility** | PSH | Autonomous |
| **Cron tasks interrupted by deploys** | Yes: a deploy will terminate a running cron task | No: a running cron task will block a deployment until it is complete |
| **Sync and Merge functionalities** | Only on dev environments | Yes on all branches |
| **Functioning** | 3 nodes are running all applications and services are replicated | 3 nodes are running all applications and service are replicated |
| **Resources allocation** | Resources deployed on the 3 nodes | Resources deployed on the 3 nodes |
| **MySQL Replication** | Yes: 3 services nodes cluster | Yes: 3 services nodes cluster |
| **Redis Replication**  | Yes: 3 services nodes cluster | Yes: 3 services nodes cluster |
| **Split Architecture** | Yes | No |
| **VPN** | AWS PrivateLink | AWS PrivateLink |
| **Automated backup** | Yes | Yes  |
| **Elasticsearch premium**  | Yes | Yes |
| **SFTP password access** | Yes | Yes |
| **Custom domains name** | Supported on the production environment | On master + any other branches |
| **On-demand backup** | Not supported | Same as grid |

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











