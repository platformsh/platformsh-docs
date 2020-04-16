---
title: "Memcached (Object cache)"
weight: 5
description: |
  Memcached is a simple in-memory object store well-suited for application level caching.
sidebarTitle: "Memcached"
---

{{< description >}}

See the [Memcached](https://memcached.org) for more information.

Both Memcached and Redis can be used for application caching.  As a general rule, Memcached is simpler and thus more widely supported while Redis is more robust.  Platform.sh recommends using Redis if possible but Memcached is fully supported if an application favors that cache service."

## Supported versions

{{< image-versions image="memcached" status="supported" >}}

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables/#platformsh-provided-variables):

{{< highlight json >}}
{{< remote url="https://examples.docs.platform.sh/relationships/memcached" >}}
{{< /highlight >}}

## Usage example

In your ``.platform/services.yaml``:

{{< readFile file="src/registry/images/examples/full/memcached.services.yaml" highlight="yaml" >}}

Now add a relationship in your `.platform.app.yaml` file:

{{< readFile file="src/registry/images/examples/full/memcached.app.yaml" highlight="yaml" >}}

If you are using PHP, configure the relationship and enable the [PHP memcached extension](/languages/php/#php-extensions/) in your `.platform.app.yaml`.  (Note that the `memcached` extension requires `igbinary` and `msgpack` as well, but those will be enabled automatically.)

```yaml
runtime:
    extensions:
        - memcached
```

For Python you will need to include a dependency for a Memcached library, either via your requirements.txt file or a global dependency.  As a global dependency you would add the following to `.platform.app.yaml`:

```yaml
dependencies:
    python:
       python-memcached: '*'
```

You can then use the service in a configuration file of your application with something like:

{{< tabs "Go" "Java" "Nodejs" "PHP" "Python" >}}

{{< tab id="Go" active="true" >}}
{{< highlight go >}}
{{< readFile file="static/files/fetch/examples/golang/memcached" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Java" >}}
{{< highlight java >}}
{{< readFile file="static/files/fetch/examples/java/memcached" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Nodejs" >}}
{{< highlight js >}}
{{< readFile file="static/files/fetch/examples/nodejs/memcached" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="PHP" >}}
{{< highlight php >}}
{{< readFile file="static/files/fetch/examples/php/memcached" >}}
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Python" >}}
{{< highlight python >}}
{{< readFile file="static/files/fetch/examples/python/memcached" >}}
{{< /highlight >}}
{{< /tab >}}

{{< /tabs >}}

## Accessing Memcached directly

To access the Memcached service directly you can simply use `netcat` as Memcached does not have a dedicated client tool.  Assuming your Memcached relationship is named `cache`, the host name and port number obtained from `PLATFORM_RELATIONSHIPS` would be `cache.internal` and `11211`. Open an [SSH session](/development/ssh/) and access the Memcached server as follows:

```bash
netcat cache.internal 11211
```
