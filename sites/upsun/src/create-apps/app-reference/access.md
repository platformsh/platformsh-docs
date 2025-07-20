---
title: "`access`"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

Optional. The `access` dictionary has one allowed key:

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

