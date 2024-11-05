---
title: "{{% names/dedicated-environments %}} Development"
weight: 1
sidebarTitle: "DG3 Development"
layout: single
description:  "Learn about the cluster infrastructure of Dedicated Generation 3, and discover key details about deployment, which regions are supported and storage limits."
---

{{% description %}}

## Cluster infrastructure 

Like Grid and Dedicated Generation 2 (DG2), the architecture of Dedicated Generation 3 (DG3) is made up of clusters. Clusters in a DG3 environment can be imagined as a mini-Grid region that has no Ceph dependency, so it can run anywhere. 

DG3 cluster nodes function as entrypoint, coordinator, storage, and host all in one. These clusters usually only contain a single branch (default or optionally staging) while the remainder of the project remains on a Grid host. 

**IMAGE GOES HERE**

On a DG3 cluster, the services (mariadb, php, redis) run in Highly Available (HA) mode instead of as single, isolated applications. These clusters can be in either of your production or staging environments, with 3 hosts that run the following:

#### Containers

-   Router
-   Application
-   Services (as specified for the project)

#### Foundation

-   Coordinator agent
-   Host agent
-   Zookeeper

### HTTP clusters

With a HTTP connection, a cloud load balancer (ELB) sits in front of the hosts and, if Fastly is enabled, Fastly sits in front of the ELB. Therefore, the web request flow looks like this:

**IMAGE GOES HERE**

Not that unlike Grid, DG3 clusters do not have gateway instances, meaning that the entrypoint runs directly on the DG3 hosts that also serve the application and services. 

### SSH clusters

DG3 customers cannot SSH to the host that runs their containers, they can only access the containers. This connection is proxied through the Grid region and then to the DG3 cluster like in the diagram below:

**IMAGE GOES HERE**


In the diagram, there are only 3 hosts. Host 1 has both the entry point and app container, and the same goes for hosts 2 and 3. Each service is run on 3 High availability containers spread across each of the 3 dedicated hosts.

## Deployment

On Grid, all project branches are deployed into that same Grid region. On DG3, this behaves the same but the projects deployed are highly available (HA), and branches default and (optionally) staging are deployed into their own dedicated clusters instead.

{{< note title="Note" theme="info" >}}

Existing non-HA projects cannot be converted to HA projects and vice-versa. HA projects must be created as HA.

{{< /note >}}

## Regions

Unlike Grid, you can deploy into [any region](https://docs.platform.sh/development/regions.html#regions) of supported IaaS providers with a Dedicated Generation 3 environment. Currently, these regions are:

-   Amazon Web Services (AWS)
-   Microsoft Azure (Azure)
-   Google Cloud Platform (GCP)
-   OVHcloud (OVH) 

## Storage

Each Dedicated Gen 3 cluster comes with 50GB of storage per environment by default. This storage is intended for your data (databases, search indexes, user uploaded files, etc.) and you can subdivide it as you want. You can request more storage at any time.