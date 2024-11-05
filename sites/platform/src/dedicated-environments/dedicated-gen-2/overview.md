---
title: "Development"
weight: 1
sidebarTitle: "Dedicated Generation 2 Development"
description: "Dedicated Generation 2 is a robust, redundant layer. It’s well-suited for those who like the Platform.sh development experience but need more resources and redundancy for their production environment. Dedicated Generation 2 consists of two parts: a Development Environment and a Dedicated Gen 2 cluster."

---

{{% description %}}

### Key features

-   **High Availability:** 99.99% SLA (service-level agreement)
-   **Dedicated hosts:** Each DG2 cluster is provisioned with 3 dedicated hosts as the typical configuration
-   **Headless e-commerce:** Seamless headless e-commerce with multi-app support
-   **Self-service:** Customers may edit their application and service YAML files and push changes. 
-   **Compliance:** On DG2, services run on the base operating system (OS). 
-   **Storage:** Storage allocation between mounts, DB and services is done through Platform.sh once a ticket is raised. Storage management is not self-service.
-   **Hosting:** The host root file system is **read-only**. 
-   **Staging:** All DG3 environments come with HA staging as default. This allows the data sync between Dedicated and Grid to be simpler, consistent and seamless. 

## Dedicated Generation 2 vs Grid

Much of the tooling used on Grid regions is used for DG2, but there are still some key differences. Please find a list of the similarities and differences between these two environments below: 

