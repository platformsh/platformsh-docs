---
title: Project isolation
description: Learn how project isolation is handled at {{% vendor/name %}}
---

At {{% vendor/name %}}, customer environments are strictly isolated from each other using [namespaces](https://man7.org/linux/man-pages/man7/namespaces.7.html), [seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html), and [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html).
Persistent data (uploaded files into mounts, database data, etc.) is stored on a region-wide storage layer.
Data is stored redundantly and mounted into the environments on deployment.

Network is behind a firewall for incoming connections.
Only a few ports are opened to incoming traffic: ports 22, 80, and 443.

There are no exceptions, so any incoming web service requests,
[ETL](https://aws.amazon.com/what-is/etl/#:~:text=Extract%2C%20transform%2C%20and%20load%20%28,and%20machine%20learning%20%28ML%29%29.) jobs,
or otherwise need to transact over one of these protocols.

Outgoing TCP traffic isn’t behind a firewall,
**with the exception of port 25 which is blocked**. 

For containers to be allowed to connect to each other, the following requirements must be met:

- The containers must live in the same environment.
- You need to define an explicit relationship between the containers in your app configuration.