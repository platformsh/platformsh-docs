---
title: "Resource and incident monitoring"
weight: 2
sidebarTitle: "Incident monitoring"
description: Learn how {{% vendor/name %}} monitors your clusters and handles availability incidents. 
---

{{% vendor/name %}} monitors Dedicated clusters 24/7 to maintain uptime and performance.

A wide range of server metrics, including disk space, memory, and disk usage are continuously measured using in-house tools.
These metrics provide a complete picture of the health of your application infrastructure.

As soon as a metric goes out of bounds, {{% vendor/name %}} Support and Operations teams are alerted.
When an outage is detected, a Point in Time report is generated
so {{% vendor/name %}} Support can triage the cause of the outage.

On top of internal {{% vendor/name %}} tools,
a third-party availability monitoring system is configured for every Dedicated project.
This further guarantees that issues are spotted and addressed as quickly as possible.

If you're using a CDN, [make sure it's configured](../domains/cdn/_index.md#configure-your-cdn-to-support-high-sla)
to support automated monitoring and guarantee high SLA.

## Application performance monitoring

As the official, in-house {{% vendor/name %}} observability tool, [Blackfire](../../increase-observability/integrate-observability/blackfire.md) provides unparalleled monitoring, profiling, and performance testing technologies.
Using Blackfire on {{% vendor/name %}} enhances your experience
and allows you to enjoy greater support as well as unique upcoming features.

You can subscribe to Blackfire in two different ways:

- As an Enterprise or Elite customer,
  you can sign up for the {{% vendor/name %}} [Observability Suite](https://platform.sh/features/observability-suite/),
  which offers application performance monitoring by Blackfire packaged with infrastructure monitoring.
  The Observability suite includes all Blackfire features, support, and usage that scales with your needs.
  To subscribe to the Observability Suite, [contact Sales](https://platform.sh/contact/).

- All customers can also [subscribe to Blackfire](https://www.blackfire.io/pricing) separately.
  To get a quote based on the size of your cluster, [contact Sales](https://platform.sh/contact/).
  Note that if you subscribe to Blackfire separately,
  features and usage may cost more than the equivalent bundled in the Observability Suite.

{{% vendor/name %}} also supports third-party observability services
such as [New Relic](../increase-observability/integrate-observability/new-relic/_index.md)
and [Tideways](../increase-observability/integrate-observability/tideways.md).
You need to get your own license for them.
These third-party services have their own associated cost,
are language-specific, and may not be available for all languages.

## Availability incident handling procedure

Automated monitoring is used to keep an eye on your production environment at all times.
If automated monitoring triggers an alert, or if a customer files an urgent priority ticket,
an on-call engineer is immediately paged so they can respond and begin to triage the issue.

Cloud infrastructure issues are handled by the {{% vendor/name %}} Customer Success team.
Note that application problems are returned to the user and may be downgraded.

![Diagram of the {{% vendor/name %}} availability incident handling procedure](/images/dedicated/incident-monitoring.svg "0.4")