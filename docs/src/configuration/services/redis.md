---
title: "Redis (Object cache)"
weight: 11
sidebarTitle: "Redis"
---

Redis is a high-performance in-memory object store, well-suited for application level caching.

See the [Redis documentation](https://redis.io/documentation) for more information.

Platform.sh supports two different Redis configurations: One persistent (useful for key-value application data) and one ephemeral (in-memory only, useful for application caching). Aside from that distinction they are identical.

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="redis" status="supported" environment="grid" >}} | {{< image-versions image="redis" status="supported" environment="dedicated" >}} | {{< image-versions image="redis" status="supported" environment="dedicated-gen-3" >}} |

{{% deprecated-versions %}}

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="redis" status="deprecated" environment="grid" >}} | {{< image-versions image="redis" status="deprecated" environment="dedicated" >}} | {{< image-versions image="redis" status="deprecated" environment="dedicated-gen-3" >}} |

{{< note >}}
Versions 3.0 and higher support up to 64 different databases per instance of the service, but Redis 2.8 is configured to support only a single database.
{{< /note >}}

## Ephemeral Redis

The `redis` service type is configured to serve as an LRU cache; its storage is not persistent.  It is not suitable for use except as a disposable cache.

To add an ephemeral Redis service, specify it in your `.platform/services.yaml` file like so:

{{< readFile file="src/registry/images/examples/full/redis.services.yaml" highlight="yaml" >}}

Data in an Ephemeral Redis instance is stored only in memory and thus requires no disk space. When the service hits its memory limit it will automatically evict old cache items according to the [configured eviction rule](#eviction-policy) to make room for new ones.

Your app must not treat ephemeral Redis as permanent. Instead, the cache needs to be regenerated as necessary. For example, if a container is moved for a reason such as region maintenance, the `deploy` and `post_depoly` hooks won't be run and an app that treats the cache as permanent will show errors. The cache should be cleared each time the app is restarted, in the `start` key in [your web configuration](/configuration/app/app-reference.md#commands).

If your app needs to treat the cache as permanent, use [persistent Redis](#persistent-redis), which will save data to its volume even when the container is shut down.

## Persistent Redis

The `redis-persistent` service type is configured for persistent storage. That makes it a good choice for fast application-level key-value storage.

To add a Persistent Redis service, specify it in your `.platform/services.yaml` file like so:

{{< readFile file="src/registry/images/examples/full/redis-persistent.services.yaml" highlight="yaml" >}}

The `disk` key is required for redis-persistent to tell Platform.sh how much disk space to reserve for Redis' persistent data.

{{< note >}}
Switching a service from Persistent to Ephemeral configuration is not supported at this time.  To switch between modes, use a different service with a different name.
{{< /note >}}

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{{< relationship "redis" >}}

The format is identical regardless of whether it's a persistent or ephemeral service.

## Usage example

In your ``.platform/services.yaml``:

{{< readFile file="src/registry/images/examples/full/redis.services.yaml" highlight="yaml" >}}

If you are using PHP, configure a relationship and enable the [PHP redis extension](/languages/php/extensions.md) in your `.platform.app.yaml`.

```yaml
runtime:
    extensions:
        - redis

relationships:
    rediscache: "cacheredis:redis"
```

You can then use the service in a configuration file of your application with something like:

{{< codetabs >}}

---
title=Java
file=static/files/fetch/examples/java/redis
highlight=java
---

<--->

---
title=Node.js
file=static/files/fetch/examples/nodejs/redis
highlight=js
---

<--->

---
title=PHP
file=static/files/fetch/examples/php/redis
highlight=php
---

<--->

---
title=Python
file=static/files/fetch/examples/python/redis
highlight=python
---

{{< /codetabs >}}

## Multiple databases

Redis 3.0 and above are configured to support up to 64 databases.  Redis does not support distinct users for different databases so the same relationship connection gives access to all databases.  To use a particular database, use the Redis [`select` command](https://redis.io/commands/select) through your API library.  For instance, in PHP you could write:

```php
<?php
$redis->select(0);    // switch to DB 0
$redis->set('x', '42');    // write 42 to x
$redis->move('x', 1);    // move to DB 1
$redis->select(1);    // switch to DB 1
$redis->get('x');    // will return 42
```

Consult the documentation for your connection library and Redis itself for further details.

## Eviction policy

On the Ephemeral `redis` service it is also possible to select the key eviction policy.  That will control how Redis behaves when it runs out of memory for cached items and needs to clear old items to make room.

```yaml
cache:
    type: redis:5.0
    configuration:
        maxmemory_policy: allkeys-lru
```

The default value if not specified is `allkeys-lru`, which will simply remove the oldest cache item first.  Legal values are:

* noeviction
* allkeys-lru
* volatile-lru
* allkeys-lfu _(Available as of [Redis 4.0](https://redis.io/topics/lru-cache#the-new-lfu-mode))_
* volatile-lfu _(Available as of [Redis 4.0](https://redis.io/topics/lru-cache#the-new-lfu-mode))_
* allkeys-random
* volatile-random
* volatile-ttl

See the [Redis documentation](https://redis.io/topics/lru-cache#eviction-policies) for a description of each option.

## Using redis-cli to access your Redis service

Assuming a Redis relationship named `applicationcache` defined in `.platform.app.yaml`

{{< readFile file="src/registry/images/examples/full/redis.app.yaml" highlight="yaml" >}}

and `services.yaml`

{{< readFile file="src/registry/images/examples/full/redis.services.yaml" highlight="yaml" >}}

The host name and port number obtained from `PLATFORM_RELATIONSHIPS` would be `applicationcache.internal` and `6379`. Open an [SSH session](/development/ssh/_index.md) and access the Redis server using the `redis-cli` tool as follows:

```bash
redis-cli -h applicationcache.internal -p 6379
```

### Using Redis as handler for native PHP sessions

Using the same configuration but with your Redis relationship named `sessionstorage`:

`.platform/services.yaml`

{{< readFile file="src/registry/images/examples/full/redis-persistent.services.yaml" highlight="yaml" >}}

`.platform.app.yaml`

```yaml
relationships:
    sessionstorage: "data:redis"

variables:
    php:
        session.save_handler: redis
        session.save_path: "tcp://sessionstorage.internal:6379"
```
