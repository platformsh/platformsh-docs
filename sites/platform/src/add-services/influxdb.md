---
title: "InfluxDB (Database service)"
weight: -80
description: |
  InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.
sidebarTitle: "InfluxDB"
---

InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.

It exposes an HTTP API for client interaction. See the [InfluxDB documentation](https://docs.influxdata.com/influxdb) for more information.

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="influxdb" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="influxdb" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="influxdb" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

## Deprecated versions

The following versions are still available in your projects,
but they're at their end of life and are no longer receiving security updates from upstream.

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="influxdb" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="influxdb" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="influxdb" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

To ensure your project remains stable in the future,
switch to a [supported version](#supported-versions).
See more information on [how to upgrade to version 2.3 or later](#upgrade-to-version-23-or-later).

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

```json
{
  "host": "influxdb.internal",
  "hostname": "azertyuiopqsdfghjklm.influxdb.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "cluster": "azertyuiopqsdf-main-bvxea6i",
  "service": "influxdb",
  "type": "influxdb:{{< latest "influxdb" >}}",
  "rel": "influxdb",
  "scheme": "http",
  "username": "admin",
  "password": "ChangeMe",
  "port": 8086,
  "path": null,
  "query": {
    "org": "main",
    "bucket": "main",
    "api_token": "azertyuiopqsdfghjklm1234567890"
  },
  "fragment": null,
  "public": false,
  "host_mapped": false,
  "instance_ips": [
    "123.456.78.90"
  ],
  "ip": "123.456.78.90"
}
```

## Usage example

### 1. Configure the service

To define the service, use the `influxdb` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: influxdb:<VERSION>
  disk: 256
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

### 2. Define the relationship

To define the relationship, use the following configuration:

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp
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

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  <RELATIONSHIP_NAME>:
    service: <SERVICE_NAME>
    endpoint: influxdb
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

### Example configuration

### [Service definition](/add-services.html)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
influxdb:
  type: influxdb:{{% latest "influxdb" %}}
  disk: 256
```

#### [App configuration](/create-apps)

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
# The example below shows simplified configuration leveraging a default service
# (identified from the relationship name) and a default endpoint.
# See the Application reference for all options for defining relationships and endpoints.
relationships:
  influxdb:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
name: myapp
# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  influxdb:
    service: <SERVICE_NAME>
    endpoint: influxdb
```

{{< /codetabs >}}

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
# The name of the app container. Must be unique within a project.
name: myapp

[...]

# Relationships enable an app container's access to a service.
relationships:
  influxdb:
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
# The name of the app container. Must be unique within a project.
name: myapp

[...]

# Relationships enable access from this app to a given service.
# The example below shows configuration with an explicitly set service name and endpoint.
# See the Application reference for all options for defining relationships and endpoints.
# Note that legacy definition of the relationship is still supported.
# More information: https://docs.platform.sh/create-apps/app-reference/single-runtime-image.html#relationships
relationships:
  influxdb:
    service: influxdb
    endpoint: influxdb
```
{{< /codetabs >}}

```yaml {configFile="services"}
influxdb:
  type: influxdb:{{% latest "influxdb" %}}
```

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `influxdb` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, `myapp` can retrieve access credentials to the service through the environment variable `{{< vendor/prefix >}}_RELATIONSHIPS`. That variable is a base64-encoded JSON object, but can be decoded at runtime (using the built-in tool `jq`) to provide more accessible environment variables to use within the application itself:

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for common InfluxDB credentials.
export INFLUX_USER=$(echo $RELATIONSHIPS_JSON | jq -r ".influxdb[0].username")
export INFLUX_HOST=$(echo $RELATIONSHIPS_JSON | jq -r ".influxdb[0].host")
export INFLUX_ORG=$(echo $RELATIONSHIPS_JSON | jq -r ".influxdb[0].query.org")
export INFLUX_TOKEN=$(echo $RELATIONSHIPS_JSON | jq -r ".influxdb[0].query.api_token")
export INFLUX_BUCKET=$(echo $RELATIONSHIPS_JSON | jq -r ".influxdb[0].query.bucket")
```

The above file &mdash; `.environment` in the `myapp` directory &mdash; is automatically sourced by {{< vendor/name >}} into the runtime environment, so that the variable `INFLUX_HOST` can be used within the application to connect to the service.

Note that `INFLUX_HOST` and all {{< vendor/name >}}-provided environment variables like `{{% vendor/prefix %}}_RELATIONSHIPS`, are environment-dependent. Unlike the build produced for a given commit, they can't be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the `{{< vendor/cli >}} ify` command to [migrate a codebase to {{% vendor/name %}}](/get-started).

## Export data

To export your data from InfluxDB, follow these steps:

1. Install and set up the [`influx` CLI](https://docs.influxdata.com/influxdb/cloud/tools/influx-cli/).
2. Connect to your InfluxDB service with the [{{% vendor/name %}} CLI](../administration/cli/_index.md):

   ```bash
   {{% vendor/cli %}} tunnel:single
   ```

   This opens an SSH tunnel to your InfluxDB service on your current environment and produces output like the following:

   ```bash
   SSH tunnel opened to {{<variable "RELATIONSHIP_NAME" >}} at: http://127.0.0.1:30000
   ```

3. Get the username, password and token from the [relationship](#relationship-reference) by running the following command:

   ```bash
   {{% vendor/cli %}} relationships -P {{<variable "RELATIONSHIP_NAME" >}}
   ```

4. Adapt and run [InfluxDB's CLI export command](https://docs.influxdata.com/influxdb/v2.3/reference/cli/influx/backup/).

    ``` bash
    influx backup --host {{< variable "URL_FROM_STEP_2" >}} --token {{< variable "API_TOKEN_FROM_STEP_3" >}}
    ```

## Upgrade to version 2.3 or later

### From a previous 2.x version

From version 2.3 onward, the structure of relationships changes.

If you're using a prior 2.x version, your app might currently rely on pulling the `bucket`, `org`, `api_token`,
or `user` values available in the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](../development/variables/use-variables.md#use-provided-variables).

If so, to ensure your upgrade is successful, make the following changes to your connection logic:

- Rename the `user` key to `username`.
- Move the `org`, `bucket` and `api_token` keys so they're contained in a dictionary under the `query` key.

If you're relying on any other attributes connecting to InfluxDB, they remain accessible as top-level keys from the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](../development/variables/use-variables.md#use-provided-variables), aside from those addressed above:

```json
{
  "host": "influxdb.internal",
  "hostname": "azertyuiopqsdfghjklm.influxdb.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "cluster": "azertyuiopqsdf-main-bvxea6i",
  "service": "influxdb",
  "type": "influxdb:{{< latest "influxdb" >}}",
  "rel": "influxdb",
  "scheme": "http",
  "username": "admin",
  "password": "ChangeMe",
  "port": 8086,
  "path": null,
  "query": {
    "org": "main",
    "bucket": "main",
    "api_token": "azertyuiopqsdfghjklm1234567890"
  },
  "fragment": null,
  "public": false,
  "host_mapped": false,
  "ip": "123.456.78.90"
}
```

### From a 1.x version

From version 2.3 onward, InfluxDB includes an upgrade utility that can convert databases from previous versions to version 2.3 or later.

To upgrade from a 1.x version to 2.3 or later,
change the service version in your `{{< vendor/configfile "services" >}}` file and push your project.
Any existing data you had in your 1.x system is automatically upgraded for you into the 2.3+ system.

{{< note >}}

During an upgrade from a 1.x version to a 2.3 version or later,
a new admin password and a new admin API token are automatically generated.
Previous credentials can't be retained.

You can retrieve your new credentials through the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](../development/variables/use-variables.md#use-provided-variables) or by running `{{< vendor/cli >}} relationships`.

{{< /note >}}
