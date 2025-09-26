---
title: Guaranteed resources
description: Learn how Guaranteed CPU on {{% vendor/name %}} provide dedicated CPU and memory allocations for consistent, high-performance workloads. 
weight: -50
---

For applications or services that need to scale to large resources and have performance guarantees, {{% vendor/name %}} offers Guaranteed resources (Guaranteed CPU).

Guaranteed CPU ensure that your app or service receives dedicated access to the specified amount of CPU and RAM. These resources are reserved exclusively for your container.

This kind of allocation provides performance close to dedicated infrastructure, ideal for:

- Backend services  
- Real-time APIs  
- Load testing  
- High-traffic production application containers  
- Resource-intensive services (e.g. database, search engine)  
- Any container requiring large resource allocations with consistent and predictable performance  

{{% note theme="warning" title="Region availability"%}}

Guaranteed CPU is **not supported on OVHcloud regions**, and some sizes **may not be available for [all regions](/development/regions.html).** 

{{% /note %}}

## Enable Guaranteed CPU

1. Open your project.
2. Click the Configure resources button from the Allocated resources block.
3. For each app/service:
   - Select **Guaranteed** or **Shared** as the resource type.
   - Choose the desired CPU and RAM combination.
   - Enter the amount of Disk/Storage to allocate.
4. Click Save. Saving will redeploy your environment, which may cause temporary downtime.

{{% note %}}

You cannot enable Guaranteed CPU if your [container profile is set to `HIGHER_MEMORY`](/manage-resources/adjust-resources.html#advanced-container-profiles).

{{% /note %}}

## Pause environments with Guaranteed CPU

When any app or service in an environment uses Guaranteed CPU, that environment cannot be paused automatically or manually. 

This is because, with Guaranteed CPU, you're billed for the reserved CPU and memory, so allowing pause functionality would lead to potential overuse of reserved compute and incorrect billing.

### To pause the environment again:

1. Switch all containers using Guaranteed CPU back to shared mode.
2. Once no containers are using Guaranteed CPU, the environment can be paused as usual.

{{% note %}}

You can upscale to Guaranteed CPU even if the environment is currently paused. Doing so will automatically resume the environment and apply the changes.

{{% /note %}}

