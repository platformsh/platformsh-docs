---
title: "{{% names/dedicated-gen-2 %}}"
weight: 1
sidebarTitle: "Overview"
layout: single
description:  "{{% names/dedicated-gen-2 %}} is a robust, redundant layer. It's well-suited for those who like the {{% vendor/name %}} development experience but need more resources and redundancy for their production environment. It's available only with an Enterprise contract."
---

{{% description %}}

{{% names/dedicated-gen-2 %}} consists of two parts: a Development Environment and a {{% names/dedicated-gen-2 %}} cluster.

## The Development Environment

The Development Environment is a normal Grid environment with all Grid capabilities and workflows.
The default branches are slightly different, as noted in the [default limits](../architecture/development.md#default-limits).

## The {{% names/dedicated-gen-2 %}} cluster

The {{% names/dedicated-gen-2 %}} cluster is a three-host redundant configuration provisioned by {{% vendor/name %}} for each customer.
Every service is replicated across all three hosts in a failover configuration (as opposed to sharding),
allowing a site to remain up even if one of the hosts is lost entirely.

The build process for your application is identical for both the Development Environment and the {{% names/dedicated-gen-2 %}} cluster.
However, because the hosts are provisioned by {{% vendor/name %}}, not as a container,
service configuration must be done by {{% vendor/name %}}'s Customer Success team.
By and large the same flexibility is available but only via opening a [support ticket](/learn/overview/get-support).
