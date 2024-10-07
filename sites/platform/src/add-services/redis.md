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

## Use a framework

If you use one of the following frameworks, follow its guide:

- [Drupal](../guides/drupal/redis.md)
- [Ibexa DXP](../guides/ibexa/deploy.md#redis)
- [Jakarta EE](../guides/jakarta/deploy.md#redis)
- [Micronaut](../guides/micronaut/redis.md)
- [Quarkus](../guides/quarkus/redis.md)
- [Spring](../guides/spring/redis.md)
- [WordPress](../guides/wordpress/redis.md)

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

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

### Deprecated versions

The following versions are [deprecated](/glossary.html#deprecated-versions).
They're available, but they aren't receiving security updates from upstream and aren't guaranteed to work.
They'll be removed in the future,
so migrate to one of the [supported versions](#supported-versions).

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

Note that versions 3.0 and higher support up to 64 different databases per instance of the service,
while Redis 2.8 only supports a single database.

## Service types

Depending on your needs,
you can set up Redis as [persistent](#persistent-redis) or [ephemeral](#ephemeral-redis).

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

```json
{
  "username": null,
  "scheme": "redis",
  "service": "redis",
  "fragment": null,
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.redis.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "port": 6379,
  "cluster": "azertyuiopqsdf-main-7rqtwti",
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

{{% vendor/name %}} sets the maximum amount of memory (`maxmemory`) Redis can use for the data set,
and it cannot be amended.
It is defined by comparing the following values and keeping the lower of the two:

- Disk size/6 (based on a [recommendation from Redis](https://docs.redis.com/latest/rs/installing-upgrading/install/plan-deployment/hardware-requirements/#productionenvironment))
- The amount of memory allocated to the service container

For instance, if your Redis container has 3072 MB of disk space and 1024 MB of memory,
only 512 MB of RAM are actually available to the service (3072/6 = 512).

But if your Redis container has 3072 MB of disk space and 256 MB of memory,
only 256 MB of RAM are actually available to the service (as per the container limit).

{{% /note %}}

### Usage example

#### 1. Configure the service

To define the service, use the `redis-persistent` endpoint:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: redis-persistent:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Define the relationship

To define the relationship, use the `redis` endpoint :

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  <SERVICE_NAME>:
```

You can define `<SERVICE_NAME>` as you like, so long as it’s unique between all defined services and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships. That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships) (the network address a service is accessible from) that is identical to the name of that service.

Depending on your needs, instead of default endpoint configuration, you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has access to the service via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  <RELATIONSHIP_NAME>:
    service: <SERVICE_NAME>
    endpoint: redis
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions) for the service:

```yaml {configFile="app"}
# PHP extensions.
runtime:
  extensions:
    - redis
```

### Configuration example

#### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
redis:
  type: redis-persistent:{{% latest "redis" %}}
  disk: 256
```

#### [App configuration](/create-apps/_index.md)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
relationships:
  redis:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
relationships:
  redis:
    service: redis
    endpoint: redis
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

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

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: redis:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  <SERVICE_NAME>:
```

You can define `<SERVICE_NAME>` as you like, so long as it’s unique between all defined services and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships. That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships) (the network address a service is accessible from) that is identical to the name of that service.

Depending on your needs, instead of default endpoint configuration, you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  <RELATIONSHIP_NAME>:
    service: <SERVICE_NAME>
    endpoint: redis
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions) for the service:

```yaml {configFile="app"}
# PHP extensions.
runtime:
  extensions:
    - redis
```

### Configuration example

#### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
redis:
  type: redis:{{% latest "redis" %}}
  disk: 256
```

#### [App configuration](/create-apps/_index.md)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
relationships:
  redis:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
relationships:
  redis:
    service: redis
    endpoint: redis
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

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
$redis = new Redis();
$redis->connect(getenv('REDIS_HOST'), getenv('REDIS_PORT'));

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

database0 = Redis(host=os.getenv('REDIS_HOST'), port=os.getenv('REDIS_PORT'), db=0)
database1 = Redis(host=os.getenv('REDIS_HOST'), port=os.getenv('REDIS_PORT'), db=1)
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

## Restrict access to database replicas only

{{< partial "banners/replicas/body.md" >}}

For security reasons, you can grant your app access to replicas instead of your actual database.
To do so, when defining the relationship between your app and database,
make sure you do the following:

1. Use the [explicit endpoint syntax](/create-apps/app-reference/single-runtime-image.html#relationships).
2. Add the `-replica` suffix to the name of the endpoint you want to use.

This results in the following configuration:

```yaml {configFile="app"}
relationships:
  {{% variable "RELATIONSHIP_NAME" %}}:
    service: {{% variable "SERVICE_NAME" %}}
    endpoint: {{% variable "ENDPOINT_NAME" %}}-replica
```

For example, if you define a `redis-persistent` database as follows:

```yaml {configFile="services"}
postgresql:
  type: "redis-persistent:16"
  disk: 2048
  configuration:
    databases:
      - main
      - legacy
    endpoints:
      admin:
        privileges:
          main: admin
          legacy: admin
      reporter:
        default_database: main
        privileges:
          main: ro
```

To create a replica of the `redis-persistent` database and allow your app to connect to it
through the `admin` endpoint with admin permissions,
use the following configuration:

```yaml {configFile="app"}
relationships:
  redis-persistent:
    service: redis-persistent
    endpoint: admin-replica
```

To create a replica of the `redis-persistent` database and allow your app to connect to it
through the `reporter` endpoint with read-only permissions instead,
use the following configuration:

```yaml {configFile="app"}
relationships:
  redis-persistent:
    service: redis-persistent
    endpoint: reporter-replica
```

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

```json
{
  "username": null,
  "scheme": "redis",
  "service": "redis",
  "fragment": null,
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.redis.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "port": 6379,
  "cluster": "azertyuiopqsdf-main-7rqtwti",
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
# The name of the service container. Must be unique within a project.
redis:
  type: "redis:{{% latest "redis" %}}"
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

## Access your Redis service

After you've [configured your Redis service](#usage-example),
you can access it using either the {{% vendor/name %}} CLI
or through the [Redis CLI](https://redis.io/docs/ui/cli/).

### {{% vendor/name %}} CLI

Unlike the Redis CLI, connecting via the {{% vendor/name %}} CLI does not require additional authentication steps if you are already authenticated in your terminal.

Access your Redis service by running the command:

```bash
{{% vendor/cli %}} redis
```

### Redis CLI

Retrieve the hostname and port you can connect to
through the `{{< vendor/prefix >}}_RELATIONSHIPS` [environment variable](../../development/variables/use-variables.md#use-provided-variables).
To do so, run the `{{< vendor/cli >}} relationships` command.

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

```yaml {configFile="services" v2Hide="true"}
# The name of the service container. Must be unique within a project.
redissessions:
    type: "redis-persistent:{{% latest "redis" %}}"
    disk: 256
```

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp
type: "php:{{% latest "php" %}}"

relationships:
  redissessions:

variables:
  php:
    session.save_handler: redis
    session.save_path: "tcp://{{< variable "HOSTNAME" >}}:{{< variable "PORT" >}}"

web:
  locations:
    '/':
      root: 'web'
        passthru: '/index.php'
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
name: myapp
type: "php:{{% latest "php" %}}"

relationships:
  redissessions:
    service: "redissessions"
    endpoint: "redis"

variables:
  php:
    session.save_handler: redis
    session.save_path: "tcp://{{< variable "HOSTNAME" >}}:{{< variable "PORT" >}}"

web:
  locations:
    '/':
      root: 'web'
      passthru: '/index.php'
```

{{< /codetabs >}}

