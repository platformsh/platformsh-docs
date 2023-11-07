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

### Enterprise edition

{{% premium-features/add-on feature="MongoDB Enterprise" %}}

{{% version/specific %}}
<!-- API Version 1 -->

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

<--->
<!-- API Version 2 -->

{{< image-versions image="mongodb-enterprise" status="supported" environment="grid" >}}

{{% /version/specific %}}

{{% deprecated-versions %}}

{{% version/specific %}}
<!-- API Version 1 -->

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

<--->
<!-- API Version 2 -->

{{< image-versions image="mongodb-enterprise" status="deprecated" environment="grid" >}}

{{% /version/specific %}}

### Legacy edition

Previous non-Enterprise versions are available in your projects (and are listed below),
but they're at their [end of life](https://www.mongodb.com/support-policy/legacy)
and are no longer receiving security updates from upstream.

{{< note >}}

Downgrades of MongoDB aren't supported.
MongoDB updates its own data files to a new version automatically but can't downgrade them.
If you want to experiment with a later version without committing to it use a preview environment.

{{< /note >}}

{{% deprecated-versions %}}

{{< image-versions image="mongodb" status="deprecated" environment="grid" >}}

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
{
    "username": "main",
    "scheme": "mongodb",
    "service": "mongodb36",
    "ip": "169.254.150.147",
    "hostname": "blbczy5frqpkt2sfkj2w3zk72q.mongodb36.service._.eu-3.{{< vendor/urlraw "hostname" >}}",
    "cluster": "rjify4yjcwxaa-master-7rqtwti",
    "host": "mongodb.internal",
    "rel": "mongodb",
    "query": {
        "is_master": true
    },
    "path": "main",
    "password": null,
    "type": "mongodb:{{% latest "mongodb-enterprise" %}}",
    "port": 27017
}
```

## Usage example

### Enterprise edition example

{{% endpoint-description type="mongodb-enterprise" php=true noApp=true /%}}

### Legacy edition example

{{% endpoint-description type="mongodb" php=true /%}}

{{< codetabs v2hide="true" >}}

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

<!-- Version 2: .environment shortcode + context -->
{{% version/only "2" %}}

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}

# Other options...

# Relationships enable an app container's access to a service.
relationships:
    mongodatabase: "dbmongo:mongodb"
{{< /snippet >}}
{{< snippet name="dbmongo" config="service" placeholder="true" >}}
    type: mongodb-enterprise:{{% latest "mongodb-enterprise" %}}
{{< /snippet >}}
```

{{< v2connect2app serviceName="dbmongo" relationship="mongodatabase" var="DATABASE_URL">}}

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export DB_CONNECTION=="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodatabase[0].scheme')"
export DB_USERNAME="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodatabase[0].username')"
export DB_PASSWORD="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodatabase[0].password')"
export DB_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodatabase[0].host')"
export DB_PORT="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodatabase[0].port')"
export DB_DATABASE="$(echo $RELATIONSHIPS_JSON | jq -r '.mongodatabase[0].path')"

# Surface connection string variable for use in app.
export DATABASE_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```

{{< /v2connect2app >}}

{{% /version/only %}}

## Access the service directly

You can access MongoDB from you app container via [SSH](../development/ssh/_index.md).
Get the `host` from your [relationship](#relationship-reference).
Then run the following command:

```bash
mongo {{< variable "HOST" >}}
```

With the example value, that would be the following:

```bash
mongo mongodb.internal
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
