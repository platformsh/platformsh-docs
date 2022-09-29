---
title: "{{% names/dedicated-gen-2 %}} cluster specifications"
weight: 2
layout: single
sidebarTitle: "Features"
description: |
  {{% names/dedicated-gen-2 %}} clusters are launched into a Triple Redundant configuration consisting of 3 virtual machines (VMs). This is an N+1 configuration that is sized to withstand the total loss of any one of the 3 members of the cluster without incurring any downtime.
aliases:
  - /dedicated/architecture.html
---

{{% description %}}

Each instance hosts the entire application stack, allowing this architecture superior fault tolerance to traditional N-Tier installations. Moreover, the Cores assigned to production are solely for production.

## Storage

Each {{% names/dedicated-gen-2 %}} cluster comes with 50GB of storage per environment by default.
This storage is intended for your data -- databases, search indexes, user uploaded files, and so on -- and can be subdivided in any way you want.
50GB is only the default amount; more storage can be added as a line item in the contract and can be added at anytime that the project requires: at contract renewal or at any point in the term.

Default storage is based on the default SSD block-storage offering for each cloud. Extra provisioned IOPS can be discussed with your sales representative.

## Accessing services

Your application can connect to each service by referencing the exact same environment variables as a Grid environment.
While the configuration of the service is performed by Platform.sh, the app configuration is the same and your code should be the same.
See the [services documentation](../../add-services/_index.md) for service-specific details.
Note that not all services and languages are available in a {{% names/dedicated-gen-2 %}} environment.
