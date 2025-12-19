---
title: "additional_hosts"
weight: 4
description: An additional hosts dictionary that maps hostnames to IP addresses.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images.

If you use a private network and have specific IP addresses to connect to,
consider mapping those addresses to hostnames to better remember and organize them.
In such cases, you can add a map of those IP addresses to hostnames of your choice.
Then, when your app tries to access the hostname, the app is directed to the proper IP address.

For example, if your app attempts to access `api.example.com`, it is directed to `192.0.2.23`.


{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'nodejs:{{% latest "nodejs" %}}'
    source:
      root: "/"
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
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack: 
      runtimes: [ "nodejs@{{% latest nodejs %}}" ]
    additional_hosts:
      api.example.com: "192.0.2.23"
      web.example.com: "203.0.113.42"
```

{{< /codetabs >}}

This is equivalent to adding the mapping to the `/etc/hosts` file for the container.

