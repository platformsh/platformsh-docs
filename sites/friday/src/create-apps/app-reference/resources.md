---
title: "Resources"
weight: 30
description: See how to define `resources` of your application
---

Resources for application containers are not committed to YAML files, but instead managed over the API using either the Console or the `{{% vendor/cli %}} resources:set` command.

For more information, see how to [manage resources](/manage-resources.md).

{{% note %}}
If you're using Composable image, your app container profile defaults to ``HIGH_CPU``.
<BR>If multiple runtimes are added to your stack,
you would need to change the [default container_profile](/manage-resources/adjust-resources.md#advanced-container-profiles)
<br>or change [default CPU and RAM ratio](/manage-resources/resource-init.md) on first deployment using the following commands:
```bash
{{% vendor/cli %}} push --resources-init=manual
```
{{% /note %}}
