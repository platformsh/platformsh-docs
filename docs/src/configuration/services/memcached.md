---
title: "Memcached (Object cache)"
weight: 5
description: |
  Memcached is a simple in-memory object store well-suited for application level caching.
sidebarTitle: "Memcached"
---

{{< description >}}

See the [Memcached](https://memcached.org) for more information.

Both Memcached and Redis can be used for application caching. As a general rule, Memcached is simpler and thus more widely supported while Redis is more robust. Platform.sh recommends using Redis if possible but Memcached is fully supported if an application favors that cache service."

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="memcached" status="supported" environment="grid" >}} | {{< image-versions image="redis" status="memcached" environment="dedicated" >}} | {{< image-versions image="redis" status="memcached" environment="dedicated-gen-3" >}} |

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{{< relationship "memcached" >}}

## Usage example

{{% endpoint-description type="memcached" %}}

[Service definition](./_index.md):

{{< readFile file="src/registry/images/examples/full/memcached.services.yaml" highlight="yaml" >}}

[App configuration](../app/app-reference.md):

{{< readFile file="src/registry/images/examples/full/memcached.app.yaml" highlight="yaml" >}}

If you are using PHP, configure the relationship and enable the [PHP memcached extension](/languages/php/extensions.md) in your `.platform.app.yaml`.  (Note that the `memcached` extension requires `igbinary` and `msgpack` as well, but those will be enabled automatically.)

```yaml
runtime:
    extensions:
        - memcached
```

For Python, you need to include a dependency for a Memcached library, either via your requirements.txt file or a global dependency. As a global dependency you would add the following to `.platform.app.yaml`:

```yaml
dependencies:
    python:
        python-memcached: '*'
```

{{% /endpoint-description %}}

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
