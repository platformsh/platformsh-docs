---
title: Scale your live site
sidebarTitle: Scalability
description: Learn how to scale your live site.
---

Your production environment gets a [pool of resources](/create-apps/app-reference/single-runtime-image.md#sizes)
based on your [plan size](../administration/pricing/_index.md).
These resources are split up between the apps and services you've defined.

You might occasionally get increased load on your site,
such as during a major product launch or a sales event like Black Friday.
This pressure might cause problems in your site or even bring it down.
At such times, you want your site to have enough resources to handle the additional load.

How your site handles the need to scale depends on your plan.
On higher tiers with the Observability Suite,
everything is taken care of automatically.
When your site starts experiencing pressure,
it gets the resources needed to handle that pressure.
On self-service tiers, you have to handle that yourself, often after your site has gone down.

If you know a spike in traffic is likely coming,
scale your plan up in advance to handle the event and downscale after it.
You're only charged for the time when the plan was higher.

## Auto-scaling Dedicated environments

{{< partial "observability-suite/body.md" >}}

If you have the Observability Suite on a Dedicated environment,
your site is monitored for traffic spikes.
If these spikes are causing application errors,
your site is automatically scaled up to the next largest size to handle the traffic.

The process is initiated and run automatically and a support ticket is opened.
The upscaling process is then monitored by the {{% vendor/name %}} team.
The team determines whether the upscaling is working as intended and is necessary
or can be avoided by, for example, blocking a malicious bot.

Autoscaling uses HTTP, CPU, and memory metrics to scale your Dedicated clusters.
There are two classes of measurement that trigger an autoscaling event:

- HTTP error rate trigger: A daily error rate (`50x` requests/total requests) for the last 24 hours.
  This value is compared against 5 minute intervals of requests for the last hour of requests.
  As soon as two interval error rates in that hour are greater than the daily error rate,
  an autoscaling event is triggered.

- CPU load/request trigger: autoscaling occurs when CPU usage and traffic reaches a predefined threshold.

## Managed scaling for Dedicated and Grid environments

{{< premium-features/tiered "Enterprise and Elite" >}}

If your plan includes managed scaling,
{{% vendor/name %}} monitors your application to make ensure it doesn't fail due to a lack of resources.
If the monitoring determines that a lack of resources is causing issues for your site,
a support ticket is opened.
The {{% vendor/name %}} team determines whether upscaling is necessary
or can be avoided by, for example, blocking a malicious bot.

If upscaling is necessary, it's handled for you and you're kept up to date in the support ticket.
When the traffic spike passes, your plan is downgraded again to use only the necessary resources.

On Dedicated environments, the upscaling is handled by cycling through each node in the redundant architecture.
One at a time, they're removed from the cluster, upsized, and returned. 

On Split Architecture dedicated environments, additional web servers may be added to provide additional capacity (Horizontal scaling).

## Manually scale Grid environments

To increase the pool of resources available to your project,
[upgrade your plan](../administration/pricing/_index.md#switch-plans) and redeploy your site.
