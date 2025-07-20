---
title: "`container_profile`"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

Optional. By default, {{% vendor/name %}} allocates a container profile to each app and service depending on the range of resources it’s
expected to need.

Each container profile gives you access to a specific list of CPU and RAM combinations.
Using the {{% vendor/name %}} CLI or Console, you can then pick a CPU and RAM combination for each of your apps and services.

- [Container profile types and resources](/manage-resources/adjust-resources.md#advanced-container-profiles)
- [Default container profiles](/manage-resources/adjust-resources.md#default-container-profiles) for runtime and service
  containers
- [Customize resources using the `container_profile` key](/manage-resources/adjust-resources.md#adjust-a-container-profile)