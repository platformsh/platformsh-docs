---
title: How resources work on {{% vendor/name %}}
description: Understand how resources work on {{% vendor/name %}} Flex. Learn the differences between shared and guaranteed CPU, how RAM is allocated, and how to configure scalable resources for your apps.
weight: -400
keywords:
  - "resources"
  - "flexible resources"
  - "CPU"
  - "RAM"
  - "disk storage"
---

On **{{% vendor/name %}} Flex**, you have granular control over your application's resources. Instead of choosing from pre-defined plans, you can configure resources (CPU, RAM, and disk) per environment for each of your apps and services. You can also add instances for each of your apps depending on your needs.

Understanding how {{% vendor/name %}} allocates these resources is key to building stable and cost-effective architecture for your project.

For information on costs related to resource usage, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

## CPUs vs. vCPUs

Throughout our product and documentation, when we refer to **CPU**, we are describing **vCPUs (virtual CPUs)**. A vCPU is a virtual representation of a physical CPU core. This is the standard for cloud computing, as it allows a physical server's resources to be securely divided among multiple applications.

vCPU performance can sometimes vary depending on factors such as:

- Cloud provider and [region](/development/regions.html)  
- System load from other containers on a shared host (in shared mode)

## CPU: Shared vs. Guaranteed

CPU resources can be allocated in two distinct ways. This choice allows you to precisely balance cost with performance needs for each individual container in your project.

### Shared CPU (Default)

By default, projects on {{% vendor/name %}} run on a **shared infrastructure**.

Our shared infrastructure is designed to provide CPU performance that typically aligns with the resources you've purchased. However, because this environment is shared among multiple tenants, performance can occasionally vary due to "noisy neighbor" effects — where other workloads on the same physical host temporarily consume more system resources.

In most cases, this variability is short-lived and performance returns to normal levels without intervention. We continuously monitor performance at the regional level to detect and mitigate systemic issues, by constantly balancing containers to hosts that are less busy.

However, if you experience prolonged or recurring performance issues that may be caused by noisy neighbors, please open a support ticket so our team can investigate directly.

If you require fully consistent and isolated performance, we recommend using our [Guaranteed Resources](/manage-resources/guaranteed-resources) offering, which provides [dedicated CPU allocations](#guaranteed-cpu) and eliminates variability from shared usage.

{{< note theme="info" >}}

 It should be noted that projects are always kept **strictly isolated** from each other. This behaviour applies to both [Fixed and Flex](/administration/organizations.md#fixed-and-flex-organizations) projects.

{{< /note >}}

**Best for:**  
- Containers in development/staging environments  
- Production containers with low-to-moderate traffic  

**Consideration:**  
- Performance can be variable due to the "noisy neighbour" effect inherent in shared infrastructure.

### Guaranteed CPU

With [Guaranteed CPU](/manage-resources/guaranteed-resources), your container is placed on a dedicated host, and the host's CPU resources are reserved exclusively for your container's use. This provides the highest level of CPU performance and predictability by eliminating any "noisy neighbour" effect.

**Best for:**  
- High-traffic production application containers  
- Resource-intensive services (e.g. database, search engine)  
- Any container requiring large resource allocations with consistent and predictable performance  

**Consideration:**  
- This option has a higher cost due to its dedicated nature.  
- A small portion of host CPU and RAM is used by {{% vendor/name %}}’s system services. The available capacity will be slightly lower than the full allocation selected.

## Memory (RAM)

The memory (RAM) you configure for a container is **always guaranteed**.

This means the full amount of RAM you define is exclusively available to that container and is never shared. This guarantees predictable memory performance and prevents issues caused by other applications on the same host, regardless of your chosen CPU type.

