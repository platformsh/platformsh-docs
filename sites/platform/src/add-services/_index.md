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

{{% version/specific %}}
<!-- API Version 1 -->
Your project defines the services configuration in a file named `{{< vendor/configfile "services" >}}`.
<--->
<!-- API Version 2 -->
Your project defines the services configuration from a top-level key called `services`, which is placed in a unified configuration file like `{{< vendor/configfile "services" >}}`.
{{% /version/specific %}}

If you don't need any services (such as for a static website), you don't need to include this configuration. Read on to see how to add services.

{{% version/only "1" %}}
![Services](/images/management-console/relationships.png "0.50")
{{% /version/only %}}

## Add a service

Adding a service is a two-step process.

### 1. Configure the service

All service configuration happens in the `{{< vendor/configfile "services" >}}` file in your Git repository.

Configure your service in the following pattern:

```yaml {configFile="services"}
{{% snippet name="SERVICE_NAME" config="service" %}}
    type: {{<variable "SERVICE_TYPE" >}}:{{<variable "VERSION" >}}
    # Other options...
{{% /snippet %}}
```

An example service configuration for two databases might look like this:

{{< version/specific >}}
<!-- Version 1 -->

```yaml {configFile="services"}
{{< snippet name="database1" config="service" >}}
    type: mariadb:{{% latest "mariadb" %}}
    disk: 2048
{{< /snippet >}}
{{< snippet name="database2" config="service" globKey="false" >}}
    type: postgresql:{{% latest "postgresql" %}}
    disk: 1024
{{< /snippet >}}
```

<--->
<!-- Version 2 -->

```yaml {configFile="services"}
{{< snippet name="database1" config="service" >}}
    type: mariadb:{{% latest "mariadb" %}}
{{< /snippet >}}
{{< snippet name="database2" config="service" globKey="false" >}}
    type: postgresql:{{% latest "postgresql" %}}
{{< /snippet >}}
```

{{< /version/specific >}}

{{% version/specific %}}
<!-- API Version 1 -->
This YAML file is a dictionary defining all of the services you want to use.
The top-level key is a custom service name ({{<variable "SERVICE_NAME" >}}; in the example, `database1` and `database2`), which you use to identify the service in step 2.
<--->
<!-- API Version 2 -->
This YAML file contains a dictionary defining all of the services you want to use.
The top-level key `services` defines an object of all of the services to be provisioned for the project. 
Below that, come custom service names ({{<variable "SERVICE_NAME" >}}; in the example, `database1` and `database2`), which you use to identify services in step 2.
{{% /version/specific %}}
You can give it any name you want with lowercase alphanumeric characters, hyphens, and underscores.

{{< note >}}

Changing the service name is interpreted as creating an entirely new service.
This **removes all data in that service**.
Always back up your data before changing existing services in your `{{< vendor/configfile "services" >}}` file.

{{< /note >}}

#### Service options

The following table presents the keys you can define for each service:

{{% version/specific %}}

<!-- Version 1 -->

