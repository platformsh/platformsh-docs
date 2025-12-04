---
title: "Monitor {{% names/dedicated-gen-2 %}} metrics"
sidebarTitle: "{{% names/dedicated-gen-2 %}} metrics"
description: "Understand how to read metrics for {{% names/dedicated-gen-2 %}} environments."
---

For {{% names/dedicated-gen-2 %}} environments, infrastructure metrics report CPU, RAM, and disk space per host and mount point.
The graphs differ when the environment has multiple clusters.

Metrics are available for Production environments and [Grid environments](/increase-observability/metrics/grid.md) (such as your preview environments).
They aren't available for other {{% names/dedicated-gen-2 %}} environments (such as a staging environment).

By default, the graphs include all hosts and an average over the hosts.
To select metrics for specific hosts, click **Filter**.

![Clicking Filter reveals a list of hosts you can filter](/images/metrics/DG2-filter-metrics.png "0.4")

## Host IDs

The IDs for the hosts in a list for metrics filtering will *not* match the IDs for interacting with a host, such as for accessing the environment using SSH. For example:

| Host ID under **Metrics** | SSH connection string under **Overview**                            |
| :------------------------ | :------------------------------------------------------------------ |
| `Host i-04353f1e6f`       | `ssh 3.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |
| `Host i-04d1ac8319`       | `ssh 2.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |
| `Host i-0b1e1b96cf`       | `ssh 1.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |

To get the host ID from an SSH connection, SSH into the host:

```bash
ssh 3.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh
```

You get output similar to the following:

```bash

 Welcome to {{% vendor/name %}}.

 This is environment production-qwerty8 of project abcde3clusterID.

abcde3clusterID@i-04d1ac8319f6ab9a6:~$
```

The relevant string for the host ID is shown after the `@` and before the 7-character string at the end (`f6ab9a6`).
In this example, the ID is: `i-04d1ac8319`.
You can then match this ID with the one under **Metrics** for your investigations.

## Multiple clusters

Standard {{% names/dedicated-gen-2 %}} environments have a single cluster of three hosts,
where each additional cluster adds at least three additional hosts to the project.
{{% names/dedicated-gen-2 %}} environments with two clusters display metrics in two separate groups:
one for the web hosts that handle web requests and one for the service hosts that handle database, cache, and other services.

![Metrics split into Web hosts and Service hosts](/images/metrics/DG2-multiple-clusters.png "0.75")

## Example of how to read metrics

This example should give you an idea of how the metrics appear.
{{% names/dedicated-gen-2 %}} environments metrics show the resource usage per host within the cluster.

This reference project has a single PHP application and three services: MySQL, Redis, and Solr.

The metrics below are for a single Production environment.

Once you've read the metrics, see [recommendations for action](/increase-observability/metrics/_index.md#dedicated-gen-2-environments).

![All of the metrics available for a {{% names/dedicated-gen-2 %}} environment](/images/metrics/DG2-how-to-read-metrics.png)

### CPU

The project has 8 virtual CPUs allocated per host, as seen in the upper limit for the CPU metric.

![A closeup of the CPU metrics](/images/metrics/DG2-CPU.png)

### RAM

RAM measures overall RAM usage, displaying the percentage of the RAM available for each host.

For this example, each host has been granted 30.69&nbsp;GB of memory. 9.3% of that memory has been used.

![A closeup of the RAM metrics](/images/metrics/DG2-RAM.png)

### Disk

Disk represents the plan space for all services and mounts,
which for {{% names/dedicated-gen-2 %}} production environments is [50&nbsp;GB](/dedicated-environments/dedicated-gen-2/overview.md).

This example has the following persistent disk space configured:

* App: 14.68&nbsp;GB for the mount `exports`
* MySQL: 9.78&nbsp;GB
* Root (`/`) folder: 58.88&nbsp;GB

![All of the metrics for disks](/images/metrics/DG2-disks.png)

For each host, you first see metrics for the root (`/`) folder.
Utilizing this folder doesn't count against the space set aside for your plan:
it's infrastructure disk, including the `/tmp` directory.
It's included in the metrics so you can keep track of build artifacts you write to `/tmp`
and make sure that they don't get too large and fill up.

Next to this space comes the other defined directories: for the MySQL service and the `exports` mount.

![A closeup of the metrics for the MySQL service disk](/images/metrics/DG2-mysql-disk.png "0.4")
