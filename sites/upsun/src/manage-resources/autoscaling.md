---
title: Autoscaling
description: Learn how autoscaling dynamically adjusts app instances based on CPU usage to keep apps responsive under load while optimizing costs.
weight: -400
keywords:
  - "resources"
  - "CPU"
  - "autoscaling"
  - "scaling"
---

Autoscaling allows your applications to automatically [scale horizontally](/manage-resources/adjust-resources.html#horizontal-scaling) based on resource usage. 

This ensures your apps remain responsive under load while helping you optimize costs.  

- **Scope:** Available for applications only  
- **Product tiers:** Available for all Upsun Flex environments  
- **Environments:** Configurable per environment - across dev, staging, and production

{{< note theme="info" title="Scale databases and resources">}}

If you're looking to scale your databases and other services, or [vertically scale](/manage-resources/adjust-resources.html#vertical-scaling) resources (CPU, RAM, disk), see:

- [Resource configuration](/manage-resources/adjust-resources.html)
- [Resource initialization](/manage-resources/resource-init.html)
- [Horizontal scaling (manual)](/manage-resources/adjust-resources.html#horizontal-scaling)

{{< /note >}}

## Autoscaling availability

The tables below outline where autoscaling and manual scaling are supported, so you can plan your deployments with the right balance of flexibility and control.

### Component support

| Component | Horizontal autoscaling | Manual scaling (Vertical) |
| --------- | ---------------------- | ------------------------- |
| Applications ([PHP](/create-apps/languages/php.html), [Node.js](/create-apps/languages/nodejs.html), etc.) | Available              | Available                 |
| Services ([MySQL](/add-services/mysql.html), [Redis](/add-services/redis.html), etc.) | Unavailable            | Available                 |
| Queues ([workers](/add-services/worker.html), background jobs)                            | Unavailable            | Available                 |

### Product tier support

| Product tier | Horizontal autoscaling | Manual scaling (Vertical) |
| ------------ | ---------------------- | ------------------------- |
| Upsun Flex   | Available              | Available                 |
| Upsun Fixed  | Unavailable            | Available                 |

### Environment support

| Environment  | Horizontal Autoscaling | Manual scaling (Vertical) |
| ------------ | ---------------------- | ------------------------- |
| Development  | Available              | Available                 |
| Staging      | Available              | Available                 |
| Production   | Available              | Available                 |

### Scaling trigger support

| Trigger                   | Console     | CLI         | 
| ------------------------- | ----------- | ----------- | 
| Average CPU (min/max)     | Available   | Available   | 
| Average Memory (min/max)  | Coming      | Coming      | 

  
## How autoscaling works

### Thresholds

Autoscaling continuously monitors the average CPU utilization across your app's running instances. It works by you setting your thresholds, which are specific CPU usage levels that determine when autoscaling should take action. There are two different thresholds that your CPU utilization operates within: A scale-up threshold and a scale-down threshold.

- **Scale-up threshold**: If your chosen trigger (eg. CPU usage) stays **above** this level for the time period you've set (the evaluation period), autoscaling will launch additional instances to share the load.

- **Scale-down threshold**: If your chosen trigger stays **below** this level for the time period you've set, autoscaling will remove unneeded instances to save resources and costs.

To prevent unnecessary back-and-forth, autoscaling also uses a cooldown window: a short waiting period before another scaling action can be triggered. This can also be configured or kept to the [default](#default-settings) waiting period before any additional scaling starts. 

### Default settings

Autoscaling continuously monitors the configured **trigger** across your app’s running instances. We will use the **average CPU utilization** trigger as the primary example for the default settings and examples below.

- **Scale-up threshold:** 80% CPU for 5 minutes
- **Scale-down threshold:** 20% CPU for 5 minutes
- **Cooldown window:** 5 minutes between scaling actions
- **Instance limits:** 1–8 per environment (region-dependent) 

{{< note theme="note" title="Instance limits">}}

Default instance limits are typically **1–8 instances per environment**, but the exact values depend on the region. Some regions may have higher or lower defaults. The scaling settings in your project always reflect the limits for the region where it runs.  

{{< /note >}}

{{< note theme="info" title="Scale databases and resources">}}

When autoscaling is enabled, [manual instance count](/manage-resources/adjust-resources.html#horizontal-scaling) changes are disabled. [Vertical resources](/manage-resources/adjust-resources.html#vertical-scaling) (CPU/RAM/disk per instance) remain configurable.

{{< /note >}}

#### Default behaviour (CPU example)

- If CPU stays at **80% or higher for 5 minutes**, autoscaling adds an instance.
- If CPU stays at **20% or lower for 5 minutes**, autoscaling removes an instance.
- After a scaling action, autoscaling waits **5 minutes** before making another change.

This cycle ensures your app automatically scales up during high demand and scales down when demand drops, helping balance performance with cost efficiency.

## Guardrails and evaluation

Autoscaling gives you control over the minimum and maximum number of instances your app can run. These guardrails ensure your app never scales up or down too far. Set boundaries to keep scaling safe, predictable, and cost-efficient:

For example, you might configure:

- **Minimum instances** — Ensures a minimum number of instances of the configured application are always running (e.g. `2`)
- **Maximum instances** — Prevents runaway scaling (e.g. `8`)
- **Evaluation period** — Time CPU must stay above or below a threshold before action (1–60 minutes)
- **Cooldown window** — Wait time before any subsequent scaling action (default: 5 minutes)

{{< note theme="info" title="Manual instance scaling">}}

When autoscaling is enabled, manual instance scaling is disabled. Autoscaling manages instance counts within the min/max guardrails you define.

{{< /note >}}

## Enable Autoscaling

To enable autoscaling, follow the steps below:

1. Open your project in the Console
2. Select the environment where you want to enable autoscaling
3. Choose **Configure resources**

![Navigate to Configure resources in Console](/images/autoscaling/configure-resources-1.png "0.50")

4. Under the autoscaling column select **Enable**
5. Configure thresholds, evaluation period, cooldown, and instances as needed

![Configure autoscaling in Console](/images/autoscaling/Configure-autoscaling.png "0.50")

## Alerts and metrics

When autoscaling is enabled, the system continuously monitors metrics such as CPU usage, instance count, and request latency. If a defined threshold is crossed, an alert is triggered and the platform automatically responds by adjusting resources.

Scaling activity is visible in several places:

- **Metrics dashboards** show when scaling has occurred  
- Alerts and scaling actions are also visible in the Console: 
  - **Alerts** appear with a bell icon (for example - *Scaling: CPU for application below 70% for 5 minutes*) 
  - **Scaling actions** appear with a resources icon (for example, *Upscale: 1 instance added to application*)  
- Alerts and scaling actions are also listed in the CLI as `environment.alert` and `environment.resources.update`  
- To review detailed scaling events, open the **Resources** dashboard by navigating to **{Select project} > {Select environment} > Resources**

### Configure alerts

You can also [configure notifications for alerts](/administration/billing/monitor-billing.html#set-a-billing-alert). 

For example, by setting up an activity script on `environment.alert`, you can automatically send yourself an email, a Slack message, or another type of custom notification.

{{< note theme="info" title="Metric resources">}}

If you're looking to keep track of your infrastructure and application metrics see:

- [Infrastructure metrics](/increase-observability/metrics.html)
- [Application metrics](/increase-observability/application-metrics.html)

{{< /note >}}

## Billing and cost impact

Instances added through autoscaling are billed normally, and there are no separate charges for scaling events. 

However, each scaling action consumes build minutes, since new or removed instances are deployed with scaling action. If your app scales frequently, this could increase build minute usage.

To control costs, avoid overly aggressive settings (eg. very short evaluation periods).

{{< note theme="info" title="Metric resources">}}

If you're looking to keep track of your billing see:

- [Monitor billing](/administration/billing/monitor-billing.html)
- [Pricing overview](https://www.upsun.com/pricing/)

{{< /note >}}

## Best practices for autoscaling

Autoscaling gives you flexibility and resilience, but to get the best results it's important to configure your app and thresholds thoughtfully. Below are some best practices to help you balance performance, stability, and cost.

### Cost & stability

- **Set thresholds wisely**: Configure realistic scale-up and scale-down thresholds to avoid unnecessary deployments that quickly consume build minutes.
- **Smooth spikes**: Use longer evaluation periods (10–15 minutes) if your app traffic spikes often, to prevent rapid up-and-down scaling.
- **Control instance counts**: Define minimum and maximum instances to manage costs while keeping required availability.
- **Monitor costs**: Track billing and build minute usage after enabling autoscaling, then adjust thresholds as needed.

### Application design

- **External services**: Use external [services](/add-services/) such as databases and caches instead of embedding them within the autoscaled applications.
- **Keep containers portable**: Follow {{% vendor/name %}} recommendations for [caching](/define-routes/cache.html) and mounts for [composable images](/create-apps/app-reference/composable-image.html#mounts) and [single-runtime images](/create-apps/app-reference/single-runtime-image.html#mounts).
- **Avoid bottlenecks**: If using [composable images](/create-apps/app-reference/composable-image.html), be cautious when multiple containers depend on a single embedded service, as scaling may cause unexpected bottlenecks.

### Cron jobs & long-running tasks

- **CPU spikes from jobs**: Cron jobs can increase CPU usage and may trigger scale-ups so factor this into your threshold settings.
- **Job continuity**: Cron jobs remain bound to their starting container and are **not** interrupted by scaling, so plan instances accordingly.


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
- [Pricing overview](https://www.upsun.com/pricing/)