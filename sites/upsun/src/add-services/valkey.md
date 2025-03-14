---
title: "Valkey"
weight: 20
sidebarTitle: "Valkey"
---

[Valkey](https://valkey.io/) is an open source datastore that can be used high-performance data retrieval and key-value storage. While Valkey supports workloads like caching and message queues, it is mainly used as a primary database. 

{{% note theme="warning" title="New versions of Redis no longer supported" %}}

Please note that newer versions after Redis 7.2 will no longer be supported by {{% vendor/name %}} due to licensing changes. Valkey is available on all our products as a viable alternative open source datastore.

{{% /note %}}

## Migrate from Redis to Valkey
It is possible for a user to switch from `redis-persistent` to `valkey-persistent` without losing data. To make this switch, change the name of the service and keep the same name. For example:

```json
my_service_name:
  type: redis-persistent:7.2
  disk: 256

```

{{% vendor/name %}} supports two different Valkey configurations:

- [Persistent](#persistent-valkey): to set up fast persistent storage for your application
- [Ephemeral](#ephemeral-valkey): to set up a non-persistent cache for your application

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

- 8.0

## Service types

Depending on your needs, you can set up Valkey as [persistent](#persistent-valkey) or [ephemeral](#ephemeral-valkey).

## Relationship reference

For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} automatically generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [``PLATFORM_RELATIONSHIPS`` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

```bash
VALKEY_USERNAME=
VALKEY_SCHEME=valkey
VALKEY_SERVICE=valkey
VALKEY_FRAGMENT=
VALKEY_IP=123.456.78.90
VALKEY_EPOCH=0
VALKEY_HOSTNAME=azertyuiopqsdfghjklm.valkey.service._.eu-1.{{< vendor/urlraw "hostname" >}}
VALKEY_PORT=6379
VALKEY_CLUSTER=azertyuiopqsdf-main-afdwftq
VALKEY_HOST=valkey.internal
VALKEY_REL=valkey
VALKEY_PATH=
VALKEY_QUERY={}
VALKEY_PASSWORD=
VALKEY_TYPE=valkey:8.0
VALKEY_PUBLIC=false
VALKEY_HOST_MAPPED=false
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
    {
      "username": null,
      "fragment": null,
      "ip": "169.254.135.174",
      "cluster": "ptnmwvw4dhgbi-main-bvxea6i",
      "path": null,
      "query": {},
      "password": null,
      "port": 6379,
      "host_mapped": false,
      "service": "cache",
      "hostname": "azertyuiopqsdfghjklm.valkey.service._.eu-1.platformsh.site",
      "epoch": 0,
      "rel": "valkey",
      "scheme": "valkey",
      "type": "valkey:8.0",
      "public": false
    }
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_VALKEY_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.valkey[0].host')"
```

{{< /codetabs >}}

The format of the relationship is identical whether your Valkey service is [ephemeral](#ephemeral-valkey) or [persistent](#persistent-valkey).

{{% note theme="note" title="Database access" %}}

It should be noted that when you set up a relationship connection, access to all of the databases is automatically granted.

{{% /note %}}

## Persistent Valkey

By default, Valkey is an ephemeral service that stores data in memory.
This allows for fast data retrieval,but also means data can be lost when a container is moved or shut down.

To solve this issue, configure your Valkey service as persistent.
Persistent Valkey stores data on a disk,restoring it if the container restarts.

To switch from persistent to ephemeral Valkey, set up a new service with a different name.

{{% note theme="warning" title="Warning" %}}

{{% vendor/name %}} sets the maximum amount of memory (`maxmemory`) Valkey can use for the data set,and it cannot be amended. It is defined by comparing the following values and keeping the lower of the two:

- Disk size
- The amount of memory allocated to the service container

For instance, if your Valkey container has 3072 MB of disk space and 1024 MB of memory,only 512 MB of RAM are actually available to the service (3072/6 = 512).

But if your Valkey container has 3072 MB of disk space and 256 MB of memory,only 256 MB of Valkey are actually available to the service (as per the container limit).

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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
        - valkey 8.0
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
          - valkey 8.0
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

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    source:
      root: "myapp"

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey

    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      valkey:
services:
    # The name of the service container. Must be unique within a project.
    valkey:
      valkey: valkey-persistent: 8.0
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    source:
      root: "myapp"

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      valkey:
        service: valkey
        endpoint: valkey
services:
  # The name of the service container. Must be unique within a project.
  valkey:
    type: valkey-persistent: 8.0
```

{{< /codetabs >}}

## Ephemeral Valkey

By default, Valkey is an ephemeral service that serves as a non-persistent cache.
Ephemeral Valkey stores data only in memory and requires no disk space.
When the service reaches its memory limit, it triggers a cache cleanup.
To customize those cache cleanups, set up an [eviction policy](#eviction-policy).

Make sure your app doesn't rely on ephemeral Vedis for persistent storage as it can cause issues. For example, if a container is moved during region maintenance,the `deploy` and `post_deploy` hooks don't run and an app that treats the cache as permanent shows errors.

To prevent data from getting lost when a container is moved or shut down,
you can use the [persistent Valkey](#persistent-valkey) configuration.
Persistent Valkey provides a cache with persistent storage.

### Usage example

#### 1. Configure the service

To define the service, use the `valkey` endpoint:

```yaml {configFile="services"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: valkey:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
    source:
      root: "myapp"

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey

     # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <SERVICE_NAME>:
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: valkey:<VERSION>
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    source:
      root: "myapp"

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: valkey
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: valkey:<VERSION>
```

{{< /codetabs >}}

### Configuration example

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

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey

     # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      valkey:
services:
  # The name of the service container. Must be unique within a project.
  valkey:
    type: valkey: 8.0
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

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      valkey:
        service: valkey
        endpoint: valkey
services:
  # The name of the service container. Must be unique within a project.
  valkey:
    type: valkey: 8.0
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

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

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      valkey:
services:
  # The name of the service container. Must be unique within a project.
  valkey:
    type: valkey: 8.0
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

    [...]

    # PHP extensions.
    runtime:
      extensions:
        - valkey
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      valkey:
        service: valkey
        endpoint: valkey
services:
  # The name of the service container. Must be unique within a project.
  valkey:
    type: valkey: 8.0
```

{{< /codetabs >}}

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `valkey` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export CACHE_HOST="${VALKEY_HOST}"
export CACHE_PORT="${VALKEY_PORT}"
export CACHE_PASSWORD="${VALKEY_PASSWORD}"
export CACHE_SCHEME="${VALKEY_SCHEME}"

# Surface a Valkey connection string for use in app.
export CACHE_URL="${CACHE_SCHEME}://${CACHE_PASSWORD}@${CACHE_HOST}:${CACHE_PORT}"
```

The above file — ``.environment`` in the ``myapp`` directory — is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``CACHE_URL`` can be used within the application to connect to the service.

Note that ``CACHE_URL``, and all {{% vendor/name %}} [service environment variables](/development/variables/_index.md#service-environment-variables) like ``VALKEY_HOST``,
are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} ify`` command to [migrate a codebase to {{% vendor/name %}}](/get-started/_index.md).

## Eviction policy

When Valkey reaches its memory limit,
it triggers a cache cleanup.
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
        - valkey

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
        - valkey

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

## Further resources

### Documentation

- [Valkey documentation](https://valkey.io/topics/)
