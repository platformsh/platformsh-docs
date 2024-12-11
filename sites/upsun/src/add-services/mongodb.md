---
title: "MongoDB (Database service)"
weight: -40
description: "MongoDB is a cross-platform, document-oriented database.<br><br>For more information on using MongoDB, see <a href=\"https://docs.mongodb.com/manual/\">MongoDB's own documentation</a>."
sidebarTitle: "MongoDB"
premium: true
---

{{< description >}}

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

{{< image-versions image="mongodb-enterprise" status="supported" environment="grid" >}}

{{% deprecated-versions %}}

{{< image-versions image="mongodb-enterprise" status="deprecated" environment="grid" >}}

### Legacy edition

Previous non-Enterprise versions are available in your projects (and are listed below),
but they're at their [end of life](https://www.mongodb.com/support-policy/legacy)
and are no longer receiving security updates from upstream.

{{< note title="Warning" theme="Warning">}}

Downgrades of MongoDB aren't supported.
MongoDB updates its own data files to a new version automatically but can't downgrade them.
If you want to experiment with a later version without committing to it use a preview environment.

{{< /note >}}

{{% deprecated-versions %}}

{{< image-versions image="mongodb" status="deprecated" environment="grid" >}}

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
MONGODB_USERNAME=main
MONGODB_SCHEME=mongodb
MONGODB_SERVICE=mongodb
MONGODB_IP=123.456.78.90
MONGODB_HOSTNAME=azertyuiopqsdfghjklm.mongodb.service._.eu-1.{{< vendor/urlraw "hostname" >}}
MONGODB_CLUSTER=azertyuiop-main-7rqtwti
MONGODB_HOST=mongodbdatabase.internal
MONGODB_REL=mongodb
MONGODB_QUERY={'is_master': True}
MONGODB_PATH=main
MONGODB_PASSWORD=
MONGODB_TYPE=mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
MONGODB_PORT=27017
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
  "username": "main",
  "scheme": "mongodb",
  "service": "mongodb",
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.mongodb.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "cluster": "azertyuiop-main-7rqtwti",
  "host": "mongodb.internal",
  "rel": "mongodb",
  "query": {
    "is_master": true
  },
  "path": "main",
  "password": null,
  "type": "mongodb-enterprise:{{% latest "mongodb-enterprise" %}}",
  "port": 27017
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_MONGODBDATABASE_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodb[0].host')"
```

{{< /codetabs >}}

## Usage example

### Enterprise edition example

#### 1. Configure the service

To define the service, use the ``mongodb-enterprise`` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: mongodb-enterprise:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

#### 2. Define the relationship

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

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container (``<APP_NAME>``) now has [access to the service](#use-in-app) via the relationship ``<SERVICE_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
        endpoint: mongodb
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

```yaml {configFile="apps"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # PHP extensions.
    runtime:
      extensions:
        - mongodb
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

```yaml {configFile="apps"}
applications:
  # The name of the app container. Must be unique within a project.
  <APP_NAME>:
    # PHP extensions.
    runtime:
      extensions:
        - mongodb
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: mongodb
```

{{< /codetabs >}}

#### Example configuration

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="apps"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # PHP extensions.
    runtime:
      extensions:
        - mongodb
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mongodb-enterprise:
services:
  # The name of the service container. Must be unique within a project.
  mongodb-enterprise:
    type: mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="apps"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # PHP extensions.
    runtime:
      extensions:
        - mongodb
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mongodb-enterprise:
        service: mongodb-enterprise
        endpoint: mongodb
services:
  # The name of the service container. Must be unique within a project.
  mongodb-enterprise:
    type: mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
```

{{< /codetabs >}}

### Legacy edition example

#### 1. Configure the service

To define the service, use the ``mongodb`` type:

```yaml {configFile="app"}
services:
  # The name of the service container. Must be unique within a project.
  <SERVICE_NAME>:
    type: mongodb:<VERSION>
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost. Back up your data before changing the service.

#### 2. Define the relationship

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

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container (``<APP_NAME>``) now has [access to the service](#use-in-app) via the relationship ``<SERVICE_NAME>`` and its corresponding [service environment variables](/development/variables/_index.md#service-environment-variables).

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
        endpoint: mongodb
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
        - mongodb
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
        - mongodb
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      <RELATIONSHIP_NAME>:
        service: <SERVICE_NAME>
        endpoint: mongodb
```

{{< /codetabs >}}

#### Example configuration

{{< codetabs >}}

+++
title=Using default endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # PHP extensions.
    runtime:
      extensions:
        - mongodb
    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mongodb:
services:
  # The name of the service container. Must be unique within a project.
  mongodb:
    type: mongodb:4.0.3
```

<--->

+++
title=Using explicit endpoints
+++

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # PHP extensions.
    runtime:
      extensions:
        - mongodb
    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mongodb:
        service: mongodb
        endpoint: mongodb
services:
  # The name of the service container. Must be unique within a project.
  mongodb:
    type: mongodb:4.0.3
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
        - mongodb

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows simplified configuration leveraging a default service
    # (identified from the relationship name) and a default endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mongodb:
service:
  mongodb:
    type: mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
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
        - mongodb

    [...]

    # Relationships enable access from this app to a given service.
    # The example below shows configuration with an explicitly set service name and endpoint.
    # See the Application reference for all options for defining relationships and endpoints.
    relationships:
      mongodb:
        service: mongodb
        endpoint: mongodb
service:
  mongodb:
    type: mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
```

{{< /codetabs >}}

This configuration defines a single application (`myapp`), whose source code exists in the `<PROJECT_ROOT>/myapp` directory.</br>
`myapp` has access to the `mongodb` service, via a relationship whose name is [identical to the service name](#2-define-the-relationship)
(as per [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships).

From this, ``myapp`` can retrieve access credentials to the service through the [relationship environment variables](#relationship-reference).

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export DB_CONNECTION=="${MONGODB_SCHEME}"
export DB_USERNAME="${MONGODB_USERNAME}"
export DB_PASSWORD="${MONGODB_PASSWORD}"
export DB_HOST="${MONGODB_HOST}"
export DB_PORT="${MONGODB_PORT}"
export DB_DATABASE="${MONGODB_PATH}"

# Surface connection string variable for use in app.
export DATABASE_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```

The above file — ``.environment`` in the ``myapp`` directory — is automatically sourced by {{% vendor/name %}} into the runtime environment, so that the variable ``DATABASE_URL`` can be used within the application to connect to the service.

Note that ``DATABASE_URL``, and all {{% vendor/name %}} [service environment variables](/development/variables/_index.md#service-environment-variables) like ``MONGODB_HOST``, are environment-dependent.
Unlike the build produced for a given commit,
they can’t be reused across environments and only allow your app to connect to a single service instance on a single environment.

A file very similar to this is generated automatically for your when using the ``{{% vendor/cli %}} ify`` command to [migrate a codebase to {{% vendor/name %}}](/get-started/_index.md).

## Access the service directly

You can access MongoDB from you app container via [SSH](../development/ssh/_index.md).
Get the `host` from your [relationship](#relationship-reference).
Then run the following command:

```bash
mongo {{< variable "MONGODB_HOST" >}}
```

With the example value, that would be the following:

```bash
mongo mongodb.internal
```

You can obtain the complete list of available service environment variables in your app container by running ``{{% vendor/cli %}} ssh env``.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.

## Exporting data

The most straightforward way to export data from a MongoDB database is to open an SSH tunnel to it
and export the data directly using MongoDB's tools.

First, open an SSH tunnel with the {{% vendor/name %}} CLI:

```bash
{{% vendor/cli %}} tunnel:open
```

That opens an SSH tunnel to all services on your current environment and produce output like the following:

```bash
SSH tunnel opened on port 30000 to relationship: mongodb
```

The port may vary in your case.
You also need to obtain the user, password, and database name from the relationships array, as above.

Then, connect to that port locally using `mongodump` (or your favorite MongoDB tools) to export all data in that server:

```bash
mongodump --port 30000 -u main -p main --authenticationDatabase main --db main
```

(If necessary, vary the `-u`, `-p`, `--authenticationDatabase` and `--db` flags.)

As with any other shell command it can be piped to another command to compress the output or redirect it to a specific file.

For further references, see the [official `mongodump` documentation](https://docs.mongodb.com/database-tools/mongodump/).

## Upgrading

To upgrade to 6.0 from a version earlier than 5.0, you must successively upgrade major releases until you have upgraded to 5.0.
For example, if you are running a 4.2 image, you must upgrade first to 4.4 and then upgrade to 5.0 before you can upgrade to 6.0.

For more details on upgrading and how to handle potential application backward compatibility issues,
see the [MongoDB release notes](https://docs.mongodb.com/manual/release-notes).

{{< note theme="warning" >}}

Make sure you first test your migration on a separate branch.

Also, be sure to take a backup of your production environment **before** you merge this change.
{{< /note >}}

Downgrading isn't supported. If you want, for whatever reason, to downgrade you should create a mongodump, remove the service, recreate the service, and import your dump.
