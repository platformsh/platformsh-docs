---
title: "Kafka (Message queue service)"
weight: -70
description: |
  Apache Kafka is an open-source stream-processing software platform.
sidebarTitle: "Kafka"
---

{{% description %}}

It is a framework for storing, reading and analyzing streaming data. See the [Kafka documentation](https://kafka.apache.org/documentation) for more information.

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="kafka" status="supported" environment="grid" >}}

## Relationship reference

For each service [defined via a relationship](#usage-example) to your application,
{{% vendor/name %}} automatically generates corresponding environment variables within your application container,
in the ``$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>`` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [``PLATFORM_RELATIONSHIPS`` environment variable](/development/variables/use-variables.md#use-provided-variables).

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

{{< codetabs >}}
+++
title= Service environment variables
+++

```bash
KAFKA_SERVICE=kafka
KAFKA_IP=123.456.78.90
KAFKA_HOSTNAME=azertyuiopqsdfghjklm.kafka.service._.eu-1.{{< vendor/urlraw "hostname" >}}
KAFKA_CLUSTER=azertyuiop-main-7rqtwti
KAFKA_HOST=kafka.internal
KAFKA_REL=kafka
KAFKA_SCHEME=kafka
KAFKA_TYPE=kafka:{{< latest "kafka" >}}
KAFKA_PORT=9092
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
  "service": "kafka",
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.kafka.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "cluster": "azertyuiop-main-7rqtwti",
  "host": "kafka.internal",
  "rel": "kafka",
  "scheme": "kafka",
  "type": "kafka:{{< latest "kafka" >}}",
  "port": 9092
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_KAFKA_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.kafka[0].host')"
```

{{< /codetabs >}}

## Usage example

### 1. Configure the service

To define the service, use the ``kafka`` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: kafka:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="apps"}
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

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container (``<APP_NAME>``) now has [access to the service](/add-services/kafka.md#use-in-app) via the relationship ``<SERVICE_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables)

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="apps"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: kafka
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

{{< /codetabs >}}

### Example configuration

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="apps"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      kafka:
services:
  # The name of the service container. Must be unique within a project.
  kafka:
    type: kafka:{{% latest "kafka" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="apps"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      kafka:
        service: kafka
        endpoint: kafka
services:
  # The name of the service container. Must be unique within a project.
  kafka:
    type: kafka:{{% latest "kafka" %}}
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs >}}

+++
title=Python
file=static/files/fetch/examples/python/kafka
highlight=python
+++

<--->

+++
title=Ruby
highlight=ruby
+++

## With the ruby-kafka gem

# Producer
require "kafka"
kafka = Kafka.new(["kafka.internal:9092"], client_id: "my-application")
kafka.deliver_message("Hello, World!", topic: "greetings")

# Consumer
kafka.each_message(topic: "greetings") do |message|
  puts message.offset, message.key, message.value
end

{{< /codetabs >}}
