---
title: Add services
weight: -205
description: See how to add services such as databases, cache, and search engines and configure them to suit your needs.
layout: single
keywords:
  - "services.yaml"
---

{{% vendor/name %}} includes many services, so you don't have to subscribe to external cache or search engine services.
Because the services are included in your project, you can manage them through Git
and they're backed up together with the rest of your project.

Your project defines the services configuration in a file named `{{< vendor/configfile "services" >}}`.

If you don't need any services (such as for a static website), you don't need to include this configuration. Read on to see how to add services.

![Services](/images/management-console/relationships.png "0.50")

## Add a service

Adding a service is a two-step process.

### 1. Configure the service

All service configuration happens in the `{{< vendor/configfile "services" >}}` file in your Git repository.

Configure your service in the following pattern:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
SERVICE_NAME:
    type: {{<variable "SERVICE_TYPE" >}}:{{<variable "VERSION" >}}
    # Other options...
```

An example service configuration for two databases might look like this:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mariadb:
    type: mariadb:{{% latest "mariadb" %}}
    disk: 2048
# The name of the service container. Must be unique within a project.
postgresql:
    type: postgresql:{{% latest "postgresql" %}}
    disk: 1024
```

This YAML file is a dictionary defining all of the services you want to use.
The top-level key is a custom service name ({{<variable "SERVICE_NAME" >}}; in the example, `mariadb` and `postgresql`), which you use to identify the service in step 2.

You can give it any name you want with lowercase alphanumeric characters, hyphens, and underscores.

{{< note >}}

Changing the service name is interpreted as creating an entirely new service.
This **removes all data in that service**.
Always back up your data before changing existing services in your `{{< vendor/configfile "services" >}}` file.

{{< /note >}}

#### Service options

The following table presents the keys you can define for each service:

