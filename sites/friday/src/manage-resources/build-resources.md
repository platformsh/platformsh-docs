---
title: Build resources
description: Find out how build resources work on {{% vendor/name %}}.
weight: -50
---

When you push changes to your app through Git, your app is built then deployed.

During the build phase, {{% vendor/name %}} collects your entire app configuration and creates a build image into a dedicated build container.
The duration of the build phase is directly linked to the amount of resources (CPU and RAM) allocated to that build container.

As a user, you get the following fixed amount of resources **per project for free**:

- 2.5 CPU hours
- 5 RAM hours

If you consume more CPU or RAM, you get charged for them by the hour.
For more information on the costs incurred, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

You can adjust build resources through the {{% vendor/name %}} API to mitigate potential overuse,
or influence the duration of your builds.
To do so, run a command similar to the following:

```bash {location="Terminal"}
{{% vendor/cli %}} project:curl settings -X PATCH -d '{"build_resources": {"cpu": 4.0, "memory": 2048}}'
```

{{% note %}}

Before adding more CPU and RAM to shorten the duration of your builds,
check that your build process supports using such extra resources.
Otherwise, the duration of your builds will remain the same despite adding more resources.

{{% /note %}}