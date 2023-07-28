---
title: "Redis (Object cache)"
weight: 20
sidebarTitle: "Redis"
---

[Redis](https://redis.io/documentation) is a multi-model database that allows you to store data in memory
for high-performance data retrieval and key-value storage.
Platform.sh supports two different Redis configurations:

- [Ephemeral](#ephemeral-redis): to set up a non-persistent cache for your application
- [Persistent](#persistent-redis): to set up fast persistent storage for your application

{{% frameworks %}}

- [Drupal](../guides/drupal9/redis.md)
- [Ibexa DXP](../guides/ibexa/deploy.md#cache-and-sessions)
- [Jakarta EE](../guides/jakarta/deploy.md#redis)
- [Micronaut](../guides/micronaut/redis.md)
- [Quarkus](../guides/quarkus/redis.md)
- [Spring](../guides/spring/redis.md)
- [WordPress](../guides/wordpress/redis.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
| {{< image-versions image="redis" status="supported" environment="grid" >}} | {{< image-versions image="redis" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="redis" status="supported" environment="dedicated-gen-2" >}} |

{{% deprecated-versions %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
| {{< image-versions image="redis" status="deprecated" environment="grid" >}} | {{< image-versions image="redis" status="deprecated" environment="dedicated-gen-3" >}} | {{< image-versions image="redis" status="deprecated" environment="dedicated-gen-2" >}} |

Note that versions 3.0 and higher support up to 64 different databases per instance of the service,
while Redis 2.8 only supports a single database.

## Service types

Depending on your needs,
you can set up Redis as [ephemeral](#ephemeral-redis) or [persistent](#persistent-redis).

### Ephemeral Redis

By default, Redis is an ephemeral service that serves as a non-persistent cache.
Ephemeral Redis stores data only in memory and requires no disk space.
When the service reaches its memory limit, it triggers a cache cleanup.
To customize those cache cleanups, set up an [eviction policy](#eviction-policy).

Make sure your app doesn't rely on ephemeral Redis for persistent storage as it can cause issues.
For example, if a container is moved during region maintenance,
the `deploy` and `post_deploy` hooks don't run and an app that treats the cache as permanent shows errors.

To prevent data from getting lost when a container is moved or shut down,
you can use the [persistent Redis](#persistent-redis) configuration.
Persistent Redis provides a cache with persistent storage.

### Persistent Redis

By default, Redis is an [ephemeral](#ephemeral-redis) service that stores data in memory.
This allows for fast data retrieval,
but also means data can be lost when a container is moved or shut down.

To solve this issue, configure your Redis service as persistent.
Persistent Redis stores data on a disk,
restoring it if the container restarts.

To switch from persistent to ephemeral Redis,
set up a new service with a different name.

## Usage example

{{% endpoint-description type="redis" php=true /%}}

{{< codetabs >}}

+++
title=Java
file=static/files/fetch/examples/java/redis
highlight=java
+++

<--->

+++
title=Node.js
file=static/files/fetch/examples/nodejs/redis
highlight=js
+++

<--->

+++
title=PHP
file=static/files/fetch/examples/php/redis
highlight=php
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/redis
highlight=python
+++

{{< /codetabs >}}

## Multiple databases

Redis 3.0 and above support up to 64 databases.
But you can't set up different access rights to each database.
When you set up a relationship connection,
access to all of the databases is automatically granted.

The way to access a particular database depends on the [client library](https://redis.io/clients) you're using:

{{< codetabs >}}

+++
title=PHP
+++

Use the Redis [`select` command](https://redis.io/commands/select):

```php
<?php
$redis->select(0);       // switch to DB 0
$redis->set('x', '42'); // write 42 to x
$redis->move('x', 1);  // move to DB 1
$redis->select(1);    // switch to DB 1
$redis->get('x');    // returns 42
```

<--->

+++
title=Python
+++

To manage [thread safety](https://github.com/redis/redis-py/blob/master/docs/advanced_features.rst#user-content-a-note-about-threading),
the Python library suggests using separate client instances for each database:

```python
from redis import Redis
from platformshconfig import Config

# Get the credentials to connect to the Redis service.
config = Config()
credentials = config.credentials('redis')

database0 = Redis(host='xxxxxx.cache.amazonaws.com', port=6379, db=0)
database1 = Redis(host='xxxxxx.cache.amazonaws.com', port=6379, db=0)
```

<--->

+++
title=Node.js
+++

Use the Redis [`select` command](https://redis.io/commands/select):

```javascript
await client.SELECT(0);                  // switch to DB 0
await client.set('x', '42');            // write 42 to x
await client.MOVE('x', 1);             // move to DB 1
await client.SELECT(1);               // switch to DB 1
const value = await client.get('x'); // returns 42
```

{{< /codetabs >}}

{{% relationship-ref-intro %}}

{{% service-values-change %}}

{{< relationship "redis" >}}

The format of the relationship is identical whether your Redis service is [ephemeral](#ephemeral-redis) or [persistent](#persistent-redis).

## Eviction policy

When [ephemeral Redis](#ephemeral-redis) reaches its memory limit,
it triggers a cache cleanup.
To customize those cache cleanups, set up an eviction policy such as the following:

```yaml {location=".platform.app.yaml"}
web:
    cache:
        type: redis:5.0
        configuration:
            maxmemory_policy: allkeys-lfu
```

The following table presents the possible values:

| Value             | Policy description                                                                                          |
|-------------------|-------------------------------------------------------------------------------------------------------------|
| `allkeys-lru`     | Removes the oldest cache items first. This is the default policy when `maxmemory_policy` isn't set.         |
| `noeviction`      | New items aren’t saved when the memory limit is reached.                                                    |
| `allkeys-lfu`     | Removes least frequently used cache items first.                                                            |
| `volatile-lru`    | Removes least recently used cache items with the `expire` field set to `true`.                              |
| `volatile-lfu`    | Removes least frequently used cache items with the `expire` field set to `true`.                            |
| `allkeys-random`  | Randomly removes cache items to make room for new data.                                                     |
| `volatile-random` | Randomly removes cache items with the `expire` field set to `true`.                                         |
| `volatile-ttl`    | Removes cache items with the `expire` field set to `true` and the shortest remaining `time-to -live` value. |

For more information on the different policies,
see the official [Redis documentation](https://redis.io/docs/reference/eviction/).

## Access your Redis service through the Redis CLI

After you've [configured your Redis service](#usage-example),
you can access it using the [Redis CLI](https://redis.io/docs/ui/cli/).

Retrieve the hostname and port you can connect to
through the `PLATFORM_RELATIONSHIPS` [environment variable](../../development/variables/use-variables.md#use-platformsh-provided-variables).
To do so, run the `platform relationships` command.

After you've retrieved the hostname and port, [open an SSH session](../development/ssh/_index.md).
To access your Redis service, run the following command:

```bash
redis-cli -h {{< variable "HOSTNAME" >}} -p {{< variable "PORT" >}}
```

If you have a Grid project, note that the `CONFIG GET` and `CONFIG SET` admin commands are restricted.
To get the current configuration, run the following command:

```bash
redis-cli -h {{< variable "HOSTNAME" >}} -p {{< variable "PORT" >}} info
```

## Use Redis as a handler for PHP sessions

A PHP session allows you to store different data for each user through a unique session ID.
By default, PHP handles sessions using files.
But you can use Redis as a session handler,
which means Redis stores and retrieves the data saved into sessions.

To set up Redis as your session handler, add a configuration similar to the following:

{{< readFile file="src/registry/images/examples/full/redis-persistent.services.yaml" highlight="yaml" location=".platform/services.yaml" >}}

```yaml {location=".platform.app.yaml"}
relationships:
    sessionstorage: "data:redis"

variables:
    php:
        session.save_handler: redis
        session.save_path: "tcp://{{< variable "HOSTNAME" >}}:{{< variable "PORT" >}}"
```
