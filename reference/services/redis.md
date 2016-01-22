# Redis

Redis is an open source (BSD licensed), in-memory data structure store, used as database, cache and message broker. 
## Supported versions

* 2.8 (default)
* 3.0

> The 3.0 version supports up to 64 different databases per instance of the service, while the 2.8 only allows for a single database

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

or something in the lines of:

```yaml
cache:
    type: redis:3.0
```

In your ``.platform.app.yaml``, configure the relationship and enable the [PHP redis extension](user_guide/reference/toolstacks/php/index.html#php-extensions.md) if you are using PHP:

```yaml
runtime:
    extensions:
        - redis

relationships:
    redis: "myredis:redis"
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
connecting to a host named `redis.internal` using the redis-cli tool. Open an [SSH session](/user_guide/using/use-SSH.html) as follows:
```bash
redis-cli -h redis.internal
```

**notes**
1. Redis is configured to serve as a cache: its storage is not persistent. You should not use it as a database.
