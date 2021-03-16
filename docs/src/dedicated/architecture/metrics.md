---
title: "Metrics and observability"
weight: 3
sidebarTitle: "Metrics"
description: |
  Every dedicated project on Platform.sh comes with live infrastructure metrics, which provide an overview of the production environment's resource usage. 
---

{{< description >}}

Within the management console, metrics for your `production` environment can be found under the "METRICS" tab shown below.

![Metrics dashboard](/images/management-console/metrics/all.png "0.65")

Available on this page are usage metrics for [CPU](#cpu), [RAM](#ram), and [persistent disk](#disk) for each of the three hosts in your [N+1 configuration](/dedicated/architecture/_index.md), as well as an average across them. For each property, usage that crosses an *80% threshold* will trigger a warning message displayed on this dashboard. Usage that crosses *90%* will result in a critical message displayed. 

Measurements are taken for each metric *every ten seconds*, and there is a taskbar in the top right-hand corner from which you can select a window to view those samples. You will be able to zoom-in to observe individual samples, but in the primary three views (the last 15 minutes, the last hour, and the last day) averages are shown over larger intervals depending on the view.

| View                         | Sample average                    | Example                        |
| :--------------------------- | :-------------------------------- | :----------------------------- | 
| The last 15 minutes (*15m*)  | 10 seconds                        | 10:00:10, 10:00:20, 10:00:30   |
| The last hour (*1hr*)        | 1 minute                          | 10:00, 10:01, 10:02            |
| The last 24 hours (*24hr*)   | 20 minutes                        | 10:00, 10:20, 10:40, 11:00     |

From each view, you can zoom onto a smaller sample interval by dragging your cursor over that area on the graph. 

{{< video src="videos/metrics/metrics-zoom.mp4" >}}

The sample interval then changes based on the range you choose to zoom in on.

| View                         | Sample average                    |
| :--------------------------- | :-------------------------------- |
| < 30 minutes                 | 10 seconds                        |
| 30 minutes - 2 hours         | 1 minute                          |
| 2 - 5 hours                  | 5 minutes                         |
| 5 - 24 hours                 | 20 minutes                        |

From the taskbar you can also filter out individual hosts. 

![Metrics - sampling](/images/management-console/metrics/sampling.png "0.4")

Standard Dedicated environments will have a single cluster of three hosts, with each additional cluster adding at least three additional hosts to the project. Dedicated environments with two clusters have a split architecture, and their metrics are displayed in two separate groups: one for the web hosts that handle web requests and one for the service hosts that handle database, cache, and other services. 

![Metrics - sampling](/images/management-console/metrics/split-arch.png "0.75")

Each metric will display thresholds on the available resource *after* those resources used by the operating system have been subtracted (except for CPU). The images below have been taken from a single dedicated cluster, and can be an example for illustrating this difference. 

The reference project shown in the sections below has configured a single Python application, and three services: Elasticsearch, Redis, and MariaDB. It has been granted 4GB of memory and 2 vCPUs per host based on its plan. Persistent disk for each service have been configured as such:

* `python`: 1024MB, allocated to the mount `exports`
* `elasticsearch`: 1024MB
* `mysql`: 2048MB
* `redis`: no disk defined

## CPU

For the project, 2 vCPUs have been allocated per host, and in this case that value is displayed as the upper limit for the CPU metric. 

![Metrics - CPU](/images/management-console/metrics/cpu.png "0.5")

## RAM

RAM measures overall RAM usage (including user, kernel, and buffer groups), displaying a percentage over the RAM *available* for each host. For this example, each host has been granted 4GB of memory, while the upper limit in the plot below is listed as *3.62GB*. 0.38 GB of memory are in use by the operating system, leaving the remaining 3.62GB available to the host.

![Metrics - RAM](/images/management-console/metrics/ram.png "0.5")

## Disk

Disk represents that amount of persistent disk granted by the plan over all services and mounts, which in this case is 4GB (actually 4096MB). 

![Metrics - disk](/images/management-console/metrics/disk.png)

![Metrics - disk](/images/management-console/metrics/disk-single.png "0.4")
