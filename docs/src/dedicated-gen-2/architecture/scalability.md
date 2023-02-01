---
title: "Scalability"
weight: 5
description: Part of the original design goal of Platform.sh’s Triple Redundant Architecture was to ensure scalability in times of load spikes outside of the bounds of the original traffic specs.  Because the cluster is configured as an N+1 architecture, we can respond to legitimate traffic events by removing a node from the cluster, upsizing it, returning it into rotation, and then repeating the process on the next node in turn.
---

{{% description %}}

For more information on how Dedicated projects are scaled,
see the Platform.sh [scaling process and procedure](../../dedicated-gen-3/architecture/scalability.md#scaling-process-and-procedure).