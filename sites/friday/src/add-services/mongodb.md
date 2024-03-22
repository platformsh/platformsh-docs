---
title: "MongoDB (Database service)"
weight: -40
description: "MongoDB is a cross-platform, document-oriented database.<br><br>For more information on using MongoDB, see <a href=\"https://docs.mongodb.com/manual/\">MongoDB's own documentation</a>."
sidebarTitle: "MongoDB"
premium: true
---

{{< description >}}

{{% frameworks version="1" %}}

- [Jakarta EE](../guides/jakarta/deploy.md#mongodb)
- [Micronaut](../guides/micronaut/mongodb.md)
- [Quarkus](../guides/quarkus/mongodb.md)
- [Spring](../guides/spring/mongodb.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

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

{{% relationship-ref-intro %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
MONGODBDATABASE_USERNAME=main
MONGODBDATABASE_SCHEME=mongodb
MONGODBDATABASE_SERVICE=mongodb
MONGODBDATABASE_IP=123.456.78.90
MONGODBDATABASE_HOSTNAME=azertyuiopqsdfghjklm.mongodb.service._.eu-1.{{< vendor/urlraw "hostname" >}}
MONGODBDATABASE_CLUSTER=azertyuiop-main-7rqtwti
MONGODBDATABASE_HOST=mongodbdatabase.internal
MONGODBDATABASE_REL=mongodb
MONGODBDATABASE_QUERY={'is_master': True}
MONGODBDATABASE_PATH=main
MONGODBDATABASE_PASSWORD=
MONGODBDATABASE_TYPE=mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
MONGODBDATABASE_PORT=27017
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
    "host": "mongodbdatabase.internal",
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
export APP_MONGODBDATABASE_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodbdatabase[0].host')"
```

{{< /codetabs >}}

## Usage example

### Enterprise edition example

{{% endpoint-description type="mongodb-enterprise" php=true noApp=true /%}}

### Legacy edition example

{{% endpoint-description type="mongodb" php=true /%}}

```yaml {configFile="app"}
{{% snippet name="myapp" config="app" root="myapp"  %}}

# Other options...

# Relationships enable an app container's access to a service.
relationships:
    mongodbdatabase: "mongodb:mongodb"
{{% /snippet %}}
{{% snippet name="mongodb" config="service" placeholder="true"  %}}
    type: mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
{{% /snippet %}}
```

{{% v2connect2app serviceName="mongodb" relationship="mongodbdatabase" var="DATABASE_URL"%}}

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.
export DB_CONNECTION=="${MONGODBDATABASE_SCHEME}"
export DB_USERNAME="${MONGODBDATABASE_USERNAME}"
export DB_PASSWORD="${MONGODBDATABASE_PASSWORD}"
export DB_HOST="${MONGODBDATABASE_HOST}"
export DB_PORT="${MONGODBDATABASE_PORT}"
export DB_DATABASE="${MONGODBDATABASE_PATH}"

# Surface connection string variable for use in app.
export DATABASE_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```

{{% /v2connect2app %}}

## Access the service directly

You can access MongoDB from you app container via [SSH](../development/ssh/_index.md).
Get the `host` from your [relationship](#relationship-reference).
Then run the following command:

```bash
mongo {{< variable "MONGODBDATABASE_HOST" >}}
```

With the example value, that would be the following:

```bash
mongo mongodbdatabase.internal
```

{{% service-values-change %}}

## Exporting data

The most straightforward way to export data from a MongoDB database is to open an SSH tunnel to it
and export the data directly using MongoDB's tools.

First, open an SSH tunnel with the {{% vendor/name %}} CLI:

```bash
{{% vendor/cli %}} tunnel:open
```

That opens an SSH tunnel to all services on your current environment and produce output like the following:

```bash
SSH tunnel opened on port 30000 to relationship: database
SSH tunnel opened on port 30001 to relationship: redis
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
