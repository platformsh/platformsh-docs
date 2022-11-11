---
title: "MongoDB (Database service)"
weight: 6
description: "MongoDB is a cross-platform, document-oriented database.<br><br>For more information on using MongoDB, see <a href=\"https://docs.mongodb.com/manual/\">MongoDB's own documentation</a>."
sidebarTitle: "MongoDB"
premium: true
---

{{% frameworks %}}

- [Jakarta EE](../guides/jakarta/deploy.md#mongodb)
- [Micronaut](../guides/micronaut/mongodb.md)
- [Quarkus](../guides/quarkus/mongodb.md)
- [Spring](../guides/spring/mongodb.md)

{{% /frameworks %}}

## Supported versions

### Enterprise edition

{{< premium-features/add-on feature="MongoDB Enterprise" >}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="mongodb-enterprise" status="supported" environment="grid" >}} | {{< image-versions image="mongodb-enterprise" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="mongodb-enterprise" status="supported" environment="dedicated-gen-2" >}} |

{{% deprecated-versions %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="mongodb-enterprise" status="deprecated" environment="grid" >}} | {{< image-versions image="mongodb-enterprise" status="deprecated" environment="dedicated-gen-3" >}} | {{< image-versions image="mongodb-enterprise" status="deprecated" environment="dedicated-gen-2" >}} |

### Legacy edition

Previous non-Enterprise versions are available in your projects (and are listed below),
but they're at their [end of life](https://www.mongodb.com/support-policy/legacy)
and are no longer receiving security updates from upstream.

{{< note >}}

Downgrades of MongoDB aren't supported.
MongoDB updates its own data files to a new version automatically but can't downgrade them.
If you want to experiment with a later version without committing to it use a non-production environment.

{{< /note >}}

{{% deprecated-versions %}}

| **Grid** |
|----------------------------------|
|  {{< image-versions image="mongodb" status="deprecated" environment="grid" >}} |

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

{{< relationship "mongodb" >}}

## Usage example

### Enterprise edition example

{{% endpoint-description type="mongodb-enterprise" php=true noApp=true /%}}

### Legacy edition example

{{% endpoint-description type="mongodb" php=true /%}}

{{< codetabs >}}

---
title=Go
file=static/files/fetch/examples/golang/mongodb
highlight=go
---

<--->

---
title=Java
file=static/files/fetch/examples/java/mongodb
highlight=java
---

<--->

---
title=Node.js
file=static/files/fetch/examples/nodejs/mongodb
highlight=js
---

<--->

---
title=PHP
file=static/files/fetch/examples/php/mongodb
highlight=php
---

<--->

---
title=Python
file=static/files/fetch/examples/python/mongodb
highlight=python
---

{{< /codetabs >}}

## Access the service directly

You can access MongoDB from you app container via [SSH](../development/ssh/_index.md).
Get the `host` from your [relationship](#relationship).
Then run the following command:

```bash
mongo {{< variable "HOST" >}}
```

With the example value, that would be the following:

```bash
mongo mongodb.internal
```

## Exporting data

The most straightforward way to export data from a MongoDB database is to open an SSH tunnel to it
and export the data directly using MongoDB's tools.

First, open an SSH tunnel with the Platform.sh CLI:

```bash
platform tunnel:open
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

To upgrade to 3.6 from a version earlier than 3.4, you must successively upgrade major releases until you have upgraded to 3.4.
For example, if you are running a 3.0 image, you must upgrade first to 3.2 and then upgrade to 3.4 before you can upgrade to 3.6.

For more details on upgrading and how to handle potential application backward compatibility issues,
see the [MongoDB release notes](https://docs.mongodb.com/manual/release-notes).
