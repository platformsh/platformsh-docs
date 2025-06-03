---
title: "Valkey"
weight: 20
sidebarTitle: "Valkey"
---

[Valkey](https://valkey.io/) is an open source datastore that can be used high-performance data retrieval and key-value storage.

{{% vendor/name %}} supports two different Valkey configurations:

- [Persistent](#persistent-valkey): to set up fast persistent storage for your application
- [Ephemeral](#ephemeral-valkey): to set up a non-persistent cache for your application

## Use with Drupal

If you are using the Drupal framework, you can follow its guide for Valkey:

- [Drupal](/guides/drupal/valkey.md)

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

All products support the 8.0 version of Valkey.


| Grid            | Dedicated Gen 3 | Dedicated Gen 2 |
| --------------- | --------------- | --------------- |
| **8.0**         | **8.0**         | **8.0**         |


## Service types

Depending on your needs,
you can set up Valkey as [persistent](#persistent-valkey) or [ephemeral](#ephemeral-valkey).

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

```json
{
  "username": null,
  "scheme": "valkey",
  "service": "valkey",
  "fragment": null,
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.valkey.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "port": 6379,
  "cluster": "azertyuiopqsdf-main-7rqtwti",
  "host": "valkey.internal",
  "rel": "valkey",
  "path": null,
  "query": [],
  "password": null,
  "type": "valkey:8.0",
  "public": false,
  "host_mapped": false
}
```

The format of the relationship is identical whether your Valkey service is [ephemeral](#ephemeral-valkey) or [persistent](#persistent-valkey).

{{% note theme="note" title="Database access" %}}

It should be noted that when you set up a relationship connection, access to all of the databases is automatically granted.

{{% /note %}}

## Persistent Valkey

By default, Valkey is an ephemeral service that stores data in memory.
This allows for fast data retrieval,
but also means data can be lost when a container is moved or shut down.

To solve this issue, configure your Valkey service as persistent.
Persistent Valkey stores data on a disk,
restoring it if the container restarts.

To switch from persistent to ephemeral Valkey,
set up a new service with a different name.

{{% note theme="warning" title="Warning" %}}

{{% vendor/name %}} sets the maximum amount of memory (`maxmemory`) Valkey can use for the data set,and it cannot be amended. It is defined by comparing the following values and keeping the lower of the two:

- Disk size
- The amount of memory allocated to the service container

For instance, if your Valkey container has 3072 MB of disk space and 1024 MB of memory, only 512 MB of RAM are actually available to the service (3072/6 = 512).

But if your Valkey container has 3072 MB of disk space and 256 MB of memory, only 256 MB of RAM are actually available to the service (as per the container limit).

{{% /note %}}

### Usage example

#### 1. Configure the service

To define the service, use the `valkey-persistent` endpoint:

```yaml {configFile="services"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: valkey-persistent:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Define the relationship

To define the relationship, use the `valkey` endpoint :

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
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

With the above definition, the application container now has access to the service via the relationship `<SERVICE_NAME>` and its corresponding [service environment variables](/development/variables/_index.md).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: valkey
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions) for the service:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # PHP extensions.
    runtime:
      extensions:
        - redis
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <SERVICE_NAME>:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # PHP extensions.
    runtime:
      extensions:
          - redis
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: valkey
```

{{< /codetabs >}}

### Configuration example

#### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
valkey:
  type: valkey-persistent:8.0
  disk: 256
```

#### [App configuration](/create-apps/_index.md)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
relationships:
  valkey:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
relationships:
  valkey:
    service: valkey
    endpoint: valkey
```

{{< /codetabs >}}

## Ephemeral Valkey

By default, Valkey is an ephemeral service that serves as a non-persistent cache.
Ephemeral Valkey stores data only in memory and requires no disk space.
When the service reaches its memory limit, it triggers a cache cleanup.
To customize those cache cleanups, set up an [eviction policy](#eviction-policy).

Make sure your app doesn't rely on ephemeral Valkey for persistent storage as it can cause issues. For example, if a container is moved during region maintenance,the `deploy` and `post_deploy` hooks don't run and an app that treats the cache as permanent shows errors.

To prevent data from getting lost when a container is moved or shut down,
you can use the [persistent Valkey](#persistent-valkey) configuration.
Persistent Valkey provides a cache with persistent storage.

### Usage example

#### 1. Configure the service

To define the service, use the `valkey` endpoint:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: valkey:8.0
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
    endpoint: valkey
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

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
valkey:
  type: valkey:8.0
  disk: 256
```

#### [App configuration](/create-apps/_index.md)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
relationships:
  valkey:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
relationships:
  valkey:
    service: valkey
    endpoint: valkey
```

{{< /codetabs >}}


## Restrict access to database replicas only

{{% note theme="info" title="Feature availability" %}}

This feature is only available on Dedicated Gen 3 projects. For more information, contact [Sales](https://platform.sh/contact/).

{{% /note %}}

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

For example, if you define a `valkey-persistent` database as follows:

```yaml {configFile="services"}
postgresql:
  type: "valkey-persistent:8.0"
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

To create a replica of the `valkey-persistent` database and allow your app to connect to it
through the `admin` endpoint with admin permissions,
use the following configuration:

```yaml {configFile="app"}
relationships:
  valkey-persistent:
    service: valkey-persistent
    endpoint: admin-replica
```

To create a replica of the `valkey-persistent` database and allow your app to connect to it
through the `reporter` endpoint with read-only permissions instead,
use the following configuration:

```yaml {configFile="app"}
relationships:
  valkey-persistent:
    service: valkey-persistent
    endpoint: reporter-replica
```

## Eviction policy

When Valkey reaches its memory limit, it triggers a cache cleanup.
To customize those cache cleanups, set up an eviction policy such as the following:

```yaml {configFile="services"}
services:
  # The name of the service container. Must be unique within a project.
  valkey:
    type: "valkey:8.0"
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
see the official [Valkey documentation](https://valkey.io/topics/lru-cache/).

## Access your Valkey service

After you've [configured your Valkey service](#usage-example),
you can access it using either the {{% vendor/name %}} CLI
or through the [Valkey CLI](https://valkey.io/topics/cli/).

### {{% vendor/name %}} CLI

Unlike the Valkey CLI, connecting via the {{% vendor/name %}} CLI does not require additional authentication steps if you are already authenticated in your terminal.

Access your Valkey service by running the command:

```bash
{{% vendor/cli %}} valkey
```

### Valkey CLI

Retrieve the hostname and port you can connect to
through the `{{< vendor/prefix >}}_RELATIONSHIPS` [environment variable](../../development/variables/use-variables.md#use-provided-variables).
To do so, run the `{{< vendor/cli >}} relationships` command.

After you've retrieved the hostname and port, [open an SSH session](../development/ssh/_index.md).
To access your Valkey service, run the following command:

```bash
valkey-cli -h {{< variable "HOSTNAME" >}} -p {{< variable "PORT" >}}
```

If you have a Grid project, note that the `CONFIG GET` and `CONFIG SET` admin commands are restricted.
To get the current configuration, run the following command:

```bash
valkey-cli -h {{< variable "HOSTNAME" >}} -p {{< variable "PORT" >}} info
```

## Use Valkey as a handler for PHP sessions

A PHP session allows you to store different data for each user through a unique session ID.
By default, PHP handles sessions using files.
But you can use Valkey as a session handler,
which means Valkey stores and retrieves the data saved into sessions.

To set up Valkey as your session handler, add a configuration similar to the following:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    source:
      root: "myapp"

    type: "php:{{% latest "php" %}}"

    # PHP extensions.
    runtime:
      extensions:
        - redis

    relationships:
      valkeysession:

    variables:
      php:
        session.save_handler: valkey
        session.save_path: "tcp://{{< variable "$SESSIONSTORAGE_HOSTNAME" >}}:{{< variable "$SESSIONSTORAGE_PORT" >}}"

    web:
      locations:
        '/':
          root: 'web'
          passthru: '/index.php'

services:
  # The name of the service container. Must be unique within a project.
  valkeysession:
    type: "valkey-persistent:8.0"
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    source:
      root: "myapp"

    type: "php:{{% latest "php" %}}"

    # PHP extensions.
    runtime:
      extensions:
        - redis

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      valkeysession:
        service: valkeysession
        endpoint: valkey

    variables:
      php:
        session.save_handler: valkey
        session.save_path: "tcp://{{< variable "$VALKEYSSESSION_HOSTNAME" >}}:{{< variable "$VALKEYSSESSION_PORT" >}}"

    web:
      locations:
        '/':
          root: 'web'
          passthru: '/index.php'

services:
  # The name of the service container. Must be unique within a project.
  valkeysession:
    type: "valkey-persistent:8.0"
```

{{< /codetabs >}}

## Migrate from Redis to Valkey
It is possible for a user to switch from `redis-persistent` to `valkey-persistent` without losing data. To make this switch, change the type of the service from `redis-persistent` to `valkey-persistent` (also note the version change), while keeping the same service name. For example, replace this:

```json
my_service_name:
  type: redis-persistent:7.2
  disk: 256

```

with the following:

```
json
my_service_name:
  type: valkey-persistent:8.0
  disk: 256
```

## Further resources

### Documentation

- [Valkey documentation](https://valkey.io/topics/)
- [Using Valkey with Drupal](/guides/drupal/valkey)


