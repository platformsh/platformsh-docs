---
title: Build Resources
description: Find out how build resources work on {{% vendor/name %}}.
weight: -50
---

When you push changes to your app through Git, your app is built then deployed.
During the build phase, {{% vendor/name %}} collects your entire app configuration and creates a build image into a dedicated build container.
The duration of the build phase is directly linked to the amount of resources (CPU and RAM) allocated to that build container.

As a user, you get the following fixed amount of resources **per project for free**:

- 2.5 CPU hours
- 5 memory hours

If you consume more CPU or RAM, you get charged for them by the hour.
For more information on the costs incurred, see the [Upsun pricing page](https://upsun.com/pricing/).