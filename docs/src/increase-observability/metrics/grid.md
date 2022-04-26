---
title: Monitor Grid metrics
sidebarTitle: Grid metrics
description: Understand how to read metrics for Grid environments.
---

Grid environments consist of:

* App containers: one or more [app containers](../../configuration/app/_index.md)
* Service containers: zero or more [service containers](../../configuration/services/_index.md)
* Worker containers: zero or more [worker instances](../../configuration/app/app-reference.md#workers).

Infrastructure metrics report CPU, RAM, and disk space for app and worker containers
and CPU and disk space for service containers.

App containers are shown first, with the app name and an image corresponding to the app type.
Service containers follow next with the same pattern and worker containers are shown last.

You can collapse the graphs by clicking **Hide metrics**.
The graphs switch to an overview of the average resource utilization for the selected container.

![How service container metrics look when minimized](/images/metrics/service-container-minimized.png "0.65")

## Start metrics collection

To start collecting metrics on Grid environments, you need to redeploy the environment.
If a redeploy is required for the specific environment, you see a note in the console:

![Screenshot showing the text "Your metrics are almost here" and a prompt to redeploy](/images/metrics/metrics-redeploy-prompt.png "0.3")

## Example of how to read metrics

This example should give you an idea of how the metrics appear.
Grid environment metrics show resource usage for each app, service, and worker container.

This reference project has a single app, two services (MySQL and Redis), and two workers.
The plan size for this project is [Medium](https://platform.sh/pricing/).
The appropriate resources have been [allocated automatically](../../configuration/app/app-reference.md#sizes) for each container
based on the number and type of containers for this plan size.
The graphs show the current average usage in relation to the allocated resources.

Once you've read the metrics, see [recommendations for action](./_index.md#grid-environments).

### App container

Metrics graphs for the app container show CPU, RAM, and disk allocation and usage.
The persistent disk has been configured in the [app configuration](../../configuration/app/app-reference.md#top-level-properties)
at 1.91&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the app container](/images/metrics/app-container.png)

### Service containers

#### MySQL

Metrics graphs for the MySQL service container show CPU and disk allocation and usage.
The persistent disk has been configured in the [services configuration](../../configuration/services/_index.md)
as 1.91&nbsp;GB,
while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the MySQL container](/images/metrics/mysql-container.png)

#### Redis

Metrics graphs for the Redis service container show CPU and disk allocation and usage.
No persistent disk has been configured for Redis,
while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the Redis container](/images/metrics/redis-container.png)

### Worker containers

Metrics graphs for the App-Horizon worker container show CPU, RAM, and disk allocation and usage.
The persistent disk has been configured in the [app configuration](../../configuration/app/app-reference.md#top-level-properties)
at 1.91&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the App-Horizon worker container](/images/metrics/horizon-worker-container.png)

Metrics graphs for the App-Schedule worker container show CPU, RAM, and disk allocation and usage.
The persistent disk has been configured in the [app configuration](../../configuration/app/app-reference.md#top-level-properties)
at 1.91&nbsp;GB, while the temporary disk is 3.99&nbsp;GB by default.

![All of the metrics for the App-Horizon worker container](/images/metrics/schedule-worker-container.png)
