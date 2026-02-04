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

Relationship and configuration information (see the example below) is available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Relationship information can change when an app is redeployed or restarted, or the relationship is changed.
Avoid hard-coding; use the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable to handle dynamic relationship changes.

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

## Usage example

### 1. Configure the service

To define the service, use the `mercure` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: mercure:0
  disk: 256
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Define the route

Include an entry in your `.platform/routes.yaml` file as shown below, replacing <APP_NAME> with the name of your Mercure app:

```yaml {configFile="routes"}
"https://mercure.{default}/":
   type: upstream
   upstream: "<APP_NAME>:mercure"
```

### 3. Define the relationship 

Define the relationship to the app, as shown below: 

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

The example above leverages [default endpoint](/create-apps/image-properties/relationships.md) configuration for relationships.
That is, it uses default endpoints behind the scenes, providing a [relationship](/create-apps/image-properties/relationships.md)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/image-properties/relationships.md).

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
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: mercure
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/image-properties/relationships.md) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/image-properties/relationships.md).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
{{< /codetabs >}}

### Example configuration

### [Service definition](/add-services.html)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mercure:
  type: mercure:0
  disk: 256
```
#### [Route definition](/define-routes/_index.md)

```yaml {configFile="routes"}
"https://mercure.{default}/":
   type: upstream
   upstream: "<APP_NAME>:mercure"
```

#### [App configuration](/create-apps/_index.md)

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
  mercure:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.upsun.com/anchors/fixed/app/reference/relationships/
relationships:
  mercure:
    service: mercure
    endpoint: mercure
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp

[...]

relationships:
  mercure:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
name: myapp

[...]

# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.upsun.com/anchors/fixed/app/reference/relationships/
relationships:
  mercure:
    service: mercure
    endpoint: mercure
```
{{< /codetabs >}}

```yaml {configFile="services"}
mercure:
  type: mercure:{{% latest "mercure" %}}
```

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `mercure` service via a relationship whose name is [identical to the service name](#3-define-the-relationship)
(as per [default endpoint](/create-apps/image-properties/relationships.md) configuration for relationships).

From this, `myapp` can retrieve access credentials to the service through the environment variable `{{< vendor/prefix >}}_RELATIONSHIPS`. That variable is a base64-encoded JSON object, but can be decoded at runtime (using the built-in tool `jq`) to provide more accessible environment variables to use within the application itself:

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for common Mercure credentials.
export MERCURE_USER=$(echo $RELATIONSHIPS_JSON | jq -r ".mercure[0].username")
export MERCURE_HOST=$(echo $RELATIONSHIPS_JSON | jq -r ".mercure[0].host")
export MERCURE_ORG=$(echo $RELATIONSHIPS_JSON | jq -r ".mercure[0].query")
```

The `.environment` file (shown above) in the `myapp` directory is automatically sourced by {{< vendor/name >}} into the runtime environment, so that the variable `MERCURE_HOST` can be used within the application to connect to the service.

Note that `MERCURE_HOST` and all {{< vendor/name >}}-provided environment variables like `{{% vendor/prefix %}}_RELATIONSHIPS`, are environment-dependent. Unlike the build produced for a given commit, they can't be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for you when using the `{{< vendor/cli >}} project:init` [command](/administration/cli/reference.md#projectinit) to migrate a codebase to {{% vendor/name %}}.