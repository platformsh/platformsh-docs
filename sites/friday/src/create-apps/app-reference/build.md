---
title: "Build"
weight: 130
description:
---

The only property of the `build` dictionary is `flavor`, which specifies a default set of build tasks to run.
Flavors are language-specific.

See what the build flavor is for your language:

- [Node.js](/languages/nodejs/_index.md#dependencies)
- [PHP](/languages/php/_index.md#dependencies)

In all languages, you can also specify a flavor of `none` to take no action at all
(which is the default for any language other than PHP and Node.js).

{{< codetabs >}}
+++
title=Built-in image
+++
This example applies if you set your runtime using [built-in image (``type:``)](/create-apps/app-reference/images/builtin-image.md)

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'nodejs:{{% latest "nodejs" %}}'
        build:
            flavor: none
```

<--->
+++
title=Composable image
+++
This example applies if you set your runtime using [Composable image (``stack:``)](/create-apps/app-reference/images/composable-image.md)

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    stack: ["nodejs@{{% latest nodejs %}}"]
    build:
      flavor: none
```

{{< /codetabs >}}
