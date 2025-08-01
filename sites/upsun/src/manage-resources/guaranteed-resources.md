---
title: Guaranteed resources
description: Learn how Guaranteed Resources on {{% vendor/name %}} provide dedicated CPU and memory allocations for consistent, high-performance workloads. 
weight: -50
---

For applications that need to scale beyond 8 CPUs, {{% vendor/name %}} offers Guaranteed Resources.

Guaranteed Resources ensure that your app or service receives dedicated access to the specified amount of CPU and RAM. These resources are reserved exclusively for your container.

All {{% vendor/name %}} containers use vCPUs (virtual CPUs). Although configuration files and dashboards use the term `CPU`, this always refers to vCPUs, not dedicated physical cores.

vCPU performance can sometimes vary depending on factors such as:

- Cloud provider and region
- System load from other virtual machines or services (in shared mode)

However, using Guaranteed Resources prevents many of these variations by reserving resources just for your container. This kind of allocation provides performance close to dedicated infrastructure, ideal for:

- Backend services  
- Real-time APIs  
- Load testing  
- Performance-sensitive workloads

## Enable Guaranteed Resources

1. Open your project.
2. Click the Configure resources button from the project card or App & Services panel.
3. For each app/service:
   - Select **Guaranteed** or **Shared** as the resource type.
   - Choose the desired CPU and RAM combination.
   - Enter the amount of Disk/Storage to allocate.
4. Click Save. Saving will redeploy your environment, which may cause temporary downtime.

{{% note %}}

You cannot enable Guaranteed Resources if your [container profile is set to `HIGHER_MEMORY`](/manage-resources/adjust-resources.html#advanced-container-profiles).

{{% /note %}}

## View your Allocated Resources

Once Guaranteed Resources is enabled, projects will display an Allocated Resources component in the Console. This shows:

- CPU type: Shared vs. Guaranteed  
- Allocated RAM and Disk  
- Live usage metrics

{{% note %}}

A small portion of host CPU and RAM is used by {{% vendor/name %}}’s system services. The available capacity will be slightly lower than the full allocation selected.

{{% /note %}}

## Pause Environments with Guaranteed Resources

When any app or service in an environment uses Guaranteed Resources, that environment cannot be paused automatically or manually. 

This is because, with Guaranteed Resources, you're billed for the reserved CPU and memory, so allowing pause functionality would lead to potential overuse of reserved compute and incorrect billing.

### To pause the environment again:

1. Switch all containers using Guaranteed Resources back to shared mode.
2. Once no containers are using Guaranteed Resources, the environment can be paused as usual.

{{% note %}}

You can upscale to Guaranteed Resources even if the environment is currently paused. Doing so will automatically resume the environment and apply the changes.

{{% /note %}}

