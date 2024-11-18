---
title: "Security and monitoring"
weight: -17
sidebarTitle: "Security and monitoring"
layout: single
description:  "Security is handled in a similar way for both Dedicated Gen 2 and Dedicated Gen 3 projects, with strict procedures that are followed to handle incidents."
---

We use a combination of three trusted methods to ensure your site is secure and running at all times: 

- [Project isolation](#project-isolation)
- [Encryption](#encryption)
- [Performance monitoring](#performance-monitoring)

{{% description %}}

### Project isolation 

All Dedicated clusters are single-tenant. The [three hosts](/dedicated-environments/dedicated-gen-2/overview.md) are exclusively used by a single customer and each cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers). The network is behind a firewall for incoming connections. Only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS), and 2221 (SFTP) are opened to incoming traffic.

There are no exceptions for this rule, so any incoming web service requests, ETL jobs, or otherwise need to transact over one of these protocols. Outgoing TCP traffic isn’t behind a firewall. Outgoing UDP traffic is disallowed. For containers to be allowed to connect to each other, the following requirement must be met:

-   The containers must live in the same environment
-   You need to define an explicit relationship between the containers in your [app configuration](/create-apps/app-reference/single-runtime-image.md#relationships)

All Dedicated projects are isolated and their data is fully encrypted. Should a security breach occur, Platform.sh follows a strict security incident handling procedure to deal with the issue as promptly and efficiently as possible.

### Encryption 

All sites and tools supported and maintained by Platform.sh are fully encrypted by default. 

For more information about Encryption at Platform.sh, visit the [Platform.sh Trust Center](https://platform.sh/trust-center/security/encryption/).

### Performance monitoring

All of our Dedicated clusters are monitored 24/7 to ensure uptime and to measure server metrics such as available disk space, memory and disk usage, and several dozen other metrics that give us a complete picture of the health of your application’s infrastructure. 

As soon as a metric goes out of bounds (i.e., an outage is detected), Support and Operations teams are alerted, a Point in Time report is generated, and the Platform.sh teams can triage the cause of the outage.

#### Automated monitoring

On top of internal Platform.sh tools, a third-party availability monitoring system is configured for every Dedicated project. This further guarantees that issues are spotted and addressed as quickly as possible. If you’re using a CDN, [make sure it’s configured](/domains/cdn/_index.md#configure-your-cdn-to-support-high-sla) to support automated monitoring and guarantee high SLA.

Automated monitoring is used to keep an eye on your production environment at all times. If automated monitoring triggers an alert, or if a customer files an urgent priority ticket, an on-call engineer is immediately paged so they can respond and begin to triage the issue.
Cloud infrastructure issues are handled by the Platform.sh Customer Success team. Note that application problems are returned to the user and may be downgraded.

#### Observability services

As the official, in-house Platform.sh observability tool, [Blackfire](/increase-observability/integrate-observability/blackfire.md) provides unparalleled monitoring, profiling, and performance testing technologies. Using Blackfire on Platform.sh enhances your experience and allows you to enjoy greater support as well as unique upcoming features.

As an Enterprise or Elite customer, you can use the Platform.sh [Observability Suite](https://platform.sh/features/observability-suite/), which offers application performance monitoring by Blackfire packaged with infrastructure monitoring. The Observability Suite includes all Blackfire features, support, and usage that scales with your needs. 

Platform.sh also supports third-party observability services such as [New Relic](/increase-observability/integrate-observability/new-relic/_index.md) and [Tideways](/increase-observability/integrate-observability/tideways.md). You need to get your own license for them. These third-party services have their own associated cost, are language-specific, and may not be available for all languages.