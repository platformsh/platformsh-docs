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

- [Default container profiles](/manage-resources/adjust-resources.md#default-container-profiles) for runtime and service containers
- [Advanced: Container profile types and resources](/manage-resources/adjust-resources.md#advanced-container-profiles)
- [Customize resources using the `container_profile` key](/manage-resources/adjust-resources.md#adjust-a-container-profile)