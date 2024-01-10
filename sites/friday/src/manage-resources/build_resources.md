---
title: Build Resources
description: ADD DESCRIPTION
weight: -50
---

When you push changes to your app through Git, your app is built and then deployed.
During the build phase, {{% vendor/name %}} collects your entire app configuration and creates a build image into a dedicated build container.
The amount of resources (CPU and RAM) allocated to that build container affects the duration of the build phase.

During the {{% vendor/name %}} beta phase, DESCRIBE CURRENT SCENARIO W/ BUILD RESOURCES (how many?)

Once {{% vendor/name %}} reaches General Availability,
you will get a fixed amount of build resources for free on a per-project basis:

| Resource type             | Description                                                      | Amount included for free per project (GA)|
|---------------------------|------------------------------------------------------------------|----------------------------------------- |
| CPU build minute          | The amount of CPU consumed over the duration of the build phase. | ???                                      |
| Memory (RAM) build minute | The amount of RAM consumed over the duration of the build phase. | ???                                      |

A CPU build minute is the amount of CPU consumed over the duration of the build phase,
while a RAM build minute is the amount of RAM consumed over the duration of the build phase.

If you consume more CPU and/or RAM build minutes, you will be charged for them.

