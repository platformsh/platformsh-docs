---
title: "MongoDB (Database service)"
weight: -40
description: "MongoDB is a cross-platform, document-oriented database.<br><br>For more information on using MongoDB, see <a href=\"https://docs.mongodb.com/manual/\">MongoDB's own documentation</a>."
sidebarTitle: "MongoDB"
premium: true
---

MongoDB is a cross-platform, document-oriented database.

For more information on using MongoDB, see [MongoDB's own documentation](https://docs.mongodb.com/manual/).

## Use a framework

If you use one of the following frameworks, follow its guide:

- [Jakarta EE](../guides/jakarta/deploy.md#mongodb)
- [Micronaut](../guides/micronaut/mongodb.md)
- [Quarkus](../guides/quarkus/mongodb.md)
- [Spring](../guides/spring/mongodb.md)

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

### Enterprise edition

{{% note title="Premium Service" theme="info" %}}
MongoDB Enterprise isn’t included in any {{< vendor/name >}} plan.
You need to add it separately at an additional cost.
To add MongoDB Enterprise, [contact Sales](https://platform.sh/contact/).
{{% /note %}}

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
            <td>{{< image-versions image="mongodb-enterprise" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="mongodb-enterprise" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="mongodb-enterprise" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

### Deprecated versions

The following versions are [deprecated](/glossary.html#deprecated-versions).
They're available, but they aren't receiving security updates from upstream and aren't guaranteed to work.
They'll be removed in the future,
so migrate to one of the [supported versions](#supported-versions).

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
            <td>{{< image-versions image="mongodb-enterprise" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="mongodb-enterprise" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="mongodb-enterprise" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

### Legacy edition

Previous non-Enterprise versions are available in your projects (and are listed below),
but they're at their [end of life](https://www.mongodb.com/support-policy/legacy)
and are no longer receiving security updates from upstream.

{{< note title="Warning" theme="Warning">}}

Downgrades of MongoDB aren't supported.
MongoDB updates its own data files to a new version automatically but can't downgrade them.
If you want to experiment with a later version without committing to it use a preview environment.

{{< /note >}}

### Deprecated versions

The following versions are [deprecated](/glossary.html#deprecated-versions).
They're available, but they aren't receiving security updates from upstream and aren't guaranteed to work.
They'll be removed in the future,
so migrate to one of the [supported versions](#supported-versions).

{{< image-versions image="mongodb" status="deprecated" environment="grid" >}}

## Relationship reference

Example information available through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{% vendor/cli %}} relationships`.

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed.
So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

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

## Usage example

### Enterprise edition example

#### 1. Configure the service

To define the service, use the `mongodb-enterprise` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: mongodb-enterprise:<VERSION>
  disk: 512
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Define the relationship

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

With the above definition, the application container now has access to the service via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

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
    endpoint: mongodb
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has access to the service via the relationship `<RELATIONSHIP_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions) for the service:

```yaml {configFile="app"}
name: myapp
# PHP extensions.
runtime:
  extensions:
    - mongodb
```

#### Example configuration

##### [Service definition](/add-services/_index.md)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mongodb-enterprise:
  type: mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
  disk: 512
```

##### [App configuration](/create-apps/_index.md)

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
  mongodb-enterprise:
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
  mongodb-enterprise:
    service: mongodb-enterprise
    endpoint: mongodb
```

{{< /codetabs >}}

### Legacy edition example

#### 1. Configure the service

To define the service, use the `mongodb` type:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
<SERVICE_NAME>:
  type: mongodb:<VERSION>
  disk: 512
```

Note that changing the name of the service replaces it with a brand new service and all existing data is lost.
Back up your data before changing the service.

#### 2. Define the relationship

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

With the above definition, the application container now has access to the service via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

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
    endpoint: mongodb
```

You can define ``<SERVICE_NAME>`` and ``<RELATIONSHIP_NAME>`` as you like, so long as it's unique between all defined services and relationships
and matches in both the application and services configuration.

The example above leverages [explicit endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.

Depending on your needs, instead of explicit endpoint configuration,
you can use [default endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container now has access to the service via the relationship `<SERVICE_NAME>` and its corresponding [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).

{{< /codetabs >}}

For PHP, enable the [extension](/languages/php/extensions) for the service:

```yaml {configFile="app"}
name: myapp
# PHP extensions.
runtime:
  extensions:
    - mongodb
```

#### Example configuration

##### [Service definition](/add-services)

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mongodb:
    type: mongodb:{{% latest "mongodb" %}}
    disk: 512
```

##### [App configuration](/create-apps)

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
  mongodb:
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
  mongodb:
    service: mongodb
    endpoint: mongodb
```

{{< /codetabs >}}

{{< codetabs >}}

+++
title=Go
file=static/files/fetch/examples/golang/mongodb
highlight=go
+++

<--->

+++
title=Java
file=static/files/fetch/examples/java/mongodb
highlight=java
+++

<--->

+++
title=Node.js
file=static/files/fetch/examples/nodejs/mongodb
highlight=js
+++

<--->

+++
title=PHP
file=static/files/fetch/examples/php/mongodb
highlight=php
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/mongodb
highlight=python
+++

{{< /codetabs >}}

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

Note that the information about the relationship can change when an app is redeployed or restarted or the relationship is changed. So your apps should only rely on the `{{% vendor/prefix %}}_RELATIONSHIPS` environment variable directly rather than hard coding any values.

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
