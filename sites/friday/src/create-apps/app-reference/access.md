---
title: "Access"
weight: 100
description:
---

The `access` dictionary has one allowed key:

| Name  | Allowed values                      | Default       | Description                                                           |
|-------|-------------------------------------|---------------|-----------------------------------------------------------------------|
| `ssh` | `admin`, `contributor`, or `viewer` | `contributor` | Defines the minimum role required to access app environments via SSH. |

In the following example, only users with `admin` permissions for the
given [environment type](/administration/users.md#environment-type-roles)
can access the deployed environment via SSH:

{{< codetabs >}}
+++
title=Built-in image
+++
This example applies if you set your runtime
using [built-in image (``type:``)](/create-apps/app-reference/images/builtin-image.md)

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'python:{{% latest "python" %}}'
    access:
      ssh: admin
```

<--->
+++
title=Composable image
+++
This example applies if you set your runtime
using [Composable image (``stack:``)](/create-apps/app-reference/images/composable-image.md)

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    stack: [ "python@{{% latest python %}}" ]
    access:
      ssh: admin
```

{{< /codetabs >}}
