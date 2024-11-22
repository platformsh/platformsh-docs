---
title: "Memcached (Object cache)"
weight: -50
description: |
  Memcached is a simple in-memory object store well-suited for application level caching.
sidebarTitle: "Memcached"
---

{{% description %}}

See the [Memcached documentation](https://memcached.org) for more information.

Both Memcached and Redis can be used for application caching. As a general rule, Memcached is simpler and thus more widely supported while Redis is more robust. {{% vendor/name %}} recommends using Redis if possible but Memcached is fully supported if an application favors that cache service.

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="memcached" status="supported" environment="grid" >}}

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
MEMCACHED_SERVICE=memcached
MEMCACHED_IP=123.456.78.90
MEMCACHED_HOSTNAME=azertyuiopqsdfghjklm.memcached.service._.eu-1.{{< vendor/urlraw "hostname" >}}
MEMCACHED_CLUSTER=azertyuiopqsdf-main-afdwftq
MEMCACHED_HOST=memcachedcache.internal
MEMCACHED_REL=memcached
MEMCACHED_SCHEME=memcached
MEMCACHED_TYPE=memcached:{{% latest "memcached" %}}
MEMCACHED_PORT=11211
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
  "service": "memcached",
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.memcached.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "cluster": "azertyuiopqsdf-main-afdwftq",
  "host": "memcached.internal",
  "rel": "memcached",
  "scheme": "memcached",
  "type": "memcached:{{% latest "memcached" %}}",
  "port": 11211
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_MEMCACHED_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.memcached[0].host')"
```

{{< /codetabs >}}

## Usage example

### 1. Configure the service

To define the service, use the ``memcached`` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: memcached:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:
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

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>: "<SERVICE_NAME>:memcached"
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions.md) for the service:

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
        - memcached
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
        - memcached
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
     <RELATIONSHIP_NAME>: "<SERVICE_NAME>:memcached"
```
{{< /codetabs >}}

For Python, include the proper dependency:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Build dependencies per runtime.
    dependencies:
      python:
        python-memcached: '*'
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
    # Build dependencies per runtime.
    dependencies:
      python:
        python-memcached: '*'
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>: "<SERVICE_NAME>:memcached"
```

{{< /codetabs >}}


### Example configuration

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      memcached:

services:
  # The name of the service container. Must be unique within a project.
  memcached:
    type: memcached:{{% latest "memcached" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      memcached: "memcached:memcached"

services:
  # The name of the service container. Must be unique within a project.
  memcached:
    type: memcached:{{% latest "memcached" %}}
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
    # The location of the application's code.
    source:
      root: "/"

    # PHP extensions.
    runtime:
      extensions:
        - memcached

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
        memcached:
service:
  memcached:
    type: memcached:{{% latest "memcached" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "/"

    # PHP extensions.
    runtime:
      extensions:
        - memcached

    [...]

    # Relationships enable access from this app to a given service.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      memcached:
        service: memcached
        endpoint: memcached
service:
  memcached:
    type: memcached:{{% latest "memcached" %}}
```

{{< /codetabs >}}

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `influxdb` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Surface a Memcached connection string for use in app.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export CACHE_URL="${MEMCACHED_HOST}:${MEMCACHED_PORT}"
```

The above file — ``.environment`` in the ``myapp`` directory — is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``CACHE_URL`` can be used within the application to connect to the service.

Note that ``CACHE_URL``, and all {{% vendor/name %}} [service environment variables](/development/variables/_index.md#service-environment-variables) like ``MEMCACHEDCACHE_HOST``, are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} ify`` command to [migrate a codebase to {{% vendor/name %}}](/get-started/_index.md).

## Accessing Memcached directly

To access the Memcached service directly you can use `netcat` as Memcached doesn't have a dedicated client tool.
Assuming your Memcached relationship is named `memcached`, the host name `MEMCACHED_HOST` and port number `MEMCACHED_PORT` obtained from the [service environment variable](#relationship-reference) would be `memcached.internal` and `11211`.
<br>Open an [SSH session](/development/ssh/_index.md) and access the Memcached server as follows:

```bash {location="Terminal"}
netcat memcached.internal 11211
```

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.
