---
title: Autoscaling
description: Learn how autoscaling dynamically adjusts app instances based on CPU usage to keep apps responsive under load while optimizing costs.
weight: -200
keywords:
  - "resources"
  - "CPU"
  - "autoscaling"
  - "scaling"
---

Autoscaling allows your applications to automatically scale horizontally based on resource usage. Instead of manually adjusting instance counts, autoscaling dynamically increases or decreases the number of running instances based on CPU utilization.  

This ensures your apps remain responsive under load while helping you optimize costs.  

- **Scope:** Available for applications only  
- **Product tiers:** Available for all Upsun Flex environments  
- **Environments:** Configurable per environment - across dev, staging, and production. 

## Enable Autoscaling

{{< codetabs >}}

+++
title=In the Console
+++

In the Console, head to Configure Resources in the Settings section, and select Enable under the Autoscaling column. You will be able to configure your thresholds from here, as shown below.

![Configure autoscaling in the Console](/images/autoscaling/Configure-autoscaling.png "0.50")

<--->
+++
title=Using the CLI
+++

Ut eu porta est. Vestibulum in placerat urna, ac viverra nunc. Sed fringilla venenatis nunc, at sagittis leo pellentesque in. Vestibulum vel lorem nec arcu bibendum volutpat.

<--->
+++
title=Using the API
+++

Cras vel tortor non nulla fermentum dapibus id scelerisque turpis. Nullam mollis purus id libero pretium, vel porta lacus venenatis. 

{{< /codetabs >}}
  
## How Autoscaling works

### Thresholds

Autoscaling continuously monitors the average CPU utilization across your app's running instances. It works by you setting your thresholds, which are specific CPU usage levels that determine when autoscaling should take action. There are two different thresholds that your CPU utilization operates within: A scale-up threshold and a scale-down threshold.

- **Scale-up threshold**: The point at which your app's CPU usage would be considered too high. If average CPU usage stays above this level for the configured time period, autoscaling will launch additional instances to share the load.

- **Scale-down threshold**: The point at which your app is considered underutilized. If CPU usage stays below this level for the configured time period, autoscaling will remove unneeded instances to save resources and costs.

#### Example

If your scale-up threshold is set to 80% CPU for 5 minutes, and your app's instances consistently exceed that level, autoscaling will add a new instance to distribute the workload. Later, if traffic decreases and CPU usage falls below the 20% scale-down threshold for 5 minutes, autoscaling will safely remove an instance.

This cycle ensures your app automatically scales up during high demand and scales down when demand drops, helping balance performance with cost efficiency.

### Default settings

The default setting for a scale-up threshold is 80% CPU for 5 minutes, while the default setting for a scale-down threshold is 20% CPU for 5 minutes.

To prevent unnecessary back-and-forth, autoscaling also uses a cooldown window: a short waiting period before another scaling action can be triggered. The default setting for a cooldown window is 5 minutes before any additional scaling starts.  

By default, autoscaling manages between one and ten instances per environment, though you can configure the minimum and maximum instance limits to suit your workload. Once enabled, autoscaling automatically manages instance counts for you, so manual adjustments are disabled.

## Guardrails

Autoscaling gives you control over the minimum and maximum number of instances your app can run. These guardrails ensure your app never scales up or down too far.

For example, you might configure:

- **Minimum instances**: 2 (so your app always has at least 2 instances running, even during low traffic)
- **Maximum instances**: 8 (so your app will never scale beyond 8 instances, even during a traffic spike)

You can also customize the scaling thresholds (the CPU utilization percentages that trigger scale-up or scale-down actions) and the evaluation periods (how long usage must stay above or below a threshold before scaling occurs). Evaluation periods can be set anywhere between 1 and 60 minutes.

{{< note theme="info" title="Manual instance scaling">}}

When autoscaling is enabled, manual instance scaling is disabled. Autoscaling takes full control of instance counts within the min/max guardrails you define.

{{< /note >}}

## Alerts and metrics

When a scaling event occurs, it will appear in your metrics dashboards. Standard health alerts are also triggered when scaling occurs.

## Billing and cost impact

Autoscaling costs are based on the actual resources consumed, just as with manual scaling. Instances added through autoscaling are billed normally, and there are no separate charges for scaling events. 

However, each scaling action consumes build minutes, since new instances follow the same deployment process as manual scaling. If your app scales frequently, this could increase build minute usage.

To avoid unnecessary costs, configure thresholds carefully. Overly aggressive settings (eg. scaling up and down every minute) can trigger constant deployments.

## Best practices for autoscaling

Autoscaling gives you flexibility and resilience, but to get the best results it's important to configure your app and thresholds thoughtfully. Below are some best practices to help you balance performance, stability, and cost.

#### Cost optimization

- Configure realistic scale-up and scale-down thresholds to avoid unnecessary deployments that can rapidly consume build minutes.
- Use longer evaluation periods (e.g. 10–15 minutes) if your app traffic spikes often to prevent scaling up and down too frequently.
- Set minimum and maximum instance counts to control costs while ensuring baseline availability.
- Monitor billing and build minute usage after enabling autoscaling, then adjust thresholds as needed.

#### Application architecture

- Use external or managed services for components like databases rather than embedding them in autoscaled containers.
- Follow {{% vendor/name %}} recommendations for [caching](/define-routes/cache.html) and mounts for [composable image](/create-apps/app-reference/composable-image.html#mounts) and [single-runtime](/create-apps/app-reference/single-runtime-image.html#mounts) to ensure autoscaled containers stay portable.
- If using [composable images](/create-apps/app-reference/composable-image.html), be cautious when multiple containers rely on a single embedded service as scaling could introduce unexpected bottlenecks.

#### Cron jobs and long-running tasks

- Be aware that cron jobs increase CPU usage and may trigger scale-ups. Factor this into your threshold settings.
- Cron jobs remain bound to the container they started in and are not interrupted by scaling events, so plan instances accordingly.

{{< note theme="tip" title="Supported services and actions">}}

Autoscaling **does not** currently support queues or background worker services. 

Scaling down to zero instances is also **not supported**. Use minimum instance counts to define your baseline availability.

{{< /note >}}


## Related documentation

##### Resources and scaling

- [Resource configuration](/manage-resources/adjust-resources.html)  
- [Resource initialization](/manage-resources/resource-init.html)
- [Horizontal scaling](/manage-resources/adjust-resources.md#horizontal-scaling)

##### Metrics
- [Infrastructure metrics](/increase-observability/metrics.html)  
- [Application metrics](/increase-observability/application-metrics.html) 

##### Image reference

- [Composable image](/create-apps/app-reference/composable-image.html) 
- [Single-runtime image](/create-apps/app-reference/single-runtime-image.html) 

##### Billing and payment

- [Payment FAQ](/administration/billing/payment-faq.html) 
- [Monitor billing](/administration/billing/monitor-billing.html) 
