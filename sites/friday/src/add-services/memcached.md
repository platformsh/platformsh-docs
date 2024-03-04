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

{{< image-versions image="memcached" status="supported" environment="grid" >}}

{{% relationship-ref-intro %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
MEMCACHEDCACHE_SERVICE=memcached
MEMCACHEDCACHE_IP=123.456.78.90
MEMCACHEDCACHE_HOSTNAME=azertyuiopqsdfghjklm.memcached.service._.eu-1.{{< vendor/urlraw "hostname" >}}
MEMCACHEDCACHE_CLUSTER=azertyuiopqsdf-main-afdwftq
MEMCACHEDCACHE_HOST=memcachedcache.internal
MEMCACHEDCACHE_REL=memcached
MEMCACHEDCACHE_SCHEME=memcached
MEMCACHEDCACHE_TYPE=memcached:{{% latest "memcached" %}}
MEMCACHEDCACHE_PORT=11211
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal.

```yaml
{
    "service": "memcached",
    "ip": "123.456.78.90",
    "hostname": "azertyuiopqsdfghjklm.memcached.service._.eu-3.{{< vendor/urlraw "hostname" >}}",
    "cluster": "azertyuiopqsdf-main-afdwftq",
    "host": "memcached.internal",
    "rel": "memcached",
    "scheme": "memcached",
    "type": "memcached:{{% latest "memcached" %}}",
    "port": 11211
}
```

Example on how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_MEMCACHED_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.memcachedcache[0].host')"
```

{{< /codetabs >}}

## Usage example

{{% endpoint-description type="memcached" php=true python=true /%}}

```yaml {configFile="app"}
{{% snippet name="myapp" config="app" root="myapp"  %}}

# Other options...

# Relationships enable an app container's access to a service.
relationships:
    memcachedcache: "memcached:memcached"
{{% /snippet %}}
{{% snippet name="memcached" config="service" placeholder="true"  %}}
    type: memcached:{{% latest "memcached" %}}
{{% /snippet %}}
```

{{% v2connect2app serviceName="memcached" relationship="memcachedcache" var="CACHE_URL"%}}

```bash {location="myapp/.environment"}
# Surface a Memcached connection string for use in app.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-specific-variables.
export CACHE_URL="${MEMCACHEDCACHE_HOST}:${MEMCACHEDCACHE_PORT}"
```

{{% /v2connect2app %}}

## Accessing Memcached directly

To access the Memcached service directly you can use `netcat` as Memcached doesn't have a dedicated client tool.
Assuming your Memcached relationship is named `memcachedcache`, the host name `MEMCACHEDCACHE_HOST` and port number `MEMCACHEDCACHE_PORT` obtained from the [service environment variable](#relationship-reference) would be `memcachedcache.internal` and `11211`.
Open an [SSH session](/development/ssh/_index.md) and access the Memcached server as follows:

```bash {location="Terminal"}
netcat memcachedcache.internal 11211
```

{{% service-values-change %}}
