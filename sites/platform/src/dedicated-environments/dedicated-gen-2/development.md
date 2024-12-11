---
title: "Dedicated Gen 2 Development"
weight: 1
sidebarTitle: "DG2 development"
description: "Learn about the cluster infrastructure of Dedicated Generation 2, and discover key details about split architecture, deployment, storage limits and memory."

---

Learn about the [cluster infrastructure](#cluster-infrastructure) of Dedicated Generation 2, and discover key details about [split architecture](#split-architecture), [deployment](#deployment), [storage limits](#storage) and [memory](#memory).

### Cluster infrastructure

Dedicated Gen 2 clusters (sometimes referred to below as DG2) are launched into a Triple Redundant configuration consisting of 3 hosts. This is an N+1 configuration that’s sized to withstand the total loss of any one of the 3 members of the cluster without incurring any downtime. Every service is replicated across all three hosts in a failover configuration (as opposed to sharding), allowing a site to remain up even if one of the hosts is lost entirely.

Each instance hosts the entire application stack, allowing this architecture superior fault tolerance to traditional N-Tier installations. Moreover, the Cores assigned to production are solely for production. 

##### Build process

The build process for your application is identical for both the Grid Environment and the Dedicated Gen 2 cluster. However, because the hosts are provisioned by Platform.sh, not as a container, service configuration must be done by Platform.sh’s Customer Success team. 

For more information, learn about [default storage settings](#storage) and how your app can [connect to services](dedicated-environments/dedicated-gen-3/overview.md#available-services).

### Split architecture

Split architecture works under Dedicated Generation 2 and allows you to give more resources globally to a project. Services (data services, caching service or search engines) are split from application runtimes. Services will be running on a cluster of core nodes, and the application will be running on a cluster of web nodes.

This allows us to grant more room for the application or the services regarding resources. Both clusters can differ in size. Split architecture clusters can horizontally scale the application by adding additional nodes. 

![Split architecture](/images/dedicated/split-architecture.svg "0.50")

### Deployment

The production branch of your Git repository is designated for production and a staging branch is designated for staging. Any code merged to those branches automatically triggers a rebuild of the production or staging environment in the Dedicated Gen 2 cluster. 

Any defined users or environment variables are also propagated to the Dedicated Gen 2 cluster.

{{< note title="Note" theme="info" >}}

There is no automatic cloning of data from the Dedicated Gen 2 cluster to the development environments like there is between the grid-based development branches. 

{{< /note >}} 

Production data may still be replicated to the development environment [manually](https://docs.platform.sh/administration/cli/reference.html#environmentsynchronize). Deployments of other branches don’t trigger rebuilds of the Dedicated Gen 2 cluster Environments.

#### Deployment process 

When deploying to the Dedicated Gen 2 cluster the process is slightly different than when working with Platform.sh on the Grid.

-   The new application image is built in the exact same fashion as for the Grid.
-   Any active background tasks on the cluster, including cron tasks, are terminated.
-   The cluster (production or staging) is closed, meaning it doesn’t accept new requests. Incoming requests receive an HTTP 503 response.
-   The application image on all three servers is replaced with the new image.
-   The deploy hook is run on one, and only one, of the three servers.
-   The cluster is opened to allow new requests.

The deploy usually takes approximately 30-90 seconds, although that is dependent on how your deploy hook has been configured.

During the deploy process the cluster is unavailable. All Dedicated Gen 2 instances are fronted by the Fastly Content Delivery Network (CDN) unless you decide to bring your own CDN. You can also decide that you'd rather not use Fastly. Fastly can be configured to allow a “grace period”, meaning that requests to the origin that fail are served from the existing cache, even if that cache item is stale. We configure a default grace period that is longer than a typical deployment, and can extend that time upon request. That means anonymous users should see no interruption in service at all. Authenticated traffic that can’t be served by the CDN still sees a brief interruption.

For more information about deployment, see the [overview of the build and deploy phases](/learn/overview/build-deploy.md).

### Storage

The development environment for a Dedicated Gen 2 project provides production and staging branches linked to the Dedicated Gen 2 cluster and 3 additional active environments for development. This number can be increased if needed for an [additional fee](https://platform.sh/pricing/). 

The default storage for Dedicated Gen 2 contracts is 50GB per environment (production, staging, and each development environment). This comprises total storage for your project and is inclusive of any databases, uploaded files, writable application logging directories, search index cores, and so on. The storage amount for your development environment reflects the amount in your Enterprise contract and can be altered based on the terms you agree.

A project may have up to six users associated with it at no additional charge. Additional users may be added for an additional fee. These users have access to both the development environment and the Dedicated Gen 2 cluster.

{{< note title="Note" theme="info" >}}

While your DG2 production and staging Environments are on dedicated virtual machines, your development environments run on the [Grid](/glossary.md#grid). This means that, by default, all containers in development environments are standard sized, as they have limited traffic needs. For more resource-intensive applications this size can be increased for an additional fee.

{{< /note >}}

### Memory

Dedicated Generation 2 includes a single node dedicated staging with 2 CPUs. This runs the same software configuration as the production cluster but only on a single node. This is usually enough for functional testing before moving to production. You can choose to upgrade your staging to a more powerful machine or add more than one dedicated staging system. Those will still be a single machine.
