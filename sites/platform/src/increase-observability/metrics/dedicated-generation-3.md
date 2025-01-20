---
title: "Monitor {{% names/dedicated-gen-3 %}} metrics"
sidebarTitle: "{{% names/dedicated-gen-3 %}} metrics"
description: "Understand how to read metrics for {{% names/dedicated-gen-3 %}} environments."
---

{{% names/dedicated-gen-3 %}} environments consist of various containers running across dedicated hosts:

* App containers: one or more [app containers](../../create-apps/_index.md)
* Service containers: zero or more [service containers](../../add-services/_index.md)
* Worker containers: zero or more [worker instances](/create-apps/app-reference/single-runtime-image.md#workers).

Infrastructure metrics report CPU, RAM, and disk space for all containers.

By default, the graphs include all hosts and an average over the hosts.
To select metrics for specific hosts, click **Filter**.

![Clicking Filter reveals a list of hosts you can filter](/images/metrics/filtering-gen3.png "0.4")

The ID numbers for the hosts in the list for filtering match the numbers for interacting with a host,
such as for accessing the environment using SSH.

## Example of how to read metrics

This example should give you an idea of how the metrics appear.
{{% names/dedicated-gen-3 %}} environments metrics show resource usage for each app, service, and worker container
across all hosts.

This reference project has a single app, two services (MySQL and Redis), and one worker.

Once you've read the metrics, see [recommendations for action](./_index.md#dedicated-gen-3-environments).

### App container

Metrics graphs for the app container show CPU, RAM, and disk allocation and usage across all hosts.
The persistent disk has been configured in the [app configuration](/create-apps/app-reference/single-runtime-image.md#top-level-properties)
at 4.86&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the app container](/images/metrics/app-container-gen3.png)

### Service containers

Metrics graphs for the service containers show CPU, RAM, and disk allocation and usage across all hosts.

#### MySQL

Metrics graphs for the MySQL service container show CPU, RAM, and disk allocation and usage across all hosts.
The persistent disk has been configured in the [services configuration](../../add-services/_index.md)
as 24.55&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the MySQL container](/images/metrics/mysql-metrics.png)

#### Redis

Metrics graphs for the Redis service container show CPU, RAM, and disk allocation and usage across all hosts.
No persistent disk has been configured for Redis,
while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the Redis container](/images/metrics/redis-container-gen3.png)

### Worker container

Metrics graphs for the Scheduler worker container show CPU, RAM, and disk allocation and usage across all hosts.
The persistent disk has been configured in the [app configuration](/create-apps/app-reference/single-runtime-image.md#top-level-properties)
at 4.86&nbsp;GB (the same as the app), while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the Scheduler worker container](/images/metrics/schedule-worker-container-gen3.png)
