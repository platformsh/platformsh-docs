---
title: Project isolation
description: Learn how project isolation is handled at {{% vendor/name %}}
---

{{% vendor/name %}} handles project isolation slightly differently based on which underlying architecture your project lives on.

{{< codetabs >}}
+++
title=Grid
+++

On the Grid, a single host may run multiple projects from multiple customers.
Customer environments are strictly isolated from each other using [namespaces](https://man7.org/linux/man-pages/man7/namespaces.7.html),
[seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html),
and [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html).

Persistent data (uploaded files into mounts, database data, etc.) is stored on a region-wide storage layer.
Data is stored redundantly and mounted into the environments on deployment.

<--->
+++
title=Dedicated 
+++

All {{% names/dedicated-gen-2 %}} and {{% names/dedicated-gen-3 %}} clusters are single-tenant.
They provide three hosts that are exclusively used by a single customer.

Each cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers).

{{< /codetabs >}}

**For all projects**, regardless of the underlying architecture:

- The network is behind a firewall for incoming connections.
  Only a few ports are opened to incoming traffic by default: ports 22, 80, and 443.

- Outgoing TCP traffic is not blocked, **with the exception of port 25**.

- Both incoming and outgoing UDP traffic is blocked.

{{% note %}}

For containers to be allowed to connect to each other, the following requirements must be met:

- The containers must live in the same environment.
- You need to define an explicit relationship between the containers in your app configuration.

{{% /note %}}