---
title: "`additional_hosts`"
weight: 4
description: An additional hosts dictionary that maps hostnames to IP addresses.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images.

If you’re using a private network with specific IP addresses you need to connect to, you might want to map those addresses to hostnames to better remember and organize them. In such cases, you can add a map of those IP addresses to whatever hostnames you like. Then when your app tries to access the hostname, it’s sent to the proper IP address.

So in the following example, if your app tries to access api.example.com, it’s sent to 192.0.2.23.

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'php:{{% latest "php" %}}'
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
    stack: 
      runtimes: [ "php@8.4" ]
    source:
      root: "/"
    additional_hosts:
      api.example.com: "192.0.2.23"
      web.example.com: "203.0.113.42"
```

{{< /codetabs >}}

This is equivalent to adding the mapping to the `/etc/hosts` file for the container.
