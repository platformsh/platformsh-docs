---
title: "`container_profile`"
weight: 4
description: Defines the container profile of the application.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images. 

By default, {{% vendor/name %}} allocates a container profile to each app and service depending on the range of resources it’s
expected to need.

Each container profile gives you access to a specific list of CPU and RAM combinations.
Using the {{% vendor/name %}} CLI or Console, you can then pick a CPU and RAM combination for each of your apps and services.

To help you choose a container profile based on your preferred resource allocation strategy (shared CPU or guaranteed CPU), refer to the [Advanced: Container profile](/manage-resources/adjust-resources.html#advanced-container-profiles) section of the "Resource configuration" topic. There, you'll find the following details:
- Shared CPU container sizes
- Guaranteed CPU container sizes
- Default container profiles
- Adjusting a container profile