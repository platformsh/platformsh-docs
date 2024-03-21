---
title: "Additional hosts"
weight: 190
description:
---

If you're using a private network with specific IP addresses you need to connect to,
you might want to map those addresses to hostnames to better remember and organize them.
In such cases, you can add a map of those IP addresses to whatever hostnames you like.
Then when your app tries to access the hostname, it's sent to the proper IP address.

So in the following example, if your app tries to access `api.example.com`, it's sent to `192.0.2.23`.
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
    type: 'php:{{% latest "php" %}}'
    additional_hosts:
      api.example.com: "192.0.2.23"
      web.example.com: "203.0.113.42"
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
    stack: [ "php@{{% latest php %}}" ]
    additional_hosts:
      api.example.com: "192.0.2.23"
      web.example.com: "203.0.113.42"
```

{{< /codetabs >}}

This is equivalent to adding the mapping to the `/etc/hosts` file for the container.