| Feature | Dedicated Generation 2 | Grid |
| --- | --- | --- |
| Source Operations | Yes | Yes |
| PHP version upgrade | Self-service via yaml config files | Self-service via yaml config files |
| NodeJS version upgrade | Self-service via yaml config files | Self-service via yaml config files |
| Cron management | Self-service via yaml config files | Self-service via yaml config files |
| Web server internal config : locations | Self-service via yaml config files | Self-service via yaml config files |
| CDN | Fastly | Fastly |
| Dedicated IP | Yes | No |
| Configuration management | Split responsibility between Hiera (psh) and yaml files (customer) | only yaml files |
| Usable regions | Any region needed (as long as we can deploy on it) | Only the publicly available |
| Autonomous upsize | Managed through PSH - Done upon ticket | Yes |
| Upsize / Downsize methods | No downtime - each instance is upsize in a rolling fashion | Redeploy - Possible downtime depending on the hooks |
| Production branch | Managed by PSH | Self-service, configurable, arbitrary |
| Autoscaling | Yes, but not split arch and only based on error rate, not proactive yet. | No |
| Multi AZ | Yes | No |
| New Relic | APM + New Relic infrastructure | APM Supported only |
| Multi-app support (PWA) | Supported through docroots (additional billing) | Supported natively. |
| Routes management | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Environment clone | Only on dev environments | Yes on all branches |
| Services : Add, remove, upgrade | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Relationships : Add, remove, update | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Mounts management | Depends on the context: Autonomous: dev team changes it in .platform.app.yaml file. By Platform.sh if the mounts are local one | Self-service via yaml config files |
| Workers management | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Web server internal config : domains | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Storage allocation between mounts, DB and services | Managed by PSH - Done upon ticket | Self-service via yaml config files |
| Storage increase responsibility | PSH | Autonomous |
| Cron tasks interrupted by deploys | Yes: a deploy will terminate a running cron task | No: a running cron task will block a deployment until it is complete |
| Log exports | "Managed by PSH - Rsyslog exports |
| Fastly log export" | "Log forwarding feature |
| Fastly log export (where available)" |
| Sync and Merge functionalities | Only on dev environments | Yes on all branches |
| SLA | 99.99% | 99.90% |
| Infrastructure | Dedicated 3 node cluster | Containers with dedicated resources on top of a shared redundant infrastructure |
| Functioning | 3 nodes are running all applications and services and are replicated | A single container is deployed per runtimes and per services |
| Resources allocation | Resources deployed on the 3 nodes | Resources are spread through the container with fixed sizes after deploy |
| Failover mode | Hot, but not warm FO | Supports hot, but mostly warm. The DG3 dev envs have hot FO because they have redundancy as the dedicated cluster. |
| MySQL Replication | Yes: 3 services nodes cluster | None: standalone service container |
| Redis Replication | Yes: 3 services nodes cluster | None: standalone service container |
| HA | Yes | No |
| Split Arch | Yes | n/a |
| VPN | AWS PrivateLink, not sure for others | No |
| Storage | Local disk are accessed either locally or via glusterfs - nfs to provide RW FS to all web instances | 100 GB self service max (but can be extended by via support) |
| Automated backup | Yes - Managed by PSH | Yes - Managed by PSH |
| Storgae increase effect on billing | permanent and has extra cost | permanent and has extra cost |
| Elasticsearch premium | Yes | Yes |
| Hosts, CPU, RAM sizing | "3 nodes min, no real max for apps. Differences between app and services. Services are capped at 3 nodes max. Note that for services only 1 node is used out of the three. Some serices can be HA'd. T mobile. 1600 CPU |
| https://dash.pltfrm.sh/question/3826-largest-current-clusters-by-cpu-count" | Max plan for the prod environment => 16.44 vCPU (2XL plan) This is then spread between all the containers (apps/services/workers) deployed on the environment. Per container: - Max 10 vCPUs for app container (4XL size / HIGH_CPU type). - Max 3 vCPUs for service container (4XL size / HIGH_MEMORY type). Max plan for the prod environment => 24 GB RAM / 32 GB RAM (for the high-memory plan) This is then spread between all the containers (apps/services/workers) deployed on the environment. Per container: - Max 9 GB RAM for app container using the flex resource yaml config. - Max 10,496 MB RAM for service container (4XL size / HIGH_MEMORY type). Burst allowed A region is 3 to 50 currently. |
| Database / services HA | Base. Everything is replicated.Redundant. Mariadb is basically on failover. A second db connection can be exposed for RO and local. But there are exceptions. Postgresql, memcached are not HA. But we don't have solutions setups. | We could have redundant services on the grid, the API is there but only available for DG3 dev. |
| SFTP password access | Yes - and highly important for these clients | No |
| Custom domains name | Supported on the production environment | On master + any other branches (brand new feature from March 2023) |
| On-demand backup | Not supported |  |
| MongoDB | Not supported | Standalone service container |
| Postgresql & Replication | No. We don't really have PG on DG2. We don't know really : perf, stability, HA, cacheability. We probably usually lose deals with high volume requirements. ➡ how to migrate? Only dumps for now. Replicating in, over the web? Maybe offer DBaaS. Inter project relations, direct accesses to services ... | More data, usually requires more resourcens (mem for cache, CPU for tasks ...) Standalone service container |

### Dedicated Gen 2 vs Dedicated Gen 3

Just like Dedicated Gen 3, [Dedicated Gen 2](/dedicated-environments/dedicated-gen-2/overview.html) ensures increased uptime and availability for your apps and services. But as a Dedicated Gen 2 user, you have to go through the Platform.sh Customer Success team to make configuration or application topology changes.

