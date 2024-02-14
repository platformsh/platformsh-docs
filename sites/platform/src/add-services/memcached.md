---
title: "Memcached (Object cache)"
weight: -50
description: |
  Memcached is a simple in-memory object store well-suited for application level caching.
sidebarTitle: "Memcached"
---

{{% description %}}

See the [Memcached documentation](https://memcached.org) for more information.

Both Memcached and Redis can be used for application caching. As a general rule, Memcached is simpler and thus more widely supported while Redis is more robust. {{% vendor/name %}} recommends using Redis if possible but Memcached is fully supported if an application favors that cache service.

{{% frameworks version="1" %}}

- [Drupal](../guides/drupal/memcached.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="memcached" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="memcached" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="memcached" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

\* No High-Availability on {{% names/dedicated-gen-2 %}}.

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
{
    "service": "memcached16",
    "ip": "169.254.228.111",
    "hostname": "3sdm72jgaxge2b6aunxdlzxyea.memcached16.service._.eu-3.{{< vendor/urlraw "hostname" >}}",
    "cluster": "rjify4yjcwxaa-master-7rqtwti",
    "host": "memcached.internal",
    "rel": "memcached",
    "scheme": "memcached",
    "type": "memcached:{{% latest "memcached" %}}",
    "port": 11211
}
```

## Usage example

{{% endpoint-description type="memcached" php=true python=true /%}}

{{< codetabs >}}

+++
title=Go
file=static/files/fetch/examples/golang/memcached
highlight=go
+++

<--->

+++
title=Java
file=static/files/fetch/examples/java/memcached
highlight=java
+++

<--->

+++
title=Node.js
file=static/files/fetch/examples/nodejs/memcached
highlight=js
+++

<--->

+++
title=PHP
file=static/files/fetch/examples/php/memcached
highlight=php
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/memcached
highlight=python
+++

{{< /codetabs >}}

## Accessing Memcached directly

To access the Memcached service directly you can use `netcat` as Memcached doesn't have a dedicated client tool. Assuming your Memcached relationship is named `cache`, the host name and port number obtained from `{{< vendor/prefix >}}_RELATIONSHIPS` would be `cache.internal` and `11211`. Open an [SSH session](/development/ssh/_index.md) and access the Memcached server as follows:

```bash
netcat cache.internal 11211
```

{{% service-values-change %}}
