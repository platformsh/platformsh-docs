---
title: "`access`"
weight: 4
description: An access dictionary that defines the access control for roles accessing app environments.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images.


The `access` dictionary has one allowed key:

| Name  | Allowed values                      | Default       | Description |
| ----- | ----------------------------------- | ------------- | ----------- |
| `ssh` | `admin`, `contributor`, or `viewer` | `contributor` | Defines the minimum role required to access app environments via SSH. |

In the following example, only users with `admin` permissions for the given [environment type](/administration/users.md#environment-type-roles)
can access the deployed environment via SSH:

```yaml {configFile="app"}
access:
  ssh: admin
``` 

<!-- another option for getting back to the single/composable topics 
Related topics:
* [Single-runtime image](/create-apps/app-reference/single-runtime-image.md) 
* [Composable image](/create-apps/app-reference/composable-image.md) 
-->