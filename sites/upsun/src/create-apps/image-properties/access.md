---
title: "`access`"
weight: 4
description: An access dictionary that defines the access control for roles accessing app environments.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images. 

The `access` dictionary has one allowed key:

| Name  | Allowed values                      | Default       | Description                                                           |
|-------|-------------------------------------|---------------|-----------------------------------------------------------------------|
| `ssh` | `admin`, `contributor`, or `viewer` | `contributor` | Defines the minimum role required to access app environments via SSH. |

In the following example, only users with `admin` permissions for the
given [environment type](/administration/users.md#environment-type-roles)
can access the deployed environment via SSH:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "python:{{% latest "python" %}}"
    source:
      root: "/"
    access:
      ssh: admin
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack: 
      runtimes: [ "python@{{% latest python %}}" ]
    access:
      ssh: admin
```

{{< /codetabs >}}

