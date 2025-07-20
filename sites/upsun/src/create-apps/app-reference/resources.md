---
title: "`resources`"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

Resources for application containers are not committed to YAML files, but instead managed over the API using either the
Console or the `{{% vendor/cli %}} resources:set` command.

For more information, see how to [manage resources](/manage-resources.md).

{{% note title="Composable image" theme="info" %}}
Composable image container profile defaults to ``HIGH_CPU``.
<BR>If multiple runtimes are added to your stack,
you would need to change
the [default container_profile](/manage-resources/adjust-resources.md#advanced-container-profiles)
<br>or change [default CPU and RAM ratio](/manage-resources/resource-init.md) on first deployment using the following
commands:

```bash
{{% vendor/cli %}} push --resources-init=manual
```

{{% /note %}}