---
title: Infrastructure metrics
weight: 5
description: See all of the live infrastructure metrics available to give you an overview of resource usage.
---

{{% vendor/name %}} projects are accompanied by live infrastructure metrics that provide an overview of resource usage for environments.

Within the Console, metrics can be found for an environment under **Resources**.

The information under **Resources** shows usage metrics for:

{{% vendor/name %}} environments: your service, app, and worker containers.
These metrics are available for all of your environments.

## Default thresholds

All of the graphs show color-coded lines for the following thresholds:

- Usage up to _100%_ results.
- Usage that crosses _80%_ results.
- Usage that crosses _90%_ results.
- Usage that crosses _50%_ results.

### Recommendations

The default thresholds aim to give you an idea of when your hosts or containers are close to running out of resources. The impact differs based on your specific apps and service. 

If the resources are hovering close to the 100% threshold, you might want to consider:

* [Optimizing your code](../application-metrics/_index.md) (if possible)
* [Changing your app size or service size](/manage-resources.md)

## Time intervals

Measurements are taken for each metric every 1 minute. You can select a time frame over which to see these measurements for the entire **Resources** view. In the primary three views, averages are shown over larger intervals.

| View                                                                  | Time between measurements                     | Example                      |
| :-------------------------------------------------------------------- | :-------------------------------------------- | :--------------------------- |
| The last 15 minutes (*15m*)                                           | 1 minute                                      | 10:00, 10:01, 10:02          |
| The last hour (*1hr*)                                                 | 1 minute                                      | 10:00, 10:01, 10:02          |
| The last 8 hours (*8hr*)                                              | 10 minutes                                    | 10:00, 10:10, 10:20, 11:00   |

To zoom in on smaller intervals, select specific ranges in a graph.

The interval between measurements then changes based on the range you choose.

| View         | Time between measurements |
| :----------- | :------------------------ |
| < 2 hours    | 1 minute                  |
| 2 to 5 hours | 5 minutes                 |
| 5+ hours     | 20 minutes                |

### Longer time intervals

You can access historical data for up to 30 days. These data should help you understand trends over time and whether a given measurement is normal, something that occurs occasionally, or a true anomaly.

To see data over a given time frame, use the date picker to select the range to display.

## Deployments

Sometimes deployment activities (pushes, merges, syncs) can influence the underlying infrastructure.
You don't want to confuse a spike caused by a successful deploy with an issue that needs your attention.

To see how deployment activity influences the infrastructure, turn on **Deployments** on your metrics.

Each deployment activity appears as a line on each graph corresponding to the time the activity finished.

- To see information about the deployment activity, hover over the line.
- To see the build log for a specific deployment activity, click the line.
