# Redis (Object cache)

Redis is a high-performance in-memory object cache, well-suited for application level caching.

See the [Redis documentation](https://redis.io/documentation) for more information.

## Supported versions

* 2.8
* 3.0

> **note**
> Redis is configured to serve as a LRU cache with the eviction policy `allkeys-lru` - its storage is not persistent. You should not use it as a database.

> **note**
> The 3.0 version supports up to 64 different databases per instance of the service, while the 2.8 only allows for a single database

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md):

```json
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
rediscache:
    type: redis:3.0
```

If you are using PHP, configure the relationship and enable the [PHP redis extension](/languages/php.md#php-extensions.md) in your `.platform.app.yaml`.

```yaml
runtime:
    extensions:
        - redis

relationships:
    redis: "rediscache:redis"
```

You can then use the service in a configuration file of your application with something like:

```php
<?php
if (getenv('PLATFORM_RELATIONSHIPS')) {
    $relationships = json_decode(base64_decode(getenv('PLATFORM_RELATIONSHIPS')), true);

    foreach ($relationships['redis'] as $endpoint) {
        $container->setParameter('redis_host', $endpoint['host']);
        $container->setParameter('redis_port', $endpoint['port']);
    }
}
```

## Using redis-cli to access your Redis service

Assuming your Redis relationship is named `redis`, you can access it by
connecting to a host named `redis.internal` using the redis-cli tool. Open an [SSH session](/development/ssh.md) and access the Redis server as follows:

```bash
redis-cli -h redis.internal
```
