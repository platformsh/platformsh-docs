# Memcache (Object cache)

Memcache is a simple in-memory object store well-suited for application level caching.

See the [Memcache documentation](https://memcached.org/) for more information.

Both Memcache and Redis can be used for application caching.  As a general rule, Memcache is simpler and thus more widely supported while Redis is more robust.  Platform.sh recommends using Redis if possible but Memcache is fully supported if an application favors that cache service.

## Supported versions

* 1.4

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

```json
{
    "cache": [
        {
            "host": "248.0.65.198",
            "scheme": "memcache",
            "port": 11211
        }
    ]
}
```

## Usage example

In your ``.platform/services.yaml``:

```yaml
memcache:
    type: memcache:1.4
```

If you are using PHP, configure the relationship and enable the [PHP memcached extension](/languages/php.md#php-extensions.md) in your `.platform.app.yaml`.  (Note that the `memcached` extension requires `igbinary` and `msgpack` as well, but those will be enabled automatically.)

```yaml
runtime:
    extensions:
        - memcached

relationships:
    cache: "memcache:memcache"
```

You can then use the service in a configuration file of your application with something like:


{% codetabs name="PHP", type="php" -%}
<?php

if (!isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
    return;
}

$relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);
$rel = $relationships['cache'][0];

$m = new Memcached();
$m->addServer($rel['host'], $rel['port']);
$m->setOption(Memcached::OPT_BINARY_PROTOCOL, true);

$m->set('int', 99);
$m->set('string', 'a simple string');
$m->set('array', array(11, 12));
/* expire 'object' key in 5 minutes */
$m->set('object', new stdclass, time() + 300);

{%- language name="Python", type="py" -%}
import memcache
import os
import json
import base64

relationships = os.getenv('PLATFORM_RELATIONSHIPS')
if relationships:
    relationships = json.loads(base64.b64decode(relationships).decode('utf-8'))
    memcache_settings = relationships['cache'][0]

    mc = memcache.Client([memcache_settings['host'] + ':' + str(memcache_settings['port'])], debug=0)

    mc.set("an_int", 99)
    #print "Int Value: {}<br />\n".format(mc.get("an_int"))

    mc.set("a_sring", "a simple string")
    mc.delete("a_string")
    #print "String Value: {}<br />\n".format(mc.get("a_string"))

    #mc.set("key", "1")   # note that the key used for incr/decr must be a string.
    mc.incr("key")
    mc.decr("key")
    #print "Counter Value: {}<br />\n".format(mc.get("key"))
{%- endcodetabs %}


## Accessing Memcache directly

To access the Memcache service directly you can simply use `netcat` as Memcache does not have a dedicated client tool.  Assuming your Memcache relationship is named `cache`, the host name and port number obtained from `PLATFORM_RELATIONSHIPS` would be `cache.internal` and `11211`. Open an [SSH session](/development/ssh.md) and access the Memcache server as follows:

```bash
netcat cache.internal 11211
```
