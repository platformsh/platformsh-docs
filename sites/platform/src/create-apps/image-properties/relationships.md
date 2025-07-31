---
title: "`relationships`"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images in {{% vendor/name %}}.

## Relationships 

To allow containers in your project to communicate with one another,
you need to define relationships between them.
You can define a relationship between an app and a service, or [between two apps](/create-apps/multi-app/relationships.md).

The quickest way to define a relationship between your app and a service
is to use the service's default endpoint.</br>
However, some services allow you to define multiple databases, cores, and/or permissions.
In these cases, you can't rely on default endpoints.
Instead, you can explicitly define multiple endpoints when setting up your relationships.

{{< note >}}
App containers don't have a default endpoint like services.
To connect your app to another app in your project,
you need to explicitly define the `http` endpoint as the endpoint to connect both apps.</br>
For more information, see how to [define relationships between your apps](/create-apps/multi-app/relationships.md).
{{< /note >}}

{{< note title="Availability" theme="info">}}

New syntax (default and explicit endpoints) described below is supported by most, but not all, image types
(`Relationship 'SERVICE_NAME' of application 'myapp' ... targets a service without a valid default endpoint configuration.`).
This syntax is currently being rolled out for all images.
If you encounter this error, use the "legacy" {{% vendor/name %}} configuration noted at the bottom of this section.

{{< /note >}}

To define a relationship between your app and a service:

{{< codetabs >}}

+++
title=Using default endpoints
+++

Use the following configuration:

```yaml {configFile="app"}
relationships:
  {{% variable "SERVICE_NAME" %}}:
```

The `SERVICE_NAME` is the name of the service as defined in its [configuration](/add-services/_index.md).
It is used as the relationship name, and associated with a `null` value.
This instructs {{% vendor/name %}} to use the service's default endpoint to connect your app to the service.

For example, if you define the following configuration:

```yaml {configFile="app"}
relationships:
  mariadb:
```

{{% vendor/name %}} looks for a service named `mariadb` in your `{{% vendor/configfile "services" %}}` file,
and connects your app to it through the service's default endpoint.

For reference, the equivalent configuration using explicit endpoints would be the following:

```yaml {configFile="app"}
relationships:
  mariadb:
    service: mariadb
    endpoint: mysql
```

You can define any number of relationships in this way:

```yaml {configFile="app"}
relationships:
  mariadb:
  redis:
  elasticsearch:
```

{{< note title="Tip" theme="info" >}}

An even quicker way to define many relationships is to use the following single-line configuration:

```yaml {configFile="app"}
relationships: {{{< variable "SERVICE_NAME_A" >}}, {{< variable "SERVICE_NAME_B" >}}, {{< variable "SERVICE_NAME_C" >}}}
```

where

```yaml {configFile="services"}
{{< variable "SERVICE_NAME_A" >}}:
  type: mariadb:{{% latest "mariadb" %}}
  disk: 256
{{< variable "SERVICE_NAME_B" >}}:
  type: redis:{{% latest "redis" %}}
  disk: 256
{{< variable "SERVICE_NAME_C" >}}:
  type: elasticsearch:{{% latest "elasticsearch" %}}
  disk: 256
```

{{< /note >}}

<--->

+++
title=Using explicit endpoints
+++

Use the following configuration:

```yaml {configFile="app"}
relationships:
  {{% variable "RELATIONSHIP_NAME" %}}:
    service: {{% variable "SERVICE_NAME" %}}
    endpoint: {{% variable "ENDPOINT_NAME" %}}
```

- `RELATIONSHIP_NAME` is the name you want to give to the relationship.
- `SERVICE_NAME` is the name of the service as defined in its [configuration](/add-services/_index.md).
- `ENDPOINT_NAME` is the endpoint your app will use to connect to the service (refer to the service reference to know which value to use).

For example, to define a relationship named `database` that connects your app to a service called `mariadb` through the `db1` endpoint,
use the following configuration:

```yaml {configFile="app"}
relationships:
  database: # The name of the relationship.
    service: mariadb
    endpoint: db1
```

For more information on how to handle multiple databases, multiple cores,
and/or different permissions with services that support such features,
see each service's dedicated page:

 - [MariaDB/MySQL](/add-services/mysql/_index.md#multiple-databases) (multiple databases and permissions)
 - [PostgreSQL](/add-services/postgresql/_index.md#multiple-databases) (multiple databases and permissions)
 - [Redis](/add-services/redis/_index.md#multiple-databases) (multiple databases)
 - [Solr](add-services/solr/_index.md#solr-6-and-later) (multiple cores)
 - [Vault KMS](add-services/vault.md#multiple-endpoints-configuration) (multiple permissions)

 You can add as many relationships as you want to your app configuration,
 using both default and explicit endpoints according to your needs:

```yaml {configFile="app"}
relationships:
  database1:
    service: mariadb
    endpoint: admin
  database2:
    service: mariadb
    endpoint: legacy
  cache:
    service: redis
  search:
    service: elasticsearch
```

{{< /codetabs >}}

{{< note theme="info" title="Legacy" >}}

The following legacy syntax for specifying relationships is still supported by {{% vendor/name %}}:

```yaml {configFile="app"}
relationships:
  <RELATIONSHIP_NAME>: "<SERVICE_NAME>:<ENDPOINT_NAME>"
```

For example:

```yaml {configFile="app"}
relationships:
  database: "mariadb:mysql"
```

Feel free to use this until the default and explicit endpoint syntax is supported on all images.

{{< /note >}}