To understand the differences and similarities between Dedicated Generation 2 and Dedicated Generation 3, please head to [Dedicated Gen 3 vs Dedicated Gen 2](/dedicated-environments/dedicated-gen-3/overview.md#dedicated-gen-3-vs-dedicated-gen-2).

### Optional features

You can enable the following features on your Dedicated Gen 2 projects, as well as [multiple availability zones](/dedicated-environments/dedicated-gen-3/options.html#multiple-availability-zones). To enable an optional feature or get more information on potential fees, [contact Sales](https://platform.sh/contact/).

#### Multiple applications

You can create multiple apps within a single project so they can share data. This can be useful if you have several apps that are closely related, such as a backend-only CMS and a frontend system for content delivery and display.

For more information, see how to [configure multiple apps in a single project](https://docs.platform.sh/create-apps/multi-app.html).

#### Staging environments 

A dedicated single-node staging machine is provisioned for your application with an identical software configuration to your production hardware, but reduced hardware specs. This gives the advantages of isolating the staging load from the production hardware as well as having an identical software configuration to perform UAT, but this option doesn’t provide a bed for performance testing as the physical hardware configuration isn’t the same as production.

#### Additional application servers 

For especially high-traffic sites we can also add additional application-only servers. These servers contain just the application code; data storage services (such as SQL, Solr, Redis) are limited to the standard three. The cluster begins to look more like a standard N-Tier architecture at this point, with a horizontal line of web application servers in front of a 3 node (N+1) cluster of Galera database servers.

Speak to your sales representative about the costs associated with adding additional application servers. This configuration requires a separate setup from the default so advanced planning is required.

#### SFTP 

In addition to SSH accounts, you can create sftp accounts with a custom user/password that are restricted to certain directories. These directories must be one of the writeable mounts (or rather, there’s no point assigning them to the read-only code directory).

There is no cost for this configuration, and you can request it at any time via a [support ticket](https://docs.platform.sh/learn/overview/get-support.html). SSH public key based authentication is also supported on the sftp account.

See how to [transfer files through sftp](https://docs.platform.sh/development/file-transfer.html).

#### Error handling 

On Grid projects, incoming requests are held at the edge router temporarily during a deploy. That allows a site to “respond slowly” rather than be offline during a deploy, provided the deploy time is short (a few seconds).

On Dedicated Gen 2 projects, incoming requests aren’t held during deploy and receive a 503 error. As the Dedicated Gen 2 cluster is almost always fronted by a CDN, the CDN continues to serve cached pages during the few seconds of deploy, so for the vast majority of users there is no downtime or even slow down. If a request does pass the CDN during a deploy, it isn’t counted as downtime covered by our Service Level Agreement.

By default, Platform.sh serves generic Platform.sh-branded error pages for errors generated before a request reaches the application. (500 errors, some 400 errors, etc.) Alternatively you may provide a static error page for each desired error code via a ticket for us to configure with the CDN. This file may be any static HTML file but is limited to 64 KB in size.

#### Remote logging 

Dedicated Gen 2 supports sending logs to a remote logging service such as Loggly, Papertrail, or Logz.io using the rsyslog service. This is an optional feature and you can request that it be enabled via a [support ticket](https://docs.platform.sh/learn/overview/get-support.html). Once enabled and configured your application can direct log output to the system syslog facility and is replicated to the remote service you have configured.

When contacting support to enable rsyslog, you need:

-   The name of the remote logging service to use.
-   The message template format used by your logging service.
-   The specific log files you want forwarded to your logging service.

There is no cost for this functionality.

#### IP restrictions 

Platform.sh supports [project-level IP restrictions (allow/deny) and HTTP Basic authentication](https://docs.platform.sh/environments/http-access-control.html). These may be configured through the Development Environment and are automatically replicated from the production and staging branches to the production and staging environments, respectively.

Changing access control triggers a new deployment of the current environment. However, the changes aren’t propagated to child environments until they’re manually redeployed.

### Updates

Platform.sh updates the core software of the Dedicated Gen 2 cluster (operating system, web server, PHP, MySQL, etc.) periodically, and after any significant security vulnerability is disclosed. 

These updates are deployed automatically with no additional work required by you. We attempt to maintain parity with your development environment, but we don’t guarantee absolute parity of point versions of your Dedicated Gen 2 environments with their corresponding development environments. I.e, your development environment may have a PHP container running 5.6.30, but your production environment may lag behind at 5.6.22. 

We can upgrade point releases on request and always upgrade the underlying software in the event of security release.

Updates to application software (PHP code, JavaScript, etc.) are the responsibility of the customer.


