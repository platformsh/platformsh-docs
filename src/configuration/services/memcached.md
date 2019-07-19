# Memcached (Object cache)

Memcached is a simple in-memory object store well-suited for application level caching.

See the [Memcached documentation](https://memcached.org/) for more information.

Both Memcached and Redis can be used for application caching.  As a general rule, Memcached is simpler and thus more widely supported while Redis is more robust.  Platform.sh recommends using Redis if possible but Memcached is fully supported if an application favors that cache service.

## Supported versions

* 1.4

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/memcached", language="json" %}{% endcodesnippet %}

## Usage example

In your ``.platform/services.yaml``:

```yaml
memcached:
    type: memcached:1.4
```

Now add a relationship in your `.platform.app.yaml` file:

```yaml
relationships:
    cache: "memcached:memcached"
```

{% codetabs name="PHP", type="text" -%}
If you are using PHP, configure the relationship and enable the [PHP memcached extension](/languages/php.md#php-extensions.md) in your `.platform.app.yaml`.  (Note that the `memcached` extension requires `igbinary` and `msgpack` as well, but those will be enabled automatically.)

```yaml
runtime:
    extensions:
        - memcached
```

{%- language name="Python", type="text" -%}
For Python you will need to include a dependency for a Memcached library, either via your requirements.txt file or a global dependency.  As a global dependency you would add the following to `.platform.app.yaml`:

```yaml
dependencies:
    python:
       python-memcached: '*'
```

{%- endcodetabs %}

You can then use the service in a configuration file of your application with something like:

{% codetabs name="PHP", type="php", url="https://examples.docs.platform.sh/php/memcached" -%}

{%- language name="Node.js", type="js", url="https://examples.docs.platform.sh/nodejs/memcached" -%}

{%- language name="Python", type="py", url="https://examples.docs.platform.sh/python/memcached" -%}

{%- language name="Java", type="java", url="https://examples.docs.platform.sh/java/memcached" -%}

{%- language name="Go", type="go", url="https://examples.docs.platform.sh/golang/memcached" -%}

{%- endcodetabs %}

## Accessing Memcached directly

To access the Memcached service directly you can simply use `netcat` as Memcached does not have a dedicated client tool.  Assuming your Memcached relationship is named `cache`, the host name and port number obtained from `PLATFORM_RELATIONSHIPS` would be `cache.internal` and `11211`. Open an [SSH session](/development/ssh.md) and access the Memcached server as follows:

```bash
netcat cache.internal 11211
```
