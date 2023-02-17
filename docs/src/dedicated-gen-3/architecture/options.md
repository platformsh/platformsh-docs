---
title: "Options"
weight: 4
---

## Multiple applications

{{% multi-app-intro %}}

For more information, see how to [configure multiple apps in a single project](../../create-apps/multi-app.md).

## Multiple-AZ

The default configuration for Dedicated clusters is to launch into a single Availability Zone (AZ).
This is for a few reasons:

- Because the members of your cluster communicate with each other via TCP to perform DB replication, cache lookup, and other associated tasks, the latency between data centers/AZs can become a significant performance liability.
Having your entire cluster within one AZ ensures that the latency between cluster members is minimal, having a direct effect on perceived end-user performance.
- Network traffic between AZs is billed, whereas intra-AZ traffic isn't.
That leads to higher costs for this decreased performance.

Some clients prefer the peace of mind of hosting across multiple AZs, but it should be noted that multiple-AZ configurations do not improve the contractual 99.99% uptime SLA, nor does our standard, single-AZ configuration decrease the 99.99% uptime SLA.
We are responsible for meeting the 99.99% uptime SLA no matter what, so multiple-AZ deployments should only be considered in cases where it is truly appropriate.

Multi-AZ deployments are available only on select AWS regions.