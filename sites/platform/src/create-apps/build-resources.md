---
title: Build resources
description: Find out how build resources work on {{% vendor/name %}}.
weight: 14
---

When you push changes to your app through Git, your app is built then deployed.

During the build phase, {{% vendor/name %}} collects your entire app configuration and creates a build image into a dedicated build container.
The duration of the build phase is directly linked to the amount of resources (CPU and RAM) allocated to that build container.

To manage those build resources, add the following configuration:

```yaml {configFile="apps"}
"build_resources": {
   "enabled": false, #Build resources can only be effectively adjusted once this key is set to true.
   "max_cpu": 4.0, #The maximum amount of allowed CPU (minimum is a hardcoded 0.1)
   "max_memory": 10240 #The maximum amount of allowed RAM (minimum is a hardcoded 64)
}
```

You can then adjust build resources through the {{% vendor/name %}} API to mitigate potential overuse,
or influence the duration of your builds.
To do so, run commands similar to the following:

```bash {location="Terminal"}
{{% vendor/cli %}} project:curl capabilities -X PATCH -d '{"build_resources": {"enabled": true}}' 
{{% vendor/cli %}} project:curl settings -X PATCH -d '{"build_resources": {"cpu": 4.0, "memory": 2048}}'
```

{{% note %}}

Before adding more CPU and RAM to shorten the duration of your builds,
check that your build process supports using such extra resources.
Otherwise, the duration of your builds will remain the same despite adding more resources.

{{% /note %}}