---
title: Project isolation
description: Learn how project isolation is handled at {{% vendor/name %}}
---

{{% vendor/name %}} handles project isolation slightly differently based on which underlying architecture your project lives on.

**Dedicated projects:** All clusters are single-tenant.
They provide three hosts that are exclusively used by a single customer.
Each cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers).

**Grid projects:** A single host may run multiple projects from multiple customers.
Customer environments are strictly isolated from each other using [namespaces](https://man7.org/linux/man-pages/man7/namespaces.7.html),
[seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html),
and [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html).
Persistent data (uploaded files into mounts, database data, etc.) is stored on a region-wide storage layer.
Data is stored redundantly and mounted into the environments on deployment.

For both Dedicated and Grid projects, network is behind a firewall for incoming connections.
Only a few ports are opened to incoming traffic:

| Architecture                  | Ports opened to incoming traffic                               |
| ----------------------------- | -------------------------------------------------------------- |
| {{% names/dedicated-gen-2 %}} | - 22 (SSH)</br>- 80 (HTTP)</br>- 443 (HTTPS)</br>- 2221 (SFTP) | 
| {{% names/dedicated-gen-3 %}} | - 22 (SSH)</br>- 80 (HTTP)</br>- 443 (HTTPS)                   |
| Grid                          |  ???     |

There are no exceptions, so any incoming web service requests,
[ETL](https://aws.amazon.com/what-is/etl/#:~:text=Extract%2C%20transform%2C%20and%20load%20%28,and%20machine%20learning%20%28ML%29%29.) jobs,
or otherwise need to transact over one of these protocols.

Outgoing TCP traffic isn’t behind a firewall,
**with the exception of port 25 which is blocked**. 

For containers to be allowed to connect to each other, the following requirements must be met:

- The containers must live in the same environment.
- You need to define an explicit relationship between the containers in your app configuration.