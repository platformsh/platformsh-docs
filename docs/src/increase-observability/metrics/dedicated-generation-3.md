---
title: Monitor Dedicated Generation 3 metrics
sidebarTitle: Dedicated Generation 3 metrics
description: Understand how to read metrics for Dedicated Genration 3 environments.
---

Dedicated Generation 3 environments consist of:

* App containers: one or more [app containers](../../create-apps/_index.md)
* Service containers: zero or more [service containers](../../add-services/_index.md)
* Worker containers: zero or more [worker instances](../../create-apps/app-reference.md#workers).

Infrastructure metrics report CPU, RAM, and disk space for all containers.

By default, the graphs include all hosts and an average over the hosts.
To select metrics for specific hosts, click **Filter**.

![Clicking Filter reveals a list of hosts you can filter](/images/metrics/filtering-gen3.png "0.4")

The IDs for the hosts in the list for filtering match the IDs for interacting with a host,
such as for accessing the environment using SSH.

## Example of how to read metrics

This example should give you an idea of how the metrics appear.
Dedicated Generation 3 environments metrics show resource usage for each app, service, and worker container.

This reference project has a single app, two services (MySQL and Redis), and two workers.

Once you've read the metrics, see [recommendations for action](./_index.md#dedicated-generation-3-environments).

### App container

Metrics graphs for the app container show CPU, RAM, and disk allocation and usage.
The persistent disk has been configured in the [app configuration](../../create-apps/app-reference.md#top-level-properties)
at 1.91&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the app container](/images/metrics/app-container-gen3.png)

### Service containers

Metrics graphs for the service containers show CPU, RAM, and disk allocation and usage.

#### MySQL

Metrics graphs for the MySQL service container show CPU and disk allocation and usage.
The persistent disk has been configured in the [services configuration](../../add-services/_index.md)
as 0.95&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the MySQL container](/images/metrics/mysql-container-gen3.png)

#### Redis

Metrics graphs for the Redis service container show CPU and disk allocation and usage.
No persistent disk has been configured for Redis,
while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the Redis container](/images/metrics/redis-container-gen3.png)

### Worker containers

Metrics graphs for the App-Horizon worker container show CPU, RAM, and disk allocation and usage.
The persistent disk has been configured in the [app configuration](../../create-apps/app-reference.md#top-level-properties)
at 1.91&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the App-Horizon worker container](/images/metrics/horizon-worker-container-gen3.png)

Metrics graphs for the App-Schedule worker container show CPU, RAM, and disk allocation and usage.
The persistent disk has been configured in the [app configuration](../../create-apps/app-reference.md#top-level-properties)
at 1.91&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the App-Horizon worker container](/images/metrics/schedule-worker-container-gen3.png)
