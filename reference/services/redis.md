# Redis

Redis is an open source (BSD licensed), in-memory data structure store, used as database, cache and message broker.

## Supported versions

* 2.8 (default)

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](reference/environment-variables.md):

```bash
{
    "redis": [
        {
            "host": "248.0.65.198",
            "scheme": "redis",
            "port": 6379
        }
    ]
}
```

## Usage example

In your ``.platform/services.yaml``:

```yaml
myredis:
    type: redis:2.8
```

In your ``.platform.app.yaml``, configure the relationship and enable the [PHP redis extension](user_guide/reference/toolstacks/php/index.html#php-extensions.md):

```yaml
runtime:
    extensions:
        - redis

relationships:
    redis: "myredis:redis"
```

You can them use the service in a configuration file of your application with something like:

```php
<?php
$relationships = getenv("PLATFORM_RELATIONSHIPS");
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['redis'] as $endpoint) {
  $container->setParameter('redis_host', $endpoint['host']);
  $container->setParameter('redis_port', $endpoint['port']);
}
```

**notes**
1. Redis is configured to serve as a cache, its storage is not persistent. You should not use it as a database.
