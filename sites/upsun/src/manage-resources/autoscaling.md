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

Autoscaling allows your applications to automatically [scale horizontally](https://docs.upsun.com/manage-resources/adjust-resources.html#horizontal-scaling) based on resource usage. Instead of manually adjusting instance counts, autoscaling dynamically increases or decreases the number of running instances based on CPU utilization.  

This ensures your apps remain responsive under load while helping you optimize costs.  

- **Scope:** Available for applications only  
- **Product tiers:** Available for all Upsun Flex environments  
- **Environments:** Configurable per environment - across dev, staging, and production

{{< note theme="info" title="Scale databases and resources">}}

If you're looking to scale your databases and other services, or vertically scale resources (CPU, RAM, disk), see:

- [Resource configuration](https://docs.upsun.com/manage-resources/adjust-resources.html)
- [Resource initialization](https://docs.upsun.com/manage-resources/resource-init.html)
- [Horizontal scaling (manual)](https://docs.upsun.com/manage-resources/adjust-resources.html#horizontal-scaling)

{{< /note >}}

## Autoscaling availability

### Component support

| Component | Horizontal Autoscaling | Vertical Scaling (Manual) |
| --------- | ---------------------- | ------------------------- |
| Applications — [PHP](https://docs.upsun.com/create-apps/languages/php.html), [Node.js](https://docs.upsun.com/create-apps/languages/nodejs.html), etc. | Available              | Available                 |
| Services — [MySQL](https://docs.upsun.com/add-services/mysql.html), [Redis](https://docs.upsun.com/add-services/redis.html), etc. | Unavailable            | Available                 |
| Queues — [workers](https://docs.upsun.com/add-services/worker.html), background jobs                            | Unavailable            | Available                 |

### Product tier support

| Product tier | Horizontal Autoscaling | Vertical Scaling (Manual) |
| ------------ | ---------------------- | ------------------------- |
| Upsun Flex   | Available              | Available                 |
| Upsun Fixed  | Unavailable            | Available                 |

### Environment support

| Environment  | Horizontal Autoscaling | Vertical Scaling (Manual) |
| ------------ | ---------------------- | ------------------------- |
| Development  | Available              | Available                 |
| Staging      | Available              | Available                 |
| Production   | Available              | Available                 |

### Scaling trigger support

| Trigger                  | Console     | CLI         | API         |
| ------------------------- | ----------- | ----------- | ----------- |
| Average CPU (min/max)     | Available   | Available   | Available   |
| Average Memory (min/max)  | Unavailable | Unavailable | Available   |

  
## How Autoscaling works

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
- **Instance limits:** 1–10 per environment (configurable)

{{< note theme="info" title="Scale databases and resources">}}

When autoscaling is enabled, [manual instance count](https://docs.upsun.com/manage-resources/adjust-resources.html#horizontal-scaling) changes are disabled. Vertical resources (CPU/RAM/disk per instance) remain configurable.

{{< /note >}}

#### Default behaviour (CPU example)

- If CPU stays at **≥ 80% for 5 minutes**, autoscaling adds an instance.
- If CPU stays at **≤ 20% for 5 minutes**, autoscaling removes an instance.
- After a scaling action, autoscaling waits **5 minutes** before making another change.

This cycle ensures your app automatically scales up during high demand and scales down when demand drops, helping balance performance with cost efficiency.

## Guardrails and evaluation

Autoscaling gives you control over the minimum and maximum number of instances your app can run. These guardrails ensure your app never scales up or down too far. Set boundaries to keep scaling safe, predictable, and cost-efficient:

For example, you might configure:

- **Minimum instances** — Ensures a minimum number of instances of the configured application are always running (e.g., `2`)
- **Maximum instances** — Prevents runaway scaling (e.g., `8`)
- **Evaluation period** — Time CPU must stay above/below a threshold before action (1–60 minutes)
- **Cooldown window** — Wait time before any subsequent scaling action (default: 5 minutes)

You can also customize the scaling [thresholds](#thresholds) and the evaluation periods (how long usage must stay above or below a threshold before scaling occurs). Evaluation periods can be set anywhere between 1 and 60 minutes.

{{< note theme="info" title="Manual instance scaling">}}

When autoscaling is enabled, manual instance scaling is disabled. Autoscaling manages instance counts within the min/max guardrails you define.

{{< /note >}}

## Enable Autoscaling

To enable autoscaling, follow the steps below:

1. Open your project in the Console
2. Select the environment where you want to enable autoscaling
3. Choose **Configure resources**
4. Under the Autoscaling column select **Enable**
5. Configure thresholds, evaluation period, cooldown, and instances as needed

![Configure autoscaling in the Console](/images/autoscaling/Configure-autoscaling.png "0.50")

## Alerts and metrics

- Scaling events appear in infrastructure and application metrics dashboards.
- Standard health alerts are triggered when scaling occurs.
- After enabling autoscaling, monitor CPU, instance count, and request latency to validate thresholds.

{{< note theme="info" title="Metric resources">}}

If you're looking to keep track of your infrastructure and application metrics see:

- [Infrastructure metrics](https://docs.upsun.com/increase-observability/metrics.html)
- [Application metrics](https://docs.upsun.com/increase-observability/application-metrics.html)

{{< /note >}}

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
