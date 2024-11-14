---
title: "Security and monitoring"
weight: -17
sidebarTitle: "Security and monitoring"
layout: single
description:  "Security is handled in a similar way for both Dedicated Gen 2 and Dedicated Gen 3 projects, with strict procedures that are followed to handle incidents."
---

We use a combination of four trusted methods to ensure your site is secure and running at all times: 

- [Project isolation](#project-isolation)
- [Encryption](#encryption)
- [Performance monitoring](#performance-monitoring)
- [Security incident monitoring](#security-incident-monitoring)

{{% description %}}

### Project isolation 

All Dedicated clusters are single-tenant. The [three hosts](/dedicated-environments/dedicated-gen-2/overview.md) are exclusively used by a single customer and each cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers). The network is behind a firewall for incoming connections. Only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS), and 2221 (SFTP) are opened to incoming traffic.

There are no exceptions for this rule, so any incoming web service requests, ETL jobs, or otherwise need to transact over one of these protocols. Outgoing TCP traffic isn’t behind a firewall. Outgoing UDP traffic is disallowed. For containers to be allowed to connect to each other, the following requirement must be met:

-   The containers must live in the same environment
-   You need to define an explicit relationship between the containers in your [app configuration](https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships)

All Dedicated projects are isolated and their data is fully encrypted. Should a security breach occur, Platform.sh follows a strict [security incident handling** procedure](https://docs.platform.sh/dedicated-gen-3/security.html#security-incident-handling-procedure) to deal with the issue as promptly and efficiently as possible.

### Encryption 

| AWS | GCP | Azure |
|--------|--------------------------|--------------------------------|
| AWS EBS Volumes are encrypted on Platform.sh, which means Dedicated Gen 3 and Dedicated Gen 2 sites are fully encrypted. Keys are managed by the AWS Key Management Service. AWS automatically rotates these keys every three years. In some cases, temporary storage (such as swap) is stored on unencrypted local storage volumes.| By default, data is encrypted using [Microsoft-Managed Keys](https://learn.microsoft.com/en-us/compliance/assurance/assurance-encryption) for Azure Blobs, Tables, Files, and Queues. | Data is encrypted using default encryption at rest. |


### Performance monitoring

All of our Dedicated clusters are monitored 24/7 to ensure uptime and to measure server metrics such as available disk space, memory and disk usage, and several dozen other metrics that give us a complete picture of the health of your application’s infrastructure.

A wide range of server metrics, including disk space, memory, and disk usage are continuously measured using in-house tools. These metrics provide a complete picture of the health of your application infrastructure. As soon as a metric goes out of bounds, Platform.sh Support and Operations teams are alerted. When an outage is detected, a Point in Time report is generated so Platform.sh Support can triage the cause of the outage.

#### Automated monitoring

On top of internal Platform.sh tools, a third-party availability monitoring system is configured for every Dedicated project. This further guarantees that issues are spotted and addressed as quickly as possible. If you’re using a CDN, [make sure it’s configured](/domains/cdn/_index.md#configure-your-cdn-to-support-high-sla) to support automated monitoring and guarantee high SLA.

Automated monitoring is used to keep an eye on your production environment at all times. If automated monitoring triggers an alert, or if a customer files an urgent priority ticket, an on-call engineer is immediately paged so they can respond and begin to triage the issue.
Cloud infrastructure issues are handled by the Platform.sh Customer Success team. Note that application problems are returned to the user and may be downgraded.

#### Observability services

As the official, in-house Platform.sh observability tool, [Blackfire](/increase-observability/integrate-observability/blackfire.md) provides unparalleled monitoring, profiling, and performance testing technologies. Using Blackfire on Platform.sh enhances your experience and allows you to enjoy greater support as well as unique upcoming features.

You can subscribe to Blackfire in two different ways:

-   As an Enterprise or Elite customer, you can sign up for the Platform.sh [Observability Suite](https://platform.sh/features/observability-suite/), which offers application performance monitoring by Blackfire packaged with infrastructure monitoring. The Observability Suite includes all Blackfire features, support, and usage that scales with your needs. To subscribe to the Observability Suite, [contact Sales](https://platform.sh/contact/).
-   All customers can also [subscribe to Blackfire](https://www.blackfire.io/pricing) separately. To get a quote based on the size of your cluster, [contact Sales](https://platform.sh/contact/). Note that if you subscribe to Blackfire separately, features and usage may cost more than the equivalent bundled in the Observability Suite.
Platform.sh also supports third-party observability services such as [New Relic](/increase-observability/integrate-observability/new-relic/_index.md and [Tideways](/increase-observability/integrate-observability/tideways.md). You need to get your own license for them. These third-party services have their own associated cost, are language-specific, and may not be available for all languages.

### Security incident monitoring

Should Platform.sh become aware of a security incident — such as an active or past hacking attempt, virus or worm, or data breach — senior personnel, including the CTO, are promptly notified.

The security incident procedure includes the following steps:

1.  Isolating the affected systems
2.  Collecting forensic evidence for later analysis, including a byte-for-byte copy of the affected systems
3.  Restoring normal operations

Once normal service is restored, a root cause analysis is performed to determine exactly what happened. Upon request, Platform.sh can provide you with a Reason for Outage report that summarizes the incident, cause, and steps taken.

Platform.sh cooperates with relevant law enforcement, and informs law enforcement in the event of an attempted malicious intrusion. Depending on the type of incident, the root cause analysis may be conducted by law enforcement rather than Platform.sh personnel.
Platform.sh endeavors to notify affected customers within 24 hours in case of a personal data breach and 72 hours in case of a project data breach.

Under the European General Data Protection Regulation (GDPR), Platform.sh is required to notify its supervising authority within 72 hours of a discovered breach that may result in risk to the rights and freedoms of individuals. The supervising authority for Platform.sh is the French [Commission Nationale de l’Informatique et des Libertés](https://www.cnil.fr/).

#### Audit trail 

As part of the security incident process, Platform.sh records a log of all steps taken to identify, isolate, and respond to the incident. This log may include:

-   A byte-for-byte copy of the affected systems
-   How the intrusion was detected
-   The steps taken to contain the intrusion
-   Any contact with third parties, including law enforcement
-   Any conclusions reached regarding the root cause