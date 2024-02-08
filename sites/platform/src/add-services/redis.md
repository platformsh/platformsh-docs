---
title: "Redis (Object cache)"
weight: 20
sidebarTitle: "Redis"
---

[Redis](https://redis.io/documentation) is a multi-model database that allows you to store data in memory
for high-performance data retrieval and key-value storage.
{{% vendor/name %}} supports two different Redis configurations:

- [Persistent](#persistent-redis): to set up fast persistent storage for your application
- [Ephemeral](#ephemeral-redis): to set up a non-persistent cache for your application

{{% frameworks version="1" %}}

- [Drupal](../guides/drupal/redis.md)
- [Ibexa DXP](../guides/ibexa/deploy.md#cache-and-sessions)
- [Jakarta EE](../guides/jakarta/deploy.md#redis)
- [Micronaut](../guides/micronaut/redis.md)
- [Quarkus](../guides/quarkus/redis.md)
- [Spring](../guides/spring/redis.md)
- [WordPress](../guides/wordpress/redis.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

{{% version/specific %}}
<!-- API Version 1 -->

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="redis" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="redis" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="redis" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

<--->
<!-- API Version 2 -->

{{< image-versions image="redis" status="supported" environment="grid" >}}

{{% /version/specific %}}

{{% deprecated-versions %}}

{{% version/specific %}}
<!-- API Version 1 -->

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="redis" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="redis" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="redis" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

<--->
<!-- API Version 2 -->

{{< image-versions image="redis" status="deprecated" environment="grid" >}}

{{% /version/specific %}}

Note that versions 3.0 and higher support up to 64 different databases per instance of the service,
while Redis 2.8 only supports a single database.

## Service types

Depending on your needs,
you can set up Redis as [persistent](#persistent-redis) or [ephemeral](#ephemeral-redis).

## Persistent Redis

By default, Redis is an ephemeral service that stores data in memory.
This allows for fast data retrieval,
but also means data can be lost when a container is moved or shut down.

To solve this issue, configure your Redis service as persistent.
Persistent Redis stores data on a disk,
restoring it if the container restarts.

To switch from persistent to ephemeral Redis,
set up a new service with a different name.

{{% note theme="warning" title="Warning" %}}

The `maxmemory` configuration setting instructs Redis to use a specified amount of RAM for the data set.

When defining container resources, keep in mind that,
based on a [recommendation from Redis](https://docs.redis.com/latest/rs/installing-upgrading/install/plan-deployment/hardware-requirements/#productionenvironment),
{{% vendor/name %}} limits ``maxmemory`` to a sixth of the disk space allocated to the service container.

For instance, if your Redis container has 6 GB of disk space, only 1 GB of RAM is actually available to the service.
To allocate 6 GB of RAM to your service, set the disk size to `36`.

{{% /note %}}

### Usage example

#### 1. Configure the service

To define the service, use the `redis-persistent` endpoint:

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
    type: redis-persistent:<VERSION>
```

<--->
<!-- Version 2 -->

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: redis-persistent:<VERSION>
```

{{% /version/specific %}}

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Add the relationship

To define the relationship, use the `redis` endpoint :

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
relationships:
    <RELATIONSHIP_NAME>: "<SERVICE_NAME>:redis"
```

<--->
<!-- Version 2 -->

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:redis"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: redis-persistent:<VERSION>
```

{{% /version/specific %}}

You can define `<SERVICE_NAME>` and `<RELATIONSHIP_NAME>` as you like, but it’s best if they’re distinct.
With this definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>`.
For PHP, enable the extension for the service:

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="app"}
# PHP extensions.
runtime:
    extensions:
        - redis
```

<--->
<!-- Version 2 -->

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # PHP extensions.
        runtime:
            extensions:
                - redis
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:redis"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: redis-persistent:<VERSION>
```

{{% /version/specific %}}

### Configuration example

{{% version/specific %}}
<!-- Version 1 -->

#### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
data:
    type: redis-persistent:7.0
    disk: 256
```

#### [App configuration](/create-apps/_index.md)

```yaml {configFile="app"}
relationships:
    redisdata: "data:redis"
```

<--->
<!-- Version 2 -->

#### [Service](/add-services/_index.md) and [app](/create-apps/_index.md) configuration

```yaml {configFile="services"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # Relationships enable access from this app to a given service.
        relationships:
            rediscache: "cacheredis:redis"

services:
    # The name of the service container. Must be unique within a project.
    cacheredis:
        type: redis-persistent:7.0
```

{{% /version/specific %}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs v2hide="true" >}}

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

<!-- Version 2: .environment shortcode + context -->
{{% version/only "2" %}}

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

# Other options...

# Relationships enable an app container's access to a service.
relationships:
    rediscache: "cacheredis:redis"
{{< /snippet >}}
{{< snippet name="cacheredis" config="service" placeholder="true" >}}
    type: redis-persistent:{{% latest "redis" %}}
{{< /snippet >}}
```

{{< v2connect2app serviceName="cacheredis" relationship="rediscache" var="REDIS_URL">}}

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export CACHE_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].host')"
export CACHE_PORT="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].port')"
export CACHE_PASSWORD="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].password')"
export CACHE_SCHEME="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].scheme')"

# Surface a Redis connection string for use in app.
export REDIS_URL="${CACHE_SCHEME}://${CACHE_PASSWORD}@${CACHE_HOST}:${CACHE_PORT}"
```

{{< /v2connect2app >}}

{{% /version/only %}}

## Ephemeral Redis

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

### Usage example

#### 1. Configure the service

To define the service, use the `redis` endpoint:

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
    type: redis:<VERSION>
```

<--->
<!-- Version 2 -->

```yaml {configFile="services"}
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: redis:<VERSION>
```

{{% /version/specific %}}

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Add the relationship

To define the relationship, use the `redis` endpoint :

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
relationships:
    <RELATIONSHIP_NAME>: "<SERVICE_NAME>:redis"
```

<--->
<!-- Version 2 -->

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:redis"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: redis:<VERSION>
```

{{% /version/specific %}}

You can define `<SERVICE_NAME>` and `<RELATIONSHIP_NAME>` as you like, but it’s best if they’re distinct.
With this definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>`.
For PHP, enable the extension for the service:

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="app"}
# PHP extensions.
runtime:
    extensions:
        - redis
```

<--->
<!-- Version 2 -->

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    <APP_NAME>:
        # PHP extensions.
        runtime:
            extensions:
                - redis
        # Relationships enable access from this app to a given service.
        relationships:
            <RELATIONSHIP_NAME>: "<SERVICE_NAME>:redis"

services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: redis:<VERSION>
```

{{% /version/specific %}}

### Configuration example

{{% version/specific %}}
<!-- Version 1 -->

#### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
data:
    type: redis:7.0
    disk: 256
```

#### [App configuration](/create-apps/_index.md)

```yaml {configFile="app"}
relationships:
    redisdata: "data:redis"
```

<--->
<!-- Version 2 -->

#### [Service](add-services/_index.md) and [app](/create-apps/_index.md) configuration

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # Relationships enable access from this app to a given service.
        relationships:
            rediscache: "cacheredis:redis"

services:
    # The name of the service container. Must be unique within a project.
    cacheredis:
        type: redis:7.0
```

{{% /version/specific %}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs v2hide="true" >}}

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

<!-- Version 2: .environment shortcode + context -->
{{% version/only "2" %}}

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

# Other options...

# Relationships enable an app container's access to a service.
relationships:
    rediscache: "cacheredis:redis"
{{< /snippet >}}
{{< snippet name="cacheredis" config="service" placeholder="true" >}}
    type: redis:{{% latest "redis" %}}
{{< /snippet >}}
```

{{< v2connect2app serviceName="cacheredis" relationship="rediscache" var="REDIS_URL">}}

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export CACHE_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].host')"
export CACHE_PORT="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].port')"
export CACHE_PASSWORD="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].password')"
export CACHE_SCHEME="$(echo $RELATIONSHIPS_JSON | jq -r '.rediscache[0].scheme')"

# Surface a Redis connection string for use in app.
export REDIS_URL="${CACHE_SCHEME}://${CACHE_PASSWORD}@${CACHE_HOST}:${CACHE_PORT}"
```

{{< /v2connect2app >}}

{{% /version/only %}}

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
$redis = new Redis();
$redis->connect(getenv('CACHE_HOST'), getenv('CACHE_PORT'));

$redis->select(0);       // switch to DB 0
$redis->set('x', '42');  // write 42 to x
$redis->move('x', 1);    // move to DB 1
$redis->select(1);       // switch to DB 1
$redis->get('x');        // returns 42
```

<--->

+++
title=Python
+++

To manage [thread safety](https://github.com/redis/redis-py/blob/master/docs/advanced_features.rst#user-content-a-note-about-threading),
the Python library suggests using separate client instances for each database:

```python
import os
from redis import Redis

database0 = Redis(host=os.getenv('CACHE_HOST'), port=os.getenv('CACHE_PORT'), db=0)
database1 = Redis(host=os.getenv('CACHE_HOST'), port=os.getenv('CACHE_PORT'), db=1)
```

<--->

+++
title=Node.js
+++

Use the Redis [`select` command](https://redis.io/commands/select):

```javascript
const redis = require('redis');

const client = redis.createClient(process.env.CACHE_PORT, process.env.CACHE_HOST);

await client.SELECT(0);                  // switch to DB 0
await client.set('x', '42');             // write 42 to x
await client.MOVE('x', 1);               // move to DB 1
await client.SELECT(1);                  // switch to DB 1
const value = await client.get('x');     // returns 42
```

{{< /codetabs >}}

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
{
    "username": null,
    "scheme": "redis",
    "service": "redis6",
    "fragment": null,
    "ip": "169.254.22.75",
    "hostname": "7mnenhdiz7ecraovljrba6pmiy.redis6.service._.eu-3.{{< vendor/urlraw "hostname" >}}",
    "port": 6379,
    "cluster": "rjify4yjcwxaa-master-7rqtwti",
    "host": "redis.internal",
    "rel": "redis",
    "path": null,
    "query": [],
    "password": null,
    "type": "redis:{{% latest "redis" %}}",
    "public": false,
    "host_mapped": false
}
```

The format of the relationship is identical whether your Redis service is [ephemeral](#ephemeral-redis) or [persistent](#persistent-redis).

## Eviction policy

When Redis reaches its memory limit,
it triggers a cache cleanup.
To customize those cache cleanups, set up an eviction policy such as the following:

```yaml {configFile="services"}
{{% snippet name="cache" config="service" %}}
    type: "redis:{{% latest "redis" %}}"
    configuration:
        maxmemory_policy: allkeys-lfu
{{% /snippet %}}
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
through the `{{< vendor/prefix >}}_RELATIONSHIPS` [environment variable](../../development/variables/use-variables.md#use-provided-variables).
To do so, run the `{{< vendor/cli >}} relationships` command.

After you've retrieved the hostname and port, [open an SSH session](../development/ssh/_index.md).
To access your Redis service, run the following command:

```bash
redis-cli -h {{< variable "HOSTNAME" >}} -p {{< variable "PORT" >}}
```

{{% version/specific %}}
If you have a Grid project, note that the `CONFIG GET` and `CONFIG SET` admin commands are restricted.
To get the current configuration, run the following command:
<--->
Note that the `CONFIG GET` and `CONFIG SET` admin commands might be restricted on your project.
{{% /version/specific %}}

```bash
redis-cli -h {{< variable "HOSTNAME" >}} -p {{< variable "PORT" >}} info
```

## Use Redis as a handler for PHP sessions

A PHP session allows you to store different data for each user through a unique session ID.
By default, PHP handles sessions using files.
But you can use Redis as a session handler,
which means Redis stores and retrieves the data saved into sessions.

To set up Redis as your session handler, add a configuration similar to the following:

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="services" v2Hide="true"}
{{< snippet name="data" config="service" >}}
    type: "redis-persistent:{{% latest "redis" %}}"
    disk: 256
{{< /snippet >}}
```

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="false" >}}
type: "php:{{% latest "php" %}}"

relationships:
    sessionstorage: "data:redis"

variables:
    php:
        session.save_handler: redis
        session.save_path: "tcp://{{< variable "HOSTNAME" >}}:{{< variable "PORT" >}}"

web:
    locations:
        '/':
            root: 'web'
            passthru: '/index.php'
{{< /snippet >}}

{{< snippet name="data" config="service" placeholder="true" >}}
    type: "redis-persistent:{{% latest "redis" %}}"
    disk: 256
{{< /snippet >}}
```

<--->
<!-- Version 2 -->

```yaml {configFile="services" v2Hide="true"}
{{< snippet name="data" config="service" >}}
    type: "redis-persistent:{{% latest "redis" %}}"
{{< /snippet >}}
```

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="false" >}}
type: "php:{{% latest "php" %}}"

relationships:
    sessionstorage: "data:redis"

variables:
    php:
        session.save_handler: redis
        session.save_path: "tcp://{{< variable "HOSTNAME" >}}:{{< variable "PORT" >}}"

web:
    locations:
        '/':
            root: 'web'
            passthru: '/index.php'
{{< /snippet >}}

{{< snippet name="data" config="service" placeholder="true" >}}
    type: "redis-persistent:{{% latest "redis" %}}"
{{< /snippet >}}
```

{{% /version/specific %}}