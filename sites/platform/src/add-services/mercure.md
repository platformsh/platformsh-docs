---
title: Mercure
sidebarTitle: Mercure
weight: -45
---

[Mercure](https://mercure.rocks/) is a real-time communication protocol and hub designed for modern web apps. It allows servers to instantly push updates to browsers, mobile clients, and backend workers through Server-Sent Events (SSE).

Built for simplicity and performance, Mercure is widely used in the Symfony ecosystem and beyond for reactive UIs, real-time notifications, and live data streaming.

## JWT Token Secret

The service generates the JSON Web Token (JWT) token secret. It's available in the `password` field of the Mercure relationship in the `PLATFORM_RELATIONSHIPS` environment variable.

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

You can obtain the complete list of available service environment variables in your app container by running ``upsun ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

```bash

```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{

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