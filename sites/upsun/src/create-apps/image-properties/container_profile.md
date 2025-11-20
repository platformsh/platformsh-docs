---
title: "`container_profile`"
weight: 4
description: Defines the container profile of the application.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images. 

A _container profile_ is a predefined resource‑configuration category that determines which combinations of CPU and RAM a container can use.

Four container profiles are available: `HIGH_CPU`, `BALANCED`, `HIGH_MEMORY`, and `HIGHER_MEMORY`. Choosing a container size that's offered within the profile means that you don't have to _manually_ configure CPU and RAM. 

By default, {{% vendor/name %}} assigns a container profile and container size when deploying the application for the first time. You can choose from a variety of resource initialization strategies. For details, see the [Resource initialization](/manage-resources/resource-init.md) topic. 

Because {{% vendor/name %}} assigns these values on initial deployment, you typically don't need to change the `container_profile` property. For details and further guidance, see [Adjust a container profile](/manage-resources/adjust-resources.md#adjust-a-container-profile) in the "Resource configuration" topic.

{{% note %}}
The default container profile for a composable image is ``HIGH_CPU``.<br>
<BR>If your stack defines multiple runtimes, you need to do one of the following:
- Change
the [default container_profile](/manage-resources/adjust-resources.md#advanced-container-profiles)
- Change [default CPU and RAM ratio](/manage-resources/resource-init.md) on first deployment using the following
commands:

    ```bash
    {{% vendor/cli %}} push --resources-init=manual
    ```
{{% /note %}}

You can change the container _size_ assigned to an app or service by using the {{% vendor/name %}} CLI or Console: 
- For detailed steps, see the [Resource configuration](/manage-resources/adjust-resources.md). 
- For details about container sizes for each resource allocation strategy (shared CPU, guaranteed CPU, and initial allocation), see the [Advanced: Container profiles](/manage-resources/adjust-resources.md#advanced-container-profiles) section of the "Resource configuration" topic.

