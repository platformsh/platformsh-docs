---
title: Mercure
sidebarTitle: Mercure
weight: -45
---

[Mercure](https://mercure.rocks/) is a real-time communication protocol and hub designed for modern web apps. It allows servers to instantly push updates to browsers, mobile clients, and backend workers through Server-Sent Events (SSE).

Built for simplicity and performance, Mercure is widely used in the Symfony ecosystem and beyond for reactive UIs, real-time notifications, and live data streaming.

## Supported versions

You can select the major version. The latest compatible minor version is applied automatically and can’t be overridden.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="mercure" status="supported" >}}

<!-- 
## Deprecated versions

The following versions are still available in your projects,
but they're at their end of life and are no longer receiving security updates from upstream.

{{< image-versions image="mercure" status="deprecated" >}}

To ensure your project remains stable in the future,
switch to a [supported version](#supported-versions).
-->

## JWT Token Secret

The service generates the JSON Web Token (JWT) token secret. It's available in the `password` field of the Mercure relationship in the `PLATFORM_RELATIONSHIPS` environment variable.

## Relationship reference

For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) or through the [``PLATFORM_RELATIONSHIPS`` environment variable](/development/variables/use-variables.md#use-provided-variables).


{{< codetabs >}}
+++
title= Service environment variables
+++

You can obtain the complete list of available service environment variables in your app container by running ``upsun ssh env``.

Relationship information can change when an app is redeployed or restarted, or the relationship is changed.
Avoid hard-coding; use the [service environment variables](/development/variables/_index.md#service-environment-variables) to handle dynamic relationship changes.

```bash
MERCURE_PUBLIC=false
MERCURE_SERVICE=mercure0
MERCURE_HOSTNAME=sample-hostname.mercure.service.platformsh.site
MERCURE_PORT=3000
MERCURE_IP="123.456.78.90"
MERCURE_CLUSTER=sample-cluster-id-12345
MERCURE_TYPE=mercure:0
MERCURE_QUERY={}
MERCURE_INSTANCE_IPS=["123.456.789.001"]
MERCURE_PATH=
MERCURE_RELATIONSHIPS_ENV_VAR_EXTRA={}
MERCURE_FRAGMENT=
MERCURE_EPOCH=0
MERCURE_HOST=mercure0.internal
MERCURE_PASSWORD=ChangeMe
MERCURE_HOST_MAPPED=false
MERCURE_SCHEME=http
MERCURE_REL=mercure
MERCURE_USERNAME=
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
  "mercure": [
    {
      "username": null,
      "fragment": null,
      "ip": "123.456.78.90",
      "cluster": "sample-cluster-id-12345",
      "host": "mercure.internal",
      "path": null,
      "query": {},
      "relationships_env_var_extra": {},
      "port": 3000,
      "host_mapped": false,
      "password": "ChangeMe",
      "service": "mercure",
      "hostname": "sample-hostname.mercure.service.platformsh.site",
      "epoch": 0,
      "instance_ips": [
        "123.456.789.001"
      ],
      "rel": "mercure",
      "scheme": "http",
      "type": "mercure:0",
      "public": false
    }
  ]
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON="$(echo "$PLATFORM_RELATIONSHIPS" | base64 --decode)"

# Set environment variables for individual credentials.
export APP_MERCURE_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.mercure[0].host')"
```

{{< /codetabs >}}

## Usage example

### 1. Configure the service

To define the service, use the `mercure` type:

```yaml {configFile="app"}
services:
   # The name of the service container. Must be unique within a project.
   <SERVICE_NAME>:
      type: mercure:0
      disk: 256
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Define the route

To access the service URL, add an entry to the `.routes` key as shown below, replacing <APP_NAME> with the name of your app: 

```yaml {configFile="app"}
routes: 
  "https://mercure.{default}/":
    type: upstream
    upstream: "<APP_NAME>:mercure"
```

### 3. Define the relationship 

Define the relationship to the app as shown below: 

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
      <SERVICE_NAME>: "mercure:mercure"
```

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/image-properties/relationships.md) configuration for relationships.
That is, it uses default endpoints behind the scenes, providing a [relationship](/create-apps/image-properties/relationships.md)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/image-properties/relationships.md).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: mercure
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/image-properties/relationships.md) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/image-properties/relationships.md).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
      mercure:

services:
  # The name of the service container. Must be unique within a project.
  mercure:
    type: mercure:0
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
      mercure: "mercure:mercure"

services:
  # The name of the service container. Must be unique within a project.
  mercure:
    type: mercure:0
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "/"

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mercure:

services:
  mercure:
    type: mercure:0
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="services"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "myapp"

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mercure:
        service: mercure
        endpoint: mercure
services:
  mercure:
    type: mercure:0
```

{{< /codetabs >}}

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `mercure` service via a relationship whose name is [identical to the service name](#3-define-the-relationship)
(as per [default endpoint](/create-apps/image-properties/relationships.md) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for common Mercure credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export MERCURE_USER="${MERCURE_USERNAME}"
export MERCURE_HOST="${MERCURE_HOST}"
export MERCURE_QUERY="${$MERCURE_QUERY}"
```

The ``.environment`` shown above in the ``myapp`` directory is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``MERCURE_HOST`` can be used within the application to connect to the service.

Note that all [{{% vendor/name %}} service environment variables](/development/variables/_index.md#service-environment-variables) such as ``MERCURE_HOST`` are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} project:init`` [command](/administration/cli/reference.html#projectinit) to migrate a codebase to {{% vendor/name %}}.

