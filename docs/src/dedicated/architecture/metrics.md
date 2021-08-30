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

{{< note >}}
You may notice in the per-host dropdown above that a Host ID is listed of the form `Host i-XXXXXXXXX`. If you navigate to the production environment's overview in the management console, however, you also see that this Host ID does *not* match the identifiers used in interacting with a host, such as the SSH dropdown options for each host on that environment.

| Host ID on Metrics page      | SSH connection string on Overview page                                |
| :--------------------------- | :-------------------------------------------------------------------- |
| `Host i-04353f1e6f`          | `ssh 3.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh`   |
| `Host i-04d1ac8319`          | `ssh 2.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh`   |
| `Host i-0b1e1b96cf`          | `ssh 1.ent-abcde3clusterID-production-qwerty8@ssh.us-4.platform.sh`   |

In the table above, host IDs and SSH addresses in the same row do not necessarily point to the same host and do not have naming conventions that could easily resolve one to the other. Observing a host's metrics and then SSHing into that host to investigate a potential problem first requires an intermediate step. In this case, it is to simply to SSH into a host and then verify the Host ID after the fact. 

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

Once you have connected to a host over SSH, you can see the host identifier (`abcde3clusterID@i-04d1ac8319f6ab9a6`) contains the hash for `Host i-04d1ac8319` after the `@`, letting you know that to investigate metrics for that host you need to SSH into host `3`.
{{< /note >}}

Standard Dedicated environments will have a single cluster of three hosts, with each additional cluster adding at least three additional hosts to the project. Dedicated environments with two clusters have a split architecture, and their metrics are displayed in two separate groups: one for the web hosts that handle web requests and one for the service hosts that handle database, cache, and other services. 

![Metrics - sampling](/images/management-console/metrics/split-arch.png "0.75")

Each metric will display thresholds on the available resource *after* those resources used by the operating system have been subtracted (except for CPU). The images below have been taken from a single dedicated cluster, and can be an example for illustrating this difference. 

## Example: reading metrics

The reference project shown in the sections below has configured a single Python application, and three services: Elasticsearch, Redis, and MariaDB. It has been granted 4GB of memory and 2 vCPUs per host based on its plan. Persistent disk for each service have been configured as such:

* `python`: 1024MB, allocated to the mount `exports`
* `elasticsearch`: 1024MB
* `mysql`: 2048MB
* `redis`: no disk defined

### CPU

For the project, 2 vCPUs have been allocated per host, and in this case that value is displayed as the upper limit for the CPU metric. 

![Metrics - CPU](/images/management-console/metrics/cpu.png "0.5")

### RAM

RAM measures overall RAM usage (including user, kernel, and buffer groups), displaying a percentage over the RAM *available* for each host. For this example, each host has been granted 4GB of memory, while the upper limit in the plot below is listed as *3.62GB*. 0.38 GB of memory are in use by the operating system, leaving the remaining 3.62GB available to the host.

![Metrics - RAM](/images/management-console/metrics/ram.png "0.5")

### Disk

Disk represents that amount of persistent disk granted by the plan over all services and mounts, which for production Dedicated environments is [50GB](/dedicated/architecture/_index.md).

![Metrics - disk](/images/management-console/metrics/disk.png)

For each host, you will be provided first with disk metrics from the root (`/`) folder. Disk utilization here does not count against the 50GB set aside for your plan, but rather infrastructure disk which can include the `/tmp` directory. It has been included here in the dashboard so that you can keep track of build artifacts you write to `/tmp`, making sure that they do not get too large and fill up.

On the right are two directories specified for the `mysql` service (shown again below) and the `exports` mount. In this case, only 20GB out of the total 50GB have been allocated for the environment, and you can keep track of the defined space here.

![Metrics - disk](/images/management-console/metrics/disk-single.png "0.4")
