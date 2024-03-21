---
title: "Root directory"
weight: 10
description:
---

Some of the properties you can define are relative to your app's root directory.
The root defaults to the root of the repository.

```yaml {configFile="app"}
applications:
    frontend:
        type: 'nodejs:{{% latest "nodejs" %}}'
        # Default behavior of source.root
        source:
            root: "/"
```

That is, if a custom value for `source.root` is not provided in your configuration, the default behavior is equivalent to the above.

To specify another directory, for example for a [multi-app project](/create-apps/multi-app/_index.md),
use the [`source.root` property](#source).
