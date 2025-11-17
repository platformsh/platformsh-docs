---
title: "`variables`"
weight: 4
description: A variables dictionary that defines variables to control the environment.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images.

{{% vendor/name %}} provides a number of ways to set [variables](/development/variables/_index.md).
Variables set in your app configuration have the lowest precedence,
meaning they're overridden by any conflicting values provided elsewhere.

All variables set in your app configuration must have a prefix.
Some [prefixes have specific meanings](/development/variables/_index.md#variable-prefixes).

Variables with the prefix `env` are available as a separate environment variable.
All other variables are available in
the [`PLATFORM_VARIABLES` environment variable](/development/variables/use-variables.md#use-provided-variables).

The following example sets two variables:

- A variable named `env:AUTHOR` with the value `Juan` that's available in the environment as `AUTHOR`
- A variable named `d8config:system.site:name` with the value `My site rocks`
  that's available in the `PLATFORM_VARIABLES` environment variable

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
    variables:
      env:
        AUTHOR: 'Juan'
      d8config:
        "system.site:name": 'My site rocks'
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  myapp:
  type: "composable:25.05"
    source:
      root: "/"
    stack: 
      runtimes: [ "python@{{% latest python %}}" ]
    variables:
      env:
        AUTHOR: 'Juan'
      d8config:
        "system.site:name": 'My site rocks'
```

{{< /codetabs >}}


You can also define and access more [complex values](/development/variables/use-variables.md#access-complex-values).

