---
title: "Memcached (Object cache)"
weight: 5
description: |
  Memcached is a simple in-memory object store well-suited for application level caching.
sidebarTitle: "Memcached"
---

{{% description %}}

See the [Memcached documentation](https://memcached.org) for more information.

Both Memcached and Redis can be used for application caching. As a general rule, Memcached is simpler and thus more widely supported while Redis is more robust. Platform.sh recommends using Redis if possible but Memcached is fully supported if an application favors that cache service."

{{% frameworks %}}

- [Drupal](../guides/drupal9/memcached.md)

{{% /frameworks %}}

## Supported versions

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="memcached" status="supported" environment="grid" >}} | {{< image-versions image="memcached" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="memcached" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "memcached" %}}

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

{{< relationship "memcached" >}}

## Usage example

{{% endpoint-description type="memcached" php=true python=true /%}}

{{< codetabs >}}

---
title=Go
file=static/files/fetch/examples/golang/memcached
highlight=go
---

<--->

---
title=Java
file=static/files/fetch/examples/java/memcached
highlight=java
---

<--->

---
title=Node.js
file=static/files/fetch/examples/nodejs/memcached
highlight=js
---

<--->

---
title=PHP
file=static/files/fetch/examples/php/memcached
highlight=php
---

<--->

---
title=Python
file=static/files/fetch/examples/python/memcached
highlight=python
---

{{< /codetabs >}}

## Accessing Memcached directly

To access the Memcached service directly you can use `netcat` as Memcached doesn't have a dedicated client tool. Assuming your Memcached relationship is named `cache`, the host name and port number obtained from `PLATFORM_RELATIONSHIPS` would be `cache.internal` and `11211`. Open an [SSH session](/development/ssh/_index.md) and access the Memcached server as follows:

```bash
netcat cache.internal 11211
```