| Name            | Type       | Required          | Description |
| --------------- | ---------- | ----------------- | ----------- |
| `type`          | `string`   | Yes               | One of the [available services](#available-services) in the format `type:version`. |
| `disk`          | `integer`  | For some services | The size in [MB](/glossary.md#mb) of the [persistent disk](#disk) allocated to the service. Can't be set for memory-resident-only services such as `memcache` and `redis`. Limited by your plan settings. |
| `size`          | `string`   |                   | How many CPU and memory [resources to allocate](#size) to the service. Possible values are `AUTO`, `S`, `M`, `L`, `XL`, `2XL`, and `4XL`. Limited by your plan settings.<BR><BR>When `AUTO` applies, available resources are automatically balanced out based on the number of containers on your plan, so that no container is oversized compared to the others. To view the actual sizes of your containers, check the **Environment Configuration** section in your deployment [activity logs](../increase-observability/logs/access-logs.md#activity-logs). |
| `configuration` | dictionary | For some services | Some services have additional specific configuration options that can be defined here, such as specific endpoints. See the given service page for more details. |
| `relationships` | dictionary | For some services | Some services require a relationship to your app. The content of the dictionary has the same type as the `relationships` dictionary for [app configuration](/create-apps/app-reference/single-runtime-image.md#relationships). The `endpoint_name` for apps is always `http`. |

##### Disk

{{% disk-space-mb %}}

{{% disk-downsize type="service" %}}

##### Size

Resources are distributed across all containers in a project from the total available from your [plan size](../administration/pricing/_index.md).

By default, {{% vendor/name %}} allocates CPU and memory resources to each container automatically.
Some services are optimized for high CPU load, some for high memory load.
If your plan is sufficiently large for bigger containers, you can increase the size of your service container.

Note that service containers in preview environments are always set to size `S`.

### 2. Connect the service

Once you have configured a service, you need to create a relationship to connect it to an app.
This is done in your [app configuration for relationships](/create-apps/app-reference/single-runtime-image.md#relationships).

The relationship follows this pattern:

```yaml {configFile="app"}
# Other options...

# Relationships enable an app container's access to a service.
# The example below shows simplified configuration leveraging a default service (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
    {{<variable "SERVICE_NAME" >}}:
```

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services 
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

An example relationship to connect to the databases given in the [example in step 1](#1-configure-the-service):

```yaml {configFile="app"}
# Other options...

# Relationships enable an app container's access to a service.
relationships:
    mariadb:
    postgresql:
```

```yaml {configFile="services"}
mariadb:
    type: mariadb:{{% latest "mariadb" %}}
    disk: 2048
postgresql:
    type: postgresql:{{% latest "postgresql" %}}
    disk: 1024
```

As with the service name, you can give the relationship any name you want
with lowercase alphanumeric characters, hyphens, and underscores.
It helps if the service name and relationship name are different, but it isn't required.

Each service offers one or more endpoints for connections, depending on the service.
An endpoint is a named set of credentials to give access to other apps and services in your project.
If you don't specify one in the [service configuration](#service-options), a default endpoint is created.
The default endpoint varies by service, generally being its type (such as `mysql` or `solr`).

## Available services

The following table presents the available service types and their versions.
Add them to the `type` key of the [service configuration](#1-configure-the-service) in the format `type:version`.

<!-- To update the versions in this table, use docs/data/registry.json -->
{{% supported-services %}}

### Service versions

These services generally follow [semantic versioning conventions](https://semver.org/).
You can select the major version, but the latest compatible minor is applied automatically and can’t be overridden.
Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

## Service timezones

All services have their system timezone set to UTC by default.
For some services, you can change the timezone for the running service
(this doesn't affect the container itself and so logs are still in UTC).

* [MySQL](./mysql/_index.md#service-timezone)
* [PostgreSQL](./postgresql.md#service-timezone)

## Connect to a service

For security reasons, you can't access services directly through HTTP.
You can connect through your app or by opening an SSH tunnel to access the service directly.

{{< codetabs >}}
+++
title=In an app
+++

Once a service is running and exposed as a relationship,
its credentials (such as the host, username, and password) are available through the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable.
The available information is documented on each service's page, along with sample code for how to connect to it from your app.

The keys in the `{{< vendor/prefix >}}_RELATIONSHIPS` variable are fixed, but the values may change on deployment or restart.
So **use the environment variable** rather than hard coding the values.

<--->
+++
title=Through an SSH tunnel
+++

Connecting to a service using an SSH tunnel is a two-step process.

### 1. Obtain service credentials


To get the credentials for a given service, run the following command:

```bash
{{% vendor/cli %}} relationships
```

You get output like the following:

```yaml
mariadb:
    -
        username: user
        scheme: mysql
        service: mariadb
        fragment: null
        ip: 198.51.100.37
        hostname: abcdefghijklm1234567890123.mariadb.service._.eu.{{< vendor/urlraw "hostname" >}}
        public: false
        cluster: abcdefgh1234567-main-abcd123
        host: mariadb.internal
        rel: mysql
        query:
            is_master: true
        path: main
        password: ''
        type: 'mariadb:10.6'
        port: 3306
        host_mapped: false
        url: 'mysql://user:@mariadb.internal:3306/main'
```

With this example, you can connect to the `mariadb` relationship
with the user `user`, an empty password, and the database name `main` (from the `path`).
The `url` property shows a full database connection that can be used from your app.

{{% service-values-change %}}

### 2. Open an SSH tunnel

Open a single [SSH tunnel](../development/ssh/_index.md#connect-to-services) by running the following CLI command:

```bash
{{% vendor/cli %}} tunnel:single --relationship {{< variable "RELATIONSHIP_NAME" >}}
```

By default, this opens a tunnel at `127.0.0.1:30000`.
You can specify the port for the connection using the `--port` flag.

You can then connect to this service in a separate terminal or locally running app.
With the example above, you connect to a URL like the following:
`mysql://user:@127.0.0.1:30000/main`

{{< /codetabs >}}
