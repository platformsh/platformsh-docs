---
title: "Platform.sh Dedicated cluster specifications"
weight: 2
layout: single
sidebarTitle: "Features"
description: |
  Platform.sh Dedicated clusters are launched into a Triple Redundant configuration consisting of 3 virtual machines (VMs). This is an N+1 configuration that is sized to withstand the total loss of any one of the 3 members of the cluster without incurring any downtime.
---

{{< description >}}

Each instance hosts the entire application stack, allowing this architecture superior fault tolerance to traditional N-Tier installations. Moreover, the Cores assigned to production are solely for production.

## Storage

Each Dedicated cluster comes with 50GB of storage per environment by default.  This storage is intended for customer data - databases, search indexes, user uploaded files, etc. - and can be subdivided in any way that the customer wishes.  50GB is only the default amount; more storage can be added easily as a line item in the contract and can be added at anytime that the project requires: at contract renewal or at any point in the term.

Default storage is based on the default SSD block-storage offering for each cloud. Extra provisioned IOPS can be discussed with your sales representative.

## Accessing services

Your application will be able to connect to each service by referencing the exact same environment variables as a Grid environment.  While the configuration of the service will be performed by our team, the application configuration is the same and your code should be the same.  See the [services documentation](/configuration/services/_index.md) for service-specific details.  Note that not all services and languages are available in a Dedicated environment.
