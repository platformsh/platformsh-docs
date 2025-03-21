---
title: "Set up Redis"
weight: -119
description: |
    Setting up Redis for cache, sessions & queues
---

With Laravel, you can use Redis to handle session storage, cache storage, and queues.

{{% note theme="warning" title="New versions of Redis no longer supported" %}}

Please note that newer versions after Redis 7.2 will no longer be supported by {{% vendor/name %}} due to [licensing changes](https://redis.com/blog/redis-adopts-dual-source-available-licensing/). Valkey is available on all our products as a viable alternative open source datastore. 

**Please read the {{% vendor/name %}} [Valkey documentation](/add-services/valkey) for more information.**

{{% /note %}}

## 1. Add the Redis service

1. [Add the service](/add-services.md#add-a-service) to your app configuration using the `services` top-level key:

   ```yaml {configFile="app"}
   services:
     [...]
     redis:
       type: redis:7.0
   ```

2. To connect the service to your app, add the following relationship:

   ```yaml {configFile="app"}
   applications:
     myapp:
       [...]
       relationships:
         redis:

   services:
     [...]
     redis:
       type: redis:7.0
   ```

## 2. Configure your Redis service

The [Redis](/add-services/redis.md) configuration is exposed via the following environment variables
(where `REDIS` is the upper-cased version of the key defined in the relationship):

- `REDIS_URL`: The Redis URL
- `REDIS_HOST`: The Redis host
- `REDIS_PORT`: The Redis port
- `REDIS_SCHEME`: The Redis scheme

If the relationship is named `redis`, Laravel automatically detects these variables and configure its own Redis driver the right way.
If not, you can map the variables in the `.environment` file.

You can specify the Redis client in your `.environment` file:

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

## 3. Store the Laravel cache in Redis

To enable cache storage in Redis, add the following environment variable to your `.environment` file:

```bash  {configFile="env"}
export CACHE_STORE="redis"
```

## 4. Store Laravel sessions in Redis

Laravel relies on the `SESSION_DRIVER` variable to store sessions. Therefore, add the following environment variable to your `.environment` file:

```bash  {configFile="env"}
export SESSION_DRIVER="redis"
```

## 5. Use Redis for Laravel queues

For a basic queueing system, configure the `QUEUE_CONNECTION` in your `.environment` file as follows:

```bash  {configFile="env"}
export QUEUE_CONNECTION="redis"
```

For more information, see the [Laravel Queues documentation](https://laravel.com/docs/master/queues)
and {{% vendor/name %}}'s [Horizon configuration page](/get-started/stacks/laravel/laravel-horizon.md).

{{< guide-buttons previous="Back" next="Handle queues with Horizon" nextLink="/get-started/stacks/laravel/laravel-horizon.md" type="*" >}}
