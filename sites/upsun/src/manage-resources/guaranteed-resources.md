---
title: Guaranteed CPU
description: Learn how Guaranteed CPU on {{% vendor/name %}} provide dedicated CPU and memory allocations for consistent, high-performance workloads. 
weight: -50
---

For applications that need to scale beyond 8 CPUs, {{% vendor/name %}} offers Guaranteed CPU.

Guaranteed CPU ensure that your app or service receives dedicated access to the specified amount of CPU and RAM. These resources are reserved exclusively for your container.

This kind of allocation provides performance close to dedicated infrastructure, ideal for:

- Backend services  
- Real-time APIs  
- Load testing  
- Performance-sensitive workloads

## Enable Guaranteed CPU

1. Open your project.
2. Click the Configure resources button from the project card or App & Services panel.
3. For each app/service:
   - Select **Guaranteed** or **Shared** as the resource type.
   - Choose the desired CPU and RAM combination.
   - Enter the amount of Disk/Storage to allocate.
4. Click Save. Saving will redeploy your environment, which may cause temporary downtime.

{{% note %}}

You cannot enable Guaranteed CPU if your [container profile is set to `HIGHER_MEMORY`](/manage-resources/adjust-resources.html#advanced-container-profiles).

{{% /note %}}

## View your Allocated CPU

All projects display an Allocated Resources component in the Console. This shows:

- CPU type: Shared vs. Guaranteed  
- Allocated RAM and Disk  
- Live usage metrics

It will also show whether you have Guaranteed CPU is enabled or not. 

{{% note %}}

A small portion of host CPU and RAM is used by {{% vendor/name %}}’s system services. The available capacity will be slightly lower than the full allocation selected.

{{% /note %}}

## Pause Environments with Guaranteed CPU

When any app or service in an environment uses Guaranteed CPU, that environment cannot be paused automatically or manually. 

This is because, with Guaranteed CPU, you're billed for the reserved CPU and memory, so allowing pause functionality would lead to potential overuse of reserved compute and incorrect billing.

### To pause the environment again:

1. Switch all containers using Guaranteed CPU back to shared mode.
2. Once no containers are using Guaranteed CPU, the environment can be paused as usual.

{{% note %}}

You can upscale to Guaranteed CPU even if the environment is currently paused. Doing so will automatically resume the environment and apply the changes.

{{% /note %}}

