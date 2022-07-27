---
title: "Platform.sh Dedicated"
weight: 1
sidebarTitle: "Overview"
layout: single
description: |
  Platform.sh Dedicated is a robust, redundant layer on top of Platform.sh Professional. It is well-suited for those who like the Platform.sh development experience but need more resources and redundancy for their production environment. It is available only with an Enterprise contract.
---

{{% description %}}

Platform.sh Dedicated consists of two parts: The Development Environment and the Dedicated Cluster.

## The Development Environment

The Development Environment is a normal Platform.sh Grid account,
with all of the capabilities and workflows of Platform.sh Professional.
The default branches are slightly different, as noted in the [default limits](/dedicated/architecture/development.md#default-limits).

## The Dedicated Cluster

The Dedicated Cluster is a three-Virtual Machine redundant configuration provisioned by Platform.sh for each customer.
Every service is replicated across all three virtual machines in a failover configuration (as opposed to sharding),
allowing a site to remain up even if one of the virtual machines is lost entirely.

The build process for your application is identical for both the Development Environment and the Dedicated Cluster.
However, because the virtual machines are provisioned by Platform.sh, not as a container,
service configuration must be done by Platform.sh's Customer Success team.
By and large the same flexibility is available but only via filing a support ticket.
