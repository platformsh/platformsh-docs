---
title: "`additional_hosts`"
weight: 4
description: An additional hosts dictionary that maps hostnames to IP addresses.
---

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images.

{{% description %}}

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:{{% latest "php" %}}'
    additional_hosts:
      api.example.com: "192.0.2.23"
      web.example.com: "203.0.113.42"
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
    stack: [ "php@{{% latest php %}}" ]
    additional_hosts:
      api.example.com: "192.0.2.23"
      web.example.com: "203.0.113.42"
```

{{< /codetabs >}}

This is equivalent to adding the mapping to the `/etc/hosts` file for the container.
