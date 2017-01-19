# Redis (Object cache)

Redis is a high-performance in-memory object store, well-suited for application level caching.

See the [Redis documentation](https://redis.io/documentation) for more information.

Platform.sh supports two different Redis configurations: One persistent (useful for key-value application data) and one ephemeral (in-memory only, useful for application caching).  Aside from that distinction they are identical.

## Supported versions

* 2.8 (ephemeral only)
* 3.0

> **note**
> The 3.0 version supports up to 64 different databases per instance of the service, while the 2.8 only allows for a single database

### Ephemeral Redis

The `redis` service type, available for both Redis 2.8 and 3.0, is configured to serve as a LRU cache with the eviction policy `allkeys-lru` - its storage is not persistent.  It is not suitable for use except as a disposable cache.

To add an Ephemeral Redis service, specify it in your `.platform/services.yaml` file like so:

```yaml
rediscache:
    type: redis:3.0
```

Data in an Ephemeral Redis instance is stored only in memory, and thus requires no disk space.  When the service hits its memory limit it will automatically evict old cache items to make room for new ones.

### Persistent Redis

The `redis-persistent` service type, available only for Redis 3.0, is configured for persistent storage. That makes it a good choice for fast application-level key-value storage.

To add a Persistent Redis service, specify it in your `.platform/services.yaml` file like so:

```yaml
redisdata:
    type: redis-persistent:3.0
    disk: 1024
```

The `disk` key is required for redis-persistent to tell Platform.sh how much disk space to reserve for Redis' persistent data.

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

The format is identical regardless of whether it's a Persistent or Ephemeral service.

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

    $container->setParameter('redis_host', $relationships['redis'][0]['host']);
    $container->setParameter('redis_port', $relationships['redis'][0]['port']);
}
```

## Using redis-cli to access your Redis service

Assuming your Redis relationship is named `rediscache`, you can access it by
connecting to a host named `rediscache.internal` using the redis-cli tool. Open an [SSH session](/development/ssh.md) and access the Redis server as follows:

```bash
redis-cli -h rediscache.internal
```
