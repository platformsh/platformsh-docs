---
title: "Setting up Redis"
weight: -119
description: |
    Setting up Redis for cache, sessions & queues
---

With Laravel, you can use Redis for handling:

- Sessions storage
- Cache storage
- Queues

## Adding the Redis service

Head to `{{< vendor/configfile "app" >}}` and add the following to the `services` key:

```yaml {configFile="app"}
services:
    [...]
    redis:
        type: redis:7.0
```

You can now add it to your application(s) `relationships`:

```yaml {configFile="app"}
applications:
    myapp:
        [...]
        relationships:
            redis: "redis:redis"

services:
    [...]
    redis:
        type: redis:7.0
```

## Redis service configuration

The [Redis](/add-services/redis) configuration is exposed via the following environment variables
(where `REDIS` is the upper-cased version of the key defined in the relationship):

- `REDIS_URL`: The Redis URL
- `REDIS_HOST`: The Redis host
- `REDIS_PORT`: The Redis port
- `REDIS_SCHEME`: The Redis scheme

If the relationship is named `redis`, Laravel automatically detects these variables and configure its own redis driver the right way.
If not, you can map the variables in the `.environment` file.

You can specify the Redis client in your `.environment` configuration:

```bash  {configFile="env"}
export REDIS_CLIENT="phpredis"
```

{{< note theme="warning" >}}

If using `phpredis`, make sure you add `redis` in the list of PHP `runtime` extensions in your `{{< vendor/configfile "app" >}}`:

```yaml {configFile="app"}
applications:
    myapp:
        [...]
        runtime:
            extensions:
                - redis
```

{{< /note >}}

## Storing Laravel cache in Redis

In order to enable cache storage in redis, just add the following to your `.environment` file:

```bash  {configFile="env"}
export CACHE_STORE="redis"
```

## Storing Laravel sessions in Redis

For storing sessions, Laravel relies on the `SESSION_DRIVER` variable. Again, add this new variable to the `.environment` file:

```bash  {configFile="env"}
export SESSION_DRIVER="redis"
```

## Using Redis for Laravel queues

For a basic queueing system, just configure the `QUEUE_CONNECTION` in `.environment`:

```bash  {configFile="env"}
export QUEUE_CONNECTION="redis"
```

Please refer to [Laravel Queues documentation](https://laravel.com/docs/master/queues) for a more in-depth view of the options or review [our Horizon configuration page](./laravel-horizon).
