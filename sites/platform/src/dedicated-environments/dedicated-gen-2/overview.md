---
title: Dedicated Gen 2 Overview
weight: -10
sidebarTitle: "DG2 overview"
description: "Dedicated Generation 2 is a robust, redundant layer. It’s well-suited for those who like the Platform.sh development experience but need more resources and redundancy for their production environment."

---

{{% description %}}

Dedicated Generation 2 consists of two parts: a development environment and a Dedicated Gen 2 cluster.

### Key features

-   **High Availability:** 99.99% SLA (service-level agreement) with [Enterprise or Elite](https://platform.sh/pricing/)
-   **Dedicated hosts:** Each DG2 cluster is provisioned with 3 dedicated hosts as the typical configuration
-   **Headless architecture:** Seamless headless architecture with multi-app support
-   **Isolation:** On DG2, services run as processes on the base operating system (OS) 
-   **Storage:** Storage allocation between mounts, DB and services is done through Platform.sh once a ticket is raised. Storage management is not self-service

## Dedicated Generation 2 vs Grid

Much of the tooling used on Grid is used for DG2, but there are still some differences. Please find a list of the similarities and differences between these two environments below: 

| Feature | Dedicated Generation 2 | Grid |
| --- | --- | --- |
| **Source Operations** | Yes | Yes |
| **PHP version upgrade** | Self-service via YAML config files | Self-service via YAML config files |
| **Node.js version upgrade** | Self-service via YAML config files | Self-service via YAML config files |
| **Cron management** | Self-service via YAML config files | Self-service via YAML config files |
| **Web server internal config : locations** | Self-service via YAML config files | Self-service via YAML config files |
| **CDN** | Fastly | A managed Fastly CDN service can be purchased through Platform.sh |
| **Dedicated IP** | Yes | No |
| **Configuration management** | Split responsibility between Platform.sh and customer | only YAML files |
| **Usable regions** | Any region needed | Only publicly available |
| **Autonomous upsize** | Managed through Platform.sh| Yes |
| **Autoscaling** | Yes | No |
| **Upsize or Downsize methods** | No downtime - each instance is altered in a rolling fashion | Redeploy - possible downtime depending on the hooks |
| **Multi availability zones** | Yes | No |
| **New Relic** | APM + New Relic infrastructure | APM Supported only |
| **Multi-app support** | Supported through docroots | Supported natively |
| **Routes management** | Self-service | Self-service |
| **Environment clone** | Only on development environments | Yes on all branches |
| **Services : Add, remove, upgrade** | Managed by Platform.sh | Self-service |
| **Relationships : Add, remove, update** | Managed by Platform.sh | Self-service |
| **Workers management** | Managed by Platform.sh | Self-service |
| **Web server internal config : domains** | Managed by Platform.sh | Self-service |
| **Storage allocation between mounts, DB and services** | Managed by Platform.sh | Self-service |
| **Cron tasks interrupted by deploys** | Yes: a deploy will terminate a running Cron task | No: a running Cron task will block a deployment until it is complete |
| **Log exports** | Managed by Platform.sh with Rsyslog exports and Fastly log exports | Log forwarding feature and Fastly log export also available|
| **Sync and merge functionalities** | Only on development environments | Yes on all branches |
| **SLA** | 99.99% with [Enterprise or Elite](https://platform.sh/pricing/)| 99.9% with [Enterprise or Elite](https://platform.sh/pricing/)|
| **Infrastructure** | Dedicated 3 node cluster | Containers with dedicated resources on top of a shared redundant infrastructure |
| **Functioning** | 3 nodes are running all applications and services and are replicated | A single container is deployed per runtimes and per services |
| **Resources allocation** | Resources deployed on 3 nodes | Resources are spread through the container with fixed sizes after deployment |
| **MySQL Replication** | Yes: 3 services nodes cluster | None: standalone service container |
| **Redis Replication** | Yes: 3 services nodes cluster | None: standalone service container |
| **High Availability (HA)** | Yes | No |
| **Split Architecture** | Yes | No |
| **Storage** | Local disks are accessed either locally or via glusterfs | 100 GB self service max (can be extended upon request) |
| **Automated backup** | Yes | Yes |
| **Custom domains name** | On all branches for [Enterprise or Elite](https://platform.sh/pricing/) customers | On all branches for [Enterprise or Elite](https://platform.sh/pricing/) customers |
| **MongoDB** | Yes | Standalone service container |

### Dedicated Gen 2 vs Dedicated Gen 3

Just like Dedicated Gen 3, [Dedicated Gen 2](/dedicated-environments/dedicated-gen-2/overview.html) ensures increased uptime and availability for your apps and services. But as a Dedicated Gen 2 user, you have to go through the Platform.sh Customer Success team to make configuration or application topology changes.

To understand the differences and similarities between Dedicated Generation 2 and Dedicated Generation 3, please head to [Dedicated Gen 3 vs Dedicated Gen 2](/dedicated-environments/dedicated-gen-3/overview.md#dedicated-gen-3-vs-dedicated-gen-2).

### Optional features

You can enable the following features on your Dedicated Gen 2 projects, as well as [multiple availability zones](/dedicated-environments/dedicated-gen-3/overview.md#multiple-availability-zones). To enable an optional feature or get more information on potential fees, [contact Sales](https://platform.sh/contact/).

#### Multiple applications

You can create multiple apps within a single project so they can share data. This can be useful if you have several apps that are closely related, such as a backend-only CMS and a frontend system for content delivery and display.

For more information, see how to [configure multiple apps in a single project](/create-apps/multi-app/_index.md).

#### Staging environments 

A dedicated single-node staging machine is provisioned for your application with an identical software configuration to your production hardware, but reduced hardware specs. This gives the advantages of isolating the staging load from the production hardware as well as having an identical software configuration to perform UAT, but this option doesn’t provide a bed for performance testing as the physical hardware configuration isn’t the same as production.

#### Additional application servers (Split Architecture)

For especially high-traffic sites we can also add additional application-only servers. These servers contain just the application code; data storage services (such as SQL, Solr, Redis) are limited to the standard three. The cluster begins to look more like a standard N-Tier architecture at this point, with a horizontal line of web application servers in front of a 3 node (N+1) cluster of Galera database servers.

Speak to your sales representative about the costs associated with adding additional application servers. This configuration requires a separate setup from the default so advanced planning is required.

#### SFTP 

In addition to SSH accounts, you can create SFTP accounts with a custom user/password that are restricted to certain directories. These directories must be one of the writeable mounts.

There is no cost for this configuration, and you can request it at any time via a [support ticket](/learn/overview/get-support.md). SSH public key based authentication is also supported on the SFTP account.

See how to [transfer files through sftp](/development/file-transfer.md).

#### Error handling 

On Grid projects, incoming requests are held at the edge router temporarily during a deploy. That allows a site to “respond slowly” rather than be offline during a deploy, provided the deploy time is short (a few seconds).

On Dedicated Gen 2 projects, incoming requests aren’t held during deploy and receive a 503 error. As the Dedicated Gen 2 cluster is almost always fronted by a CDN, the CDN continues to serve cached pages during the few seconds of deploy, so for the vast majority of users there is no downtime or even slow down. If a request does pass the CDN during a deploy, it isn’t counted as downtime covered by our Service Level Agreement.

By default, Platform.sh serves generic Platform.sh-branded error pages for errors generated before a request reaches the application. (5XX errors, some 4XX errors, etc.) Alternatively you may provide a static error page for each desired error code via a ticket for us to configure with the CDN. This file may be any static HTML file but is limited to 64 KB in size.

#### Remote logging 

Dedicated Gen 2 supports sending logs to a remote logging service such as Loggly, Papertrail, or Logz.io using the rsyslog service. This is an optional feature and you can request that it be enabled via a [support ticket](/learn/overview/get-support.md). Once enabled and configured your application can direct log output to the system syslog facility and is replicated to the remote service you have configured.

When contacting support to enable rsyslog, you need:

-   The name of the remote logging service to use.
-   The message template format used by your logging service.
-   The specific log files you want forwarded to your logging service.

There is no cost for this functionality.

#### IP restrictions 

Platform.sh supports [project-level IP restrictions (allow/deny) and HTTP Basic authentication](/environments/http-access-control.md). These may be configured through the development environment and are automatically replicated from the production and staging branches to the production and staging environments, respectively.

Changing access control triggers a new deployment of the current environment. However, the changes aren’t propagated to child environments until they’re manually redeployed.

### Updates

Platform.sh updates the core software of the Dedicated Gen 2 cluster (operating system, web server, PHP, MySQL, etc.) periodically, and after any significant security vulnerability is disclosed. 

These updates are deployed automatically with no additional work required by you. We attempt to maintain parity with your development environment, but we don’t guarantee absolute parity of point versions of your Dedicated Gen 2 Environments with their corresponding development environments. For example, your development environment may have a PHP container running 8.1.30, but your production environment may lag behind at 8.1.26. 

We can upgrade point releases on request and always upgrade the underlying software in the event of security release.

Updates to application software (PHP code, JavaScript, etc.) are the responsibility of the customer.


