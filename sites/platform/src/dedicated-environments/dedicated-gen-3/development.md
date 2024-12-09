---
title: "Dedicated Gen 3 Development"
weight: 1
sidebarTitle: "DG3 development"
layout: single
description:  "Learn about the cluster infrastructure of Dedicated Generation 3, and discover key details about deployment, which regions are supported and storage limits."
---

Learn about the [cluster infrastructure](#cluster-infrastructure) of Dedicated Generation 3, and discover key details about [deployment](#deployment), which [regions](#providers-and-regions) are supported and [storage limits](#storage).

## Cluster infrastructure 

Clusters in a DG3 environment can be imagined as a mini-Grid region that has no [Ceph](/glossary.md#ceph) dependency, so it can run anywhere. The cluster nodes function as entrypoint, coordinator, storage and host all in one. These clusters usually only contain a single branch while the remainder of the project remains on a Grid host. 

For more information about the Dedicated clusters, visit [Dedicated Gen 2 Development](/dedicated-environments/dedicated-gen-2/development.md#cluster-infrastructure).

![Dedicated cluster architecture](/images/dedicated/cluster-infrastructure.svg "0.50")

On a DG3 cluster, the services (MariaDB, PHP, Redis) run in Highly Available (HA) mode instead of as single, isolated applications. These clusters can be in either of your production or staging environments.

### HTTP clusters

With a HTTP connection, a cloud load balancer sits in front of the hosts and, if Fastly is enabled, Fastly sits in front of the cloud load balancer. Therefore, the web request flow looks like this:

![HTTP cluster architecture](/images/dedicated/http-cluster.svg "0.50")

### SSH clusters

On DG3, customers have direct access to the application containers. This connection is proxied through the Grid region and then to the DG3 cluster like in the diagram below:

![SSH cluster architecture](/images/dedicated/ssh-cluster.svg "0.50")

In the diagram, there are only 3 hosts. Host 1 has both the entry point and app container, and the same goes for hosts 2 and 3. Each service is run on 3 High availability containers spread across each of the 3 dedicated hosts.

## Deployment

On Grid, all project branches are deployed into that same Grid region. On DG3, this behaves the same but the projects deployed are Highly Available (HA), and branches set as default and (optionally) labelled staging are deployed into their own dedicated clusters instead. 

While HA environments connected to a DG3 cluster **can** deploy multiple instances of applications and services, they **cannot** dynamically change the number of those instances (for example, from 1 to 3 or 3 to 1).

{{< note title="Note" theme="info" >}}

Existing non-HA projects cannot be converted to HA projects and vice-versa. HA projects must be created as HA.

{{< /note >}}


## Providers and regions

Unlike Grid, you can deploy into [any region](/development/regions.md#regions) of supported IaaS providers with a Dedicated Generation 3 environment. Currently, these providers are listed below:

-   Amazon Web Services (AWS)
-   Microsoft Azure (Azure)
-   Google Cloud Platform (GCP)
-   OVHcloud (OVH) 

For more details on specific regions, consult the region [documentation](/development/regions.md#regions).

## Storage

Each Dedicated Gen 3 cluster comes with 50GB of storage per environment by default. This storage is intended for your data (databases, search indexes, user uploaded files, etc.) and you can subdivide it as you want. Additional storage can be purchased and added to your cluster at any time.  
