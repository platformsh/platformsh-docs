---
title: "InfluxDB (Database service)"
weight: -80
description: |
  InfluxDB is a time series database optimized for high-write-volume use cases such as logs, sensor data, and real-time analytics.
sidebarTitle: "InfluxDB"
---

{{% description %}}

It exposes an HTTP API for client interaction. See the [InfluxDB documentation](https://docs.influxdata.com/influxdb) for more information.

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. 
When you deploy your app, you always get the latest available patches.

{{< image-versions image="influxdb" status="supported" environment="grid" >}}

## Deprecated versions

The following versions are still available in your projects,
but they're at their end of life and are no longer receiving security updates from upstream.

{{< image-versions image="influxdb" status="deprecated" environment="grid" >}}

To ensure your project remains stable in the future,
switch to a [supported version](#supported-versions).
See more information on [how to upgrade to version 2.3 or later](#upgrade-to-version-23-or-later).

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
INFLUXDB_HOST=influxdb.internal
INFLUXDB_HOSTNAME=azertyuiopqsdfghjklm.influxdb.service._.eu-1.{{< vendor/urlraw "hostname" >}}
INFLUXDB_CLUSTER=azertyuiopqsdf-main-bvxea6i
INFLUXDB_SERVICE=influxdb
INFLUXDB_TYPE=influxdb:{{< latest "influxdb" >}}
INFLUXDB_REL=influxdb
INFLUXDB_SCHEME=http
INFLUXDB_USERNAME=admin
INFLUXDB_PASSWORD=ChangeMe
INFLUXDB_PORT=8086
INFLUXDB_PATH=
INFLUXDB_QUERY={'org': 'main', 'bucket': 'main', 'api_token': 'azertyuiopqsdfghjklm1234567890'}
INFLUXDB_FRAGMENT=
INFLUXDB_PUBLIC=false
INFLUXDB_HOST_MAPPED=false
INFLUXDB_IP=123.456.78.90
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

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

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_INFLUXDB_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.influxdb[0].host')"
```

{{< /codetabs >}}

## Usage example

### 1. Configure the service

To define the service, use the `influxdb` type:

```yaml {configFile="app"}
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: influxdb:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

### 2. Add the relationship

To define the relationship, use the following configruation:

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
services:
    # The name of the service container. Must be unique within a project.
    <SERVICE_NAME>:
        type: influxdb:<VERSION>
```

You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services 
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container (``<APP_NAME>``) now has [access to the service](/add-services/influxdb.md#use-in-app) via the relationship ``<RELATIONSHIP_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

### Example configuration

```yaml {configFile="app"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # Relationships enable access from this app to a given service.
        # The example below shows simplified configuration leveraging a default service
        # (identified from the relationship name) and a default endpoint.
        # See the Application reference for all options for defining relationships and endpoints.
        relationships:
            influxdb: 

services:
    # The name of the service container. Must be unique within a project.
    influxdb:
        type: influxdb:{{% latest "influxdb" %}}
```

### Use in app

To use the configured service in your app, add a configuration file similar to the following to your project.

```yaml {configFile="services"}
applications:
    # The name of the app container. Must be unique within a project.
    myapp:
        # The location of the application's code.
        source:
            root: "/"

        [...]

        # Relationships enable an app container's access to a service.
        relationships:
            influxdb:

service:
    influxdb:
        type: influxdb:{{% latest "influxdb" %}}
```

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `influxdb` service, via a relationship whose name is [identical to the service name](#2-add-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for common InfluxDB credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export INFLUX_USER=${INFLUXDB_USERNAME}
export INFLUX_HOST=${INFLUXDB_HOST}
export INFLUX_ORG=$(echo $INFLUXDB_QUERY | jq -r ".org")
export INFLUX_TOKEN=$(echo $INFLUXDB_QUERY | jq -r ".api_token")
export INFLUX_BUCKET=$(echo $INFLUXDB_QUERY | jq -r ".bucket")
```

The above file — ``.environment`` in the ``myapp`` directory — is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``INFLUX_HOST`` can be used within the application to connect to the service.

Note that ``INFLUX_HOST``, and all [{{% vendor/name %}}-service environment variables](/development/variables/_index.md#service-environment-variables) like ``INFLUXDBDATABASE_HOST``,
are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} ify`` command to [migrate a codebase to {{% vendor/name %}}](/get-started/_index.md).

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
or `user` values available in the [`{{< vendor/prefix >}}_RELATIONSHIPS` environment variable](#relationship-reference).

If so, to ensure your upgrade is successful, make the following changes to your connection logic:

- Rename the `user` key to `username`.
- Move the `org`, `bucket` and `api_token` keys so they're contained in a dictionary under the `query` key.

If you're relying on any other attributes connecting to InfluxDB, they remain accessible as environment variable from the [service environment variable](#relationship-reference), aside from those addressed above:

### From a 1.x version

From version 2.3 onward, InfluxDB includes an upgrade utility that can convert databases from previous versions to version 2.3 or later.

To upgrade from a 1.x version to 2.3 or later,
change the service version in your `{{< vendor/configfile "services" >}}` file and push your project.
Any existing data you had in your 1.x system is automatically upgraded for you into the 2.3+ system.

{{< note >}}

During an upgrade from a 1.x version to a 2.3 version or later,
a new admin password and a new admin API token are automatically generated.
Previous credentials can't be retained.

You can retrieve your new credentials through the [service environment variables](/development/variables/_index.md#service-environment-variables).

{{< /note >}}
