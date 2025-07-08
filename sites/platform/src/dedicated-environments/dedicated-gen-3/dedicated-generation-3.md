---
title: "Monitor metrics"
sidebarTitle: "{{% names/dedicated-gen-3 %}} metrics"
description: "Understand how to read metrics for {{% names/dedicated-gen-3 %}} environments."
headless: true
---

These environments consist of various containers running across dedicated hosts:

* App containers: one or more [app containers](/create-apps/_index.md)
* Service containers: zero or more [service containers](/add-services/_index.md)
* Worker containers: zero or more [worker instances](/create-apps/app-reference/single-runtime-image.md#workers).

Infrastructure metrics report CPU, RAM, and disk space for all containers.

By default, the graphs include all hosts and an average over the hosts.
To select metrics for specific hosts, click **Filter**.

![Clicking Filter reveals a list of hosts you can filter](/images/metrics/DG3-filter-metrics.png "0.4")

The ID numbers for the hosts in the list for filtering match the numbers for interacting with a host,
such as for accessing the environment using SSH.

Each of the three hosts and their average. These metrics are available for all of your {{% names/dedicated-gen-3 %}} environments.

![A screenshot of what the metrics dashboard displays](/images/metrics/dg3-dashboard.png "0.45")

## Example of how to read metrics

This example should give you an idea of how the metrics appear.
{{% names/dedicated-gen-3 %}} environments metrics show resource usage for each app, service, and worker container
across all hosts.

This reference project has a single app, two services (PostgreSQL and Redis), and one worker.

### App container

Metrics graphs for the app container show CPU, RAM, and disk allocation and usage across all hosts.
The persistent disk has been configured in the [app configuration](/create-apps/app-reference/single-runtime-image.md#top-level-properties)
at 9.58&nbsp;GB, while the temporary disk is 49.04&nbsp;GB.

![All of the metrics for the app container](/images/metrics/DG3-app-container.png)

### Service containers

Metrics graphs for the service containers show CPU, RAM, and disk allocation and usage across all hosts.

#### PostgreSQL

Metrics graphs for the PostgreSQL service container show CPU, RAM, and disk allocation and usage across all hosts.
The persistent disk has been configured in the [services configuration](/add-services/_index.md)
as 2.81&nbsp;GB, while the temporary disk is 49.04&nbsp;GB.

![All of the metrics for the MySQL container](/images/metrics/DG3-postgresql.png)

#### Redis

Metrics graphs for the Redis service container show CPU, RAM, and disk allocation and usage across all hosts.
No persistent disk has been configured for Redis,
while the temporary disk is 49.04&nbsp;GB.

![All of the metrics for the Redis container](/images/metrics/DG3-redis.png)

### Worker container

Metrics graphs for the Scheduler worker container show CPU, RAM, and disk allocation and usage across all hosts.
The persistent disk has been configured in the [app configuration](/create-apps/app-reference/single-runtime-image.md#top-level-properties)
at 9.51&nbsp;GB, while the temporary disk is 49.04&nbsp;GB.

![All of the metrics for the Scheduler worker container](/images/metrics/DG3-worker-container.png)

### Thresholds 

If you have one container in a temporary burst state but your host still has plenty of available resources, it might not be an issue as long as the site is functioning properly. Burst allows your container to use additional resources when they aren't needed elsewhere.

If you have a container in a prolonged burst state, you might want to consider:

* [Optimizing your code](/increase-observability/_index.md)
* Changing your [app size](/create-apps/app-reference/single-runtime-image.md#sizes)
  or [service size](/add-services/_index.md#size)
* [Increasing your plan](/administration/pricing/_index.md)

You can reallocate your existing resources if other containers have resources they aren't using.

If you have multiple containers in a burst state, review your configuration or plan size.

{{< note theme="warning" title="Burst state">}}

Resources are dedicated to a single customer, but they're shared between services. Therefore, burst is allowed until the dedicated resource usage is exceeded. Usage that crosses _100%_ will mean that you have crossed into a **burst** state.

{{< /note >}}