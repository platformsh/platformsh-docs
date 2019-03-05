# MongoDB (Database service)

MongoDB is a cross-platform, document-oriented database.

For more information on using MongoDB, see [MongoDB's own documentation](https://docs.mongodb.com/manual/).

## Supported versions

* 3.0
* 3.2
* 3.4
* 3.6

> **note**
>
> Downgrades of MongoDB are not supported. MongoDB will update its own datafiles to a new version automatically but cannot downgrade them. If you want to experiment with a later version without committing to it use a non-master environment.

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/mongodb", language="json" %}{% endcodesnippet %}

## Usage example

In your `.platform/services.yaml`:

```yaml
mydatabase:
    type: mongodb:3.6
    disk: 1024
```

The minimum disk size for MongoDB is `512` (MB).

In your `.platform.app.yaml`:

```yaml
relationships:
    database: "mydatabase:mongodb"
```


For PHP, in your `.platform.app.yaml` add:

```yaml
runtime:
    extensions:
        - mongodb
```

(Before PHP 7, use `mongo` instead.)

You can then use the service in a configuration file of your application with something like:

{% codetabs name="PHP", type="php", url="https://examples.docs.platform.sh/php/mongodb" -%}

{%- language name="Node.js", type="js", url="https://examples.docs.platform.sh/nodejs/mongodb" -%}

{%- endcodetabs %}

## Exporting data

The most straightforward way to export data from a MongoDB database is to open an SSH tunnel to it and simply export the data directly using MongoDB's tools.  

First, open an SSH tunnel with the Platform.sh CLI:

```bash
platform tunnel:open
```

That will open an SSH tunnel to all services on your current environment, and produce output something like the following:

```text
SSH tunnel opened on port 30000 to relationship: mongodb
SSH tunnel opened on port 30001 to relationship: redis
```

The port may vary in your case.  You will also need to obtain the user, password, and database name from the relationships array, as above.

Then, simply connect to that port locally using `mongodump` (or your favorite MongoDB tools) to export all data in that server:

```bash
mongodump --port 30000 -u main -p main --authenticationDatabase main --db main
```

(If necessary, vary the `-u`, `-p`, `--authenticationDatabase` and `--db` flags.)

As with any other shell command it can be piped to another command to compress the output or redirect it to a specific file.

For further references please see the [official mongodump documentation](https://docs.mongodb.com/manual/reference/program/mongodump/#bin.mongodump).

## Upgrading

To upgrade to 3.6 from a version earlier than 3.4, you must successively upgrade major releases until you have upgraded to 3.4. For example, if you are running a 3.0 image, you must upgrade first to 3.2 and then upgrade to 3.4 before you can upgrade to 3.6.

For more details on upgrading and how to handle potential application backward compatibility issues, please see [Release Notes for MongoDB](https://docs.mongodb.com/manual/release-notes).
