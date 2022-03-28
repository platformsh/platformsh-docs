---
title: Monitor metrics
weight: 5
description: See all of the live infrastructure metrics available to give you an overview of resource usage.
aliases:
  - /dedicated/architecture/metrics.html
---

Platform.sh projects are accompanied by live infrastructure metrics that provide an overview of resource usage for environments.  

Within the console, metrics can be found for an environment under **Metrics**:

![A screenshot of what the metrics dashboard displays](/images/metrics/all.png "0.65")

The information under **Metrics** shows [usage metrics](#examples-of-how-to-read-metrics) for:

* [Dedicated environments](../dedicated/overview/_index.md):
  each of the three hosts in your [N+1 configuration](../dedicated/architecture/_index.md) and their average
* Grid environments: for the average of your service and app containers

## Default thresholds

All of the graphs show labels for the following thresholds:

* Usage that crosses _80%_ results in a **warning** label.
* Usage that crosses _90%_ results in a **critical** label.
* On Grid environments only, usage that crosses _100%_ results in a **burst** label.

  The burst capability is available for containerized environments
  and allows a container to get more resources than it's allocated.
  Burst is considered useful for infrequent activities that cause usage spikes,
  but these additional resources aren't guaranteed.

### Recommendations

The default thresholds aim to give you an idea of when your hosts/containers are close to running out of resources.
The impact differs based on your specific apps and service.
The values of the thresholds is purely informational.

#### Recommendations for Dedicated environments

For Dedicated environments, the thresholds are set for each host.
If the resources are high and hovering close to the 100% threshold,
you might want to consider:

* Optimizations (if possible)
* [Increasing your plan](../overview/pricing/_index.md)

#### Recommendations for Grid environments
  
For Grid environments, the thresholds are set for each container.
If the resources are high and hovering close to the 100% threshold,
you might want to consider:

* Optimizations (if possible)
* Changing the size of your [app](../configuration/app/app-reference.md#sizes)
  or [service](../configuration/services/_index.md#size) containers,
* [Increasing your plan](../overview/pricing/_index.md)

If your containers are in a prolonged burst state,
review your configuration or plan size because since burst isn't guaranteed for long periods.
If the burst threshold is triggered for short, infrequent activities,
it might not be an issue as long as the site is functioning properly.
Burst allows your container to use additional resources when they aren't required on the container's host.

## Time intervals

Measurements are taken for each metric _every ten seconds_ for Dedicated environments and _every 1 minute_ for Grid environments.
You can select a time frame over which to see these measurements for the entire **Metrics** view.
In the primary three views, averages are shown over larger intervals.

| View                                                                  | Time between measurements                     | Example                      |
| :-------------------------------------------------------------------- | :-------------------------------------------- | :--------------------------- |
| The last 15 minutes (*15m*)                                           | 10 seconds for Dedicated, 1 minute for Grid   | 10:00:10, 10:00:20, 10:00:30 |
| The last hour (*1hr*)                                                 | 1 minute                                      | 10:00, 10:01, 10:02          |
| The last 24 hours (*24hr*) for Dedicated and 8 hours (*8hr*) for Grid | 20 minutes for Dedicated, 10 minutes for Grid | 10:00, 10:20, 10:40, 11:00 |

To zoom in on smaller intervals, select specific ranges in a graph.

{{< video src="videos/metrics/metrics-zoom.mp4" >}}

The interval between measurements then changes based on the range you choose.

| View                  | Time between measurements                   |
| :-------------------- | :------------------------------------------ |
| < 30 minutes          | 10 seconds for Dedicated, 1 minute for Grid |
| 30 minutes to 2 hours | 1 minute                                    |
| 2 to 5 hours          | 5 minutes                                   |
| 5 to 8/24 hours       | 20 minutes                                  |

## Dedicated environments

For Dedicated environments, infrastructure metrics report CPU, RAM, and disk space per host and mount point.
The graphs differ when the environment has multiple clusters.

By default, the graphs include all hosts and an average over the hosts.
To select metrics for specific hosts, click **Filter**.

![Clicking Filter reveals a list of hosts you can filter](/images/metrics/filtering.png "0.4")

### Host IDs

The IDs for the hosts in the list for filtering do *not* match the IDs for interacting with a host,
such as for accessing the environment using SSH.

| Host ID under **Metrics** | SSH connection string under **Overview**                            |
| :------------------------ | :------------------------------------------------------------------ |
| `Host i-04353f1e6f`       | `ssh 3.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |
| `Host i-04d1ac8319`       | `ssh 2.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |
| `Host i-0b1e1b96cf`       | `ssh 1.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh` |

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
You can then match this ID with the one under **Metrics** for your investigations.

### Multiple clusters

Standard Dedicated environments have a single cluster of three hosts,
where each additional cluster adds at least three additional hosts to the project.
Dedicated environments with two clusters display metrics in two separate groups:
one for the web hosts that handle web requests and one for the service hosts that handle database, cache, and other services.

![Metrics split into Web hosts and Service hosts](/images/metrics/split-arch.png "0.75")

## Grid environments

Grid environments consist of:

* App containers: one or more [app containers](../configuration/app/_index.md)
* Service containers: zero or more [service containers](../configuration/services/_index.md)
* Worker containers: zero or more [worker instances](../configuration/app/app-reference.md#workers).

Infrastructure metrics report CPU, RAM, and disk space for app and worker containers
and CPU and disk space for service containers.

App containers are shown first, with the app name and an image corresponding to the app type.
Service containers follow next with the same pattern and worker containers are shown last.

You can collapse the graphs by clicking **Hide metrics**.
The graphs switch to an overview of the average resource utilization for the selected container.

![How app container metrics look when minimized](/images/metrics/app-container-minimized.png "0.65")

### Start metrics collection

To start collecting metrics on Grid environments, you need to redeploy the environment.
If a redeploy is required for the specific environment, you see a note in the console:

![Screenshot showing the text "Your metrics are almost here" and a prompt to redeploy](/images/metrics/metrics-redeploy-prompt.png "0.3")

## Examples of how to read metrics

These examples should give you an idea of how the metrics appear by environment type.
While architectural differences mean the data is represented differently depending on the environment type,
you always find metrics on usage of CPU, RAM, and disk space.

### Dedicated environment example

Dedicated environments metrics show the resource usage per host within the cluster.

This reference project has configured a single PHP application and three services: MySQL, Redis, and Solr.
It has been granted 4&nbsp;GB of memory and 2 vCPUs per host based on its plan.

![All of the metrics available for a Dedicated environment](/images/metrics/all.png "0.5")

#### CPU

The project has 2 virtual CPUs (vCPUs) allocated per host, as seen in the upper limit for the CPU metric.

![A closeup of the CPU metrics](/images/metrics/cpu.png "0.5")

#### RAM

RAM measures overall RAM usage, displaying the percentage of the RAM available for each host.

For this example, each host has been granted 4&nbsp;GB of memory.
The upper limit in the graph is 3.62&nbsp;GB because 0.38&nbsp;GB of memory are in use by the operating system.

![A closeup of the RAM metrics](/images/metrics/ram.png "0.5")

#### Disk

Disk represents the plan space for all services and mounts,
which for Dedicated production environments is [50&nbsp;GB](../dedicated/architecture/_index.md).

This example has the following persistent disk space configured:

* App: 9.78&nbsp;GB for the mount `exports`
* MySQL: 9.78&nbsp;GB
* Redis: no persistent disk

![All of the metrics for disks](/images/metrics/disk.png)

For each host, you first see metrics for the root (`/`) folder.
Utilizing this folder doesn't count against the 50&nbsp;GB set aside for your plan:
it's infrastructure disk, including the `/tmp` directory.
It's included in the metrics so you can keep track of build artifacts you write to `/tmp`
and make sure that they don't get too large and fill up.

Next to this space comes the other defined directories: for the MySQL service and the `exports` mount.

![A closeup of the metrics for the MySQL service disk](/images/metrics/disk-single.png "0.4")

### Grid environment example

Grid environment metrics show resource usage for each app, service, and worker container.

This reference project has configured a single application and two services: MySQL and Solr.
The plan size for this project is [Standard](https://platform.sh/pricing/).
The appropriate resources have been [allocated automatically](../configuration/app/app-reference.md#sizes) for each container
based on the number and type of containers for this plan size.
The graphs show the current average usage in relation to the allocated resources.

#### App container

Metrics graphs for the app container show CPU, RAM, and disk allocation and usage.
The persistent disk has been configured in the [app configuration](../configuration/app/app-reference.md#top-level-properties)
at 14.36&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the app container](/images/metrics/app-container.png)

#### Service containers

##### MySQL

Metrics graphs for the MySQL service container show CPU and disk allocation and usage.
The persistent disk has been configured in the [services configuration](../configuration/services/_index.md) as 1.91&nbsp;GB,
while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the MySQL container](/images/metrics/mysql-container.png)

##### Solr

Metrics graphs for the Solr service container show CPU and disk allocation and usage.
The persistent disk has been configured in the [services configuration](../configuration/services/_index.md) as 0.48&nbsp;GB,
while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the Redis container](/images/metrics/redis-container.png)