| Name            | Type       | Required          | Description |
| --------------- | ---------- | ----------------- | ----------- |
| `type`          | `string`   | Yes               | One of the [available services](#available-services) in the format `type:version`. |
| `disk`          | `integer`  | For some services | The size in [MB](/glossary.md#mb) of the [persistent disk](#disk) allocated to the service. Can't be set for memory-resident-only services such as `memcache` and `redis`. Limited by your plan settings. |
| `size`          | `string`   |                   | How many CPU and memory [resources to allocate](#size) to the service. Possible values are `AUTO`, `S`, `M`, `L`, `XL`, `2XL`, and `4XL`. Limited by your plan settings.<BR><BR>When `AUTO` applies, available resources are automatically balanced out based on the number of containers on your plan, so that no container is oversized compared to the others. To view the actual sizes of your containers, check the **Environment Configuration** section in your deployment [activity logs](../increase-observability/logs/access-logs.md#activity-logs). |
| `configuration` | dictionary | For some services | Some services have additional specific configuration options that can be defined here, such as specific endpoints. See the given service page for more details. |
| `relationships` | dictionary | For some services | Some services require a relationship to your app. The content of the dictionary has the same type as the `relationships` dictionary for [app configuration](../create-apps/app-reference.md#relationships). The `endpoint_name` for apps is always `http`. |

<--->
<!-- Version 2 -->

| Name            | Type       | Required          | Description |
| --------------- | ---------- | ----------------- | ----------- |
| `type`          | `string`   | Yes               | One of the [available services](#available-services) in the format `type:version`. |
| `configuration` | dictionary | For some services | Some services have additional specific configuration options that can be defined here, such as specific endpoints. See the given service page for more details. |
| `relationships` | dictionary | For some services | Some services require a relationship to your app. The content of the dictionary has the same type as the `relationships` dictionary for [app configuration](../create-apps/app-reference.md#relationships). The `endpoint_name` for apps is always `http`. |

{{% /version/specific %}}

{{% version/specific %}}
<!-- Version 1 -->

##### Disk

{{% disk-space-mb %}}

{{% disk-downsize type="service" %}}

##### Size

Resources are distributed across all containers in a project from the total available from your [plan size](../administration/pricing/_index.md).

By default, {{% vendor/name %}} allocates CPU and memory resources to each container automatically.
Some services are optimized for high CPU load, some for high memory load.
If your plan is sufficiently large for bigger containers, you can increase the size of your service container.

Note that service containers in preview environments are always set to size `S`.

<--->
<!-- Version 2 -->

##### Resources (CPU, RAM, disk)

{{% vendor/name %}} allows you to configure resources (CPU, RAM, and disk) per environment for each of your services.
For more information, see how to [manage resources](/manage-resources.md).

{{% disk-space-mb %}}

{{% disk-downsize type="service" %}}

{{% /version/specific %}}

### 2. Connect the service

Once you have configured a service, you need to create a relationship to connect it to an app.
This is done in your [app configuration for relationships](../create-apps/app-reference.md#relationships).

The relationship follows this pattern:

```yaml {configFile="app"}
{{% snippet name="<APP_NAME>" config="app" root="false"%}}

# Other options...

# Relationships enable an app container's access to a service.
relationships:
    {{< variable "RELATIONSHIP_NAME" >}}: "{{< variable "SERVICE_NAME" >}}:{{< variable "ENDPOINT" >}}"
{{% /snippet %}}
{{% snippet name="SERVICE_NAME" config="service" placeholder="true"%}}
    type: {{<variable "SERVICE_TYPE" >}}:{{<variable "VERSION" >}}
    # Other options...
{{% /snippet %}}
```

An example relationship to connect to the databases given in the [example in step 1](#1-configure-the-service):

{{% version/specific %}}
<!-- Version 1 -->

```yaml {configFile="app"}
{{< snippet name="<APP_NAME>" config="app" root="false">}}

# Other options...

# Relationships enable an app container's to a service.
relationships:
    mysql_database: "database1:mysql"
    postgresql_database: "database2:postgresql"
{{< /snippet >}}
{{< snippet name="database1" config="service" placeholder="true" >}}
    type: mariadb:{{% latest "mariadb" %}}
    disk: 2048
{{< /snippet >}}
{{< snippet name="database2" config="service" globKey="false" placeholder="true" >}}
    type: postgresql:{{% latest "postgresql" %}}
    disk: 1024
{{< /snippet >}}
```

<--->
<!-- Version 2 -->

```yaml {configFile="app"}
{{< snippet name="<APP_NAME>" config="app" root="false">}}

# Other options...

# Relationships enable an app container's to a service.
relationships:
    mysql_database: "database1:mysql"
    postgresql_database: "database2:postgresql"
{{< /snippet >}}
{{< snippet name="database1" config="service" placeholder="true" >}}
    type: mariadb:{{% latest "mariadb" %}}
{{< /snippet >}}
{{< snippet name="database2" config="service" globKey="false" placeholder="true" >}}
    type: postgresql:{{% latest "postgresql" %}}
{{< /snippet >}}
```

{{% /version/specific %}}

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
The available information is documented on each service's page along with sample code for how to connect to it from your app.

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
database:
    -
        username: user
        scheme: mysql
        service: database
        fragment: null
        ip: 198.51.100.37
        hostname: abcdefghijklm1234567890123.database.service._.eu.{{< vendor/urlraw "hostname" >}}
        public: false
        cluster: abcdefgh1234567-main-abcd123
        host: database.internal
        rel: mysql
        query:
            is_master: true
        path: main
        password: ''
        type: 'mariadb:10.6'
        port: 3306
        host_mapped: false
        url: 'mysql://user:@database.internal:3306/main'
```

With this example, you can connect to the `database` relationship
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
