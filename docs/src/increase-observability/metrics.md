---
title: Monitor metrics
weight: 5
description: See all of the live infrastructure metrics available to give you an overview of resource usage.
aliases:
  - /dedicated/architecture/metrics.html
---

All projects come with live infrastructure metrics to give you an overview of resource usage.

Metrics for a given environment can be found in the console for that environment under **Metrics**:

![Metrics dashboard](/images/metrics/all.png "0.65")

This page shows [usage metrics](#examples-of-how-to-read-metrics) for the CPU, RAM, and persistent disk for:

* [Dedicated environments](../dedicated/overview/_index.md):
  each of the three hosts in your [N+1 configuration](/dedicated/architecture/_index.md) and their average
* Other environments: each of your service and app containers

For each property, usage that crosses an _80% threshold_ triggers a warning message on the graph.
Usage that crosses _90%_ results in a critical message.
If your usage goes over _100%_ and resources are overutilized, a **burst** message is shown.
A burst is a good indication that you need to optimize your application,
potentially adding more resources or storage to your project to comfortably run your application.
Consider reviewing your code and project plan as the next steps.

Measurements are taken for each metric *every ten seconds*,
and you can select a time frame to view those samples at the start of the page.
In the primary three views, averages are shown over larger intervals.

| View                         | Sample average                    | Example                        |
| :--------------------------- | :-------------------------------- | :----------------------------- |
| The last 15 minutes (*15m*)  | 10 seconds                        | 10:00:10, 10:00:20, 10:00:30   |
| The last hour (*1hr*)        | 1 minute                          | 10:00, 10:01, 10:02            |
| The last 24 hours (*24hr*) for Dedicated environments and 8 hours (*8hr*) otherwise   | 20 minutes for Dedicated, 10 minutes otherwise                    | 10:00, 10:20, 10:40, 11:00     |

You can select specific ranges in a graph to zoom in on smaller sample intervals.

{{< video src="videos/metrics/metrics-zoom.mp4" >}}

The sample interval then changes based on the range you choose.

| View                  | Sample average |
| :-------------------- | :------------- |
| < 30 minutes          | 10 seconds     |
| 30 minutes to 2 hours | 1 minute       |
| 2 to 5 hours          | 5 minutes      |
| 5 to 8/24 hours       | 20 minutes     |

## Details for Dedicated environments

To view metrics only for specific hosts, click **Filter**.

![Clicking Filter reveals a list of hosts you can filter](/images/metrics/filtering.png "0.4")

### Host IDs

The IDs for the hosts in the list for filtering do *not* match the IDs for interacting with a host,
such as for accessing the environment using SSH.

| Host ID on Metrics page | SSH connection string on Overview page                              |
| :---------------------- | :------------------------------------------------------------------ |
| `Host i-04353f1e6f`     | `ssh 3.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |
| `Host i-04d1ac8319`     | `ssh 2.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |
| `Host i-0b1e1b96cf`     | `ssh 1.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |

To get the host ID from an SSH connection, SSH into the host:

```bash
$ ssh 3.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh

 ___ _      _    __                    _
| _ \ |__ _| |_ / _|___ _ _ _ __    __| |_
|  _/ / _` |  _|  _/ _ \ '_| '  \ _(_-< ' \
|_| |_\__,_|\__|_| \___/_| |_|_|_(_)__/_||_|


 Welcome to Platform.sh.

 This is environment production-qwerty8 of project abcde3clusterID.

abcde3clusterID@i-04d1ac8319f6ab9a6:~$ 
```

The relevant string for the host ID is shown after the `@` and before the 7-character string at the end (`f6ab9a6`).
In this case, the ID is: `i-04d1ac8319`.
You can then match this ID with the one on the Metrics page for your investigations.

### Multiple clusters

Standard Dedicated environments have a single cluster of three hosts,
where each additional cluster adds at least three additional hosts to the project.
Dedicated environments with two clusters have a split architecture and their metrics are displayed in two separate groups:
one for the web hosts that handle web requests and one for the service hosts that handle database, cache, and other services.

![Metrics split into Web hosts and Service hosts](/images/metrics/split-arch.png "0.75")

## Details for other environments

Environments that aren't Dedicated environments consist of:

* App containers: one or more [app containers](../configuration/app/_index.md)
* Service containers: zero or more [service containers](../configuration/services/_index.md)
* Worker containers: zero or more worker instances.

The Metrics page shows app containers first, with the app name and an image for the app type.
Service containers follow next with the same pattern and worker containers are shown last.

For ease of navigation, you can collapse the graphs by clicking **Hide metrics**.
The graphs switch to an overview of the average resource utilization for the selected container.

![How app container metrics look when minimized](/images/metrics/app-container-minimized.png "0.65")

## Examples of how to read metrics

These examples should give you an idea of what the various metrics mean.
They've been set up with a single application connected to two services: Redis and MariaDB.

For each environment, you can find metrics on the CPU, RAM, and disk space,
but the way they're presented differs slightly based on whether or not it's a Dedicated environment.

For RAM and disk space, you see available thresholds *after* the resources used by the operating system have been subtracted.

### Dedicated environment

This reference project has configured a single application and two services: Redis and MariaDB.

![All of the metrics available for a Dedicated environment](/images/metrics/all.png "0.5")

#### CPU

The project has 2 virtual CPUS (vCPUs) allocated per host, as seen in the upper limit for the CPU metric.

![A closeup of the CPU metrics](/images/metrics/cpu.png "0.5")

#### RAM

RAM measures overall RAM usage, displaying the percentage of the RAM available for each host.

For this example, each host has been granted 4GB of memory.
The upper limit in the graph is 3.62GB because 0.38 GB of memory are in use by the operating system.

![A closeup of the RAM metrics](/images/metrics/ram.png "0.5")

#### Disk

Disk represents the plan space for all services and mounts,
which for Dedicated production environments is [50GB](/dedicated/architecture/_index.md).

This example has the following persistent disk space configured:

* App: 1024 MB for the mount `exports`
* MySQL: 2048 MB
* Redis: no persistent disk

![All of the metrics for disks](/images/metrics/disk.png)

For each host, you first see metrics for the root (`/`) folder.
Utilizing this folder doesn't count against the 50GB set aside for your plan:
it's infrastructure disk, including the `/tmp` directory.
It's included in the metrics so you can keep track of build artifacts you write to `/tmp`
and make sure that they don't get too large and fill up.

Next to this space comes the other defined directories: for the MySQL service and the `exports` mount.

![A closeup of the metrics for the MySQL service disk](/images/metrics/disk-single.png "0.4")

### Other environments

This reference project has configured a single application and two services: Redis and MariaDB.
The plan size for this project is [X-Large](https://platform.sh/pricing/),
which has guaranteed resources of 8.22 vCPU/12.2 GB RAM.
The appropriate resources have been [allocated automatically](../configuration/app/size.md) for each container
based on the number and type of containers for this plan size.
The graphs show the current average usage in relation to the allocated resources.

#### App container

The app container has been granted 0.75 GB of memory and 5.00 CPU.
The persistent disk has been configured in the [app configuration](../configuration/app/_index.md) at 144.12 GB,
while the temporary disk is 3.99 GB by default.

![All of the metrics for the app container](/images/metrics/app-container.png)

#### Service containers

##### MySQL

The MySQL service container has been granted 10.25 GB of memory and 3.00 CPU.
The persistent disk has been configured in the [services configuration](../configuration/services/_index.md) 4.74GB (5000MB),
while the temporary disk is 3.99 GB by default.

![All of the metrics for the MySQL container](/images/metrics/mysql-container.png)

##### Redis

The Redis service container has been granted 1.00 GB of memory and 0.20 CPU.
No persistent disk has been configured in the [services configuration](../configuration/services/_index.md),
while the temporary disk is 3.99 GB by default.

![All of the metrics for the Redis container](/images/metrics/redis-container.png)
