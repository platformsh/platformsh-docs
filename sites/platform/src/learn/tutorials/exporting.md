---
title: "Exporting data"
description: See how to export your code, files and service data.
---

As an {{% vendor/name %}} user, your code and data belong to you.
At any time, you can download your site's data for local development, to back up your data, or to change provider.

## Before you begin

You need:

- [Git](https://git-scm.com/downloads)
- An {{% vendor/company_name %}} account
- Code in your project
- Optional: the [{{% vendor/name %}} CLI](/administration/cli/_index.md)

## 1. Download your app's code

Your app's code is maintained through the Git version control system.

To download your entire app's code history:

{{< codetabs >}}

+++
title=Using the CLI
+++

1. List all your projects by running the following command:

   ```bash
   {{% vendor/cli %}} projects
   ```

2. Retrieve the project you want to back up by running the following command:

   ```bash
   {{% vendor/cli %}} get {{< variable "PROJECT_ID" >}}
   ```

<--->

+++
title=Using Git
+++

1. In the [Console]({{% vendor/urlraw "console" %}}), open your project and click **Code {{< icon chevron >}}**.
2. Click **Git**.
3. To copy the command, click **{{< icon copy >}} Copy**.
   The command is similar to the following:

   ```text
   git clone abcdefgh1234567@git.eu.{{< vendor/urlraw "host" >}}:abcdefgh1234567.git project-name
   ```

{{< /codetabs >}}

## 2. Download your files

Some files might not be stored in Git,
such as data your app writes [in mounts](/create-apps/image-properties/mounts.md).

You can download your files [using the CLI](/development/file-transfer.md#transfer-files-using-the-cli) or [using SSH](/development/file-transfer.md#transfer-files-using-an-ssh-client).

### Network Storage mounts

If your project uses a [Network Storage service](/add-services/network-storage.md)
(mounts with `source: service`), the data lives in a dedicated service container rather than in the app container itself.
The download process is the same as for local mounts — use the CLI or rsync over SSH — but you need to target the path
as it is mounted inside the app container.

For example, to download a `web/uploads` network mount using the CLI:

```bash {location="Terminal"}
{{% vendor/cli %}} mount:download --mount web/uploads --target ./local-uploads
```

## 3. Download data from services

The mechanism for downloading from each service varies.

For services designed to hold non-persistent data in memory only — such as [ephemeral Redis](/add-services/redis.md#ephemeral-redis),
[ephemeral Valkey](/add-services/valkey.md), [Memcached](/add-services/memcached.md),
or [Solr](/add-services/solr.md) —
it's generally not necessary to download data as it can be rebuilt from the primary data store.

For services designed to hold persistent data, see the instructions for each service below.

### Relational databases

- [MySQL / MariaDB](#mysql--mariadb)
- [PostgreSQL](#postgresql)

### Document & time-series databases

- [MongoDB](#mongodb)
- [InfluxDB](#influxdb)
- [ClickHouse](#clickhouse)

### Search engines

- [Elasticsearch](#elasticsearch)
- [OpenSearch](#opensearch)

### Key-value stores (persistent)

- [Redis (persistent)](#redis-persistent)
- [Valkey (persistent)](#valkey-persistent)

### Message brokers

- [RabbitMQ](#rabbitmq)
- [Kafka](#kafka)

### Vector databases

- [Qdrant](#qdrant)
- [Chroma](#chroma)

### MySQL / MariaDB

See [MySQL/MariaDB — Exporting data](/add-services/mysql.md#exporting-data).

### PostgreSQL

See [PostgreSQL — Exporting data](/add-services/postgresql.md#exporting-data).

### MongoDB

See [MongoDB — Exporting data](/add-services/mongodb.md#exporting-data).

### InfluxDB

See [InfluxDB — Export data](/add-services/influxdb.md#export-data).

### ClickHouse

ClickHouse data can be exported using the native `clickhouse-client` tool over an SSH tunnel.

1. Open an SSH tunnel to your ClickHouse service:

```bash {location="Terminal"}
{{% vendor/cli %}} tunnel:single --relationship <RELATIONSHIP_NAME>
```

By default this opens the tunnel on `127.0.0.1:30000`.

2. Export a table or the result of a query to a file:

```bash {location="Terminal"}
clickhouse-client \
  --host 127.0.0.1 \
  --port 9000 \
  --user <CLICKHOUSE_USERNAME> \
  --password <CLICKHOUSE_PASSWORD> \
  --database <CLICKHOUSE_PATH> \
  --query "SELECT * FROM <TABLE_NAME>" \
  --format CSVWithNames > table_export.csv
```

You can replace `CSVWithNames` with any [ClickHouse output format](https://clickhouse.com/docs/en/interfaces/formats)
such as `Parquet`, `JSONEachRow`, or `Native` depending on your needs.

3. To export the full schema of your database:

```bash {location="Terminal"}
clickhouse-client \
  --host 127.0.0.1 \
  --port 9000 \
  --user <CLICKHOUSE_USERNAME> \
  --password <CLICKHOUSE_PASSWORD> \
  --query "SHOW CREATE TABLE <TABLE_NAME>"
```

The credentials (`<CLICKHOUSE_USERNAME>`, `<CLICKHOUSE_PASSWORD>`, `<CLICKHOUSE_PATH>`) are available
in the service environment variables. Run `{{% vendor/cli %}} ssh -- env | grep CLICKHOUSE` to retrieve them.


### Elasticsearch

Elasticsearch data is stored in on-disk indexes. The recommended way to export it is
via the [Snapshot and Restore API](https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html)
over an SSH tunnel.

1. Open an SSH tunnel to your Elasticsearch service:

```bash {location="Terminal"}
{{% vendor/cli %}} tunnel:single --relationship <RELATIONSHIP_NAME>
```

2. Register a snapshot repository (a local filesystem path accessible inside the service):

```bash {location="Terminal"}
curl -X PUT "http://127.0.0.1:9200/_snapshot/my_backup" \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "fs",
    "settings": {
      "location": "/tmp/es-snapshots"
    }
  }'
```

3. Trigger a snapshot:

```bash {location="Terminal"}
curl -X PUT "http://127.0.0.1:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true"
```

4. Retrieve the snapshot files from the service container using the CLI:

```bash {location="Terminal"}
{{% vendor/cli %}} ssh -- tar -czf /tmp/es-snapshot.tar.gz /tmp/es-snapshots
{{% vendor/cli %}} scp remote:/tmp/es-snapshot.tar.gz ./es-snapshot.tar.gz
```

Alternatively, you can re-index all your data from the primary data source
(for example your application database) instead of using snapshots.

If authentication is enabled on your Elasticsearch service, add the `-u user:password` flag to the `curl` commands.


### OpenSearch

The export procedure for OpenSearch is identical to [Elasticsearch](#elasticsearch),
using the [Snapshot and Restore API](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/).

1. Open an SSH tunnel:

```bash {location="Terminal"}
{{% vendor/cli %}} tunnel:single --relationship <RELATIONSHIP_NAME>
```

2. Register a snapshot repository:

```bash {location="Terminal"}
curl -X PUT "http://127.0.0.1:9200/_snapshot/my_backup" \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "fs",
    "settings": {
      "location": "/tmp/os-snapshots"
    }
  }'
```

3. Trigger a snapshot:

```bash {location="Terminal"}
curl -X PUT "http://127.0.0.1:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true"
```

4. Download the snapshot from the container:

```bash {location="Terminal"}
{{% vendor/cli %}} ssh -- tar -czf /tmp/os-snapshot.tar.gz /tmp/os-snapshots
{{% vendor/cli %}} scp remote:/tmp/os-snapshot.tar.gz ./os-snapshot.tar.gz
```


### Redis (persistent)

This section applies only to **persistent** Redis services configured with `type: redis-persistent`.
Ephemeral Redis (`type: redis`) stores data only in memory; its data does not need to be exported.

The recommended approach is to use the `BGSAVE` command to write a point-in-time RDB snapshot to disk,
then download it.

1. Open an SSH tunnel:

```bash {location="Terminal"}
{{% vendor/cli %}} tunnel:single --relationship <RELATIONSHIP_NAME>
```

2. Trigger a background save and wait for it to complete:

```bash {location="Terminal"}
redis-cli -h 127.0.0.1 -p 30000 BGSAVE
# Poll until "Background saving terminated" appears:
redis-cli -h 127.0.0.1 -p 30000 LASTSAVE
```

3. Download the RDB dump file from the container:

```bash {location="Terminal"}
# Connect via SSH and locate the dump file
{{% vendor/cli %}} ssh -- find / -name "dump.rdb" 2>/dev/null

# Copy it locally
{{% vendor/cli %}} scp remote:/path/to/dump.rdb ./redis-dump.rdb
```

The `.rdb` file can be imported into any Redis or Valkey instance by placing it in the data directory
and restarting the service.


### Valkey (persistent)

This section applies only to **persistent** Valkey services configured with `type: valkey-persistent`.
Ephemeral Valkey (`type: valkey`) stores data only in memory and does not need to be exported.

The procedure is identical to [Redis (persistent)](#redis-persistent), using the same `BGSAVE` / RDB approach:

1. Open an SSH tunnel:

```bash {location="Terminal"}
{{% vendor/cli %}} tunnel:single --relationship <RELATIONSHIP_NAME>
```

2. Trigger a background save:

```bash {location="Terminal"}
redis-cli -h 127.0.0.1 -p 30000 BGSAVE
```

3. Download the `dump.rdb` file from the container as described in the [Redis section](#redis-persistent).

### RabbitMQ

RabbitMQ stores durable queues, exchanges, bindings, users, virtual hosts, and policies on disk.
You can export the full definitions (schema + messages metadata) using the RabbitMQ management API.

1. Open an SSH tunnel:

```bash {location="Terminal"}
{{% vendor/cli %}} tunnel:single --relationship <RELATIONSHIP_NAME>
```

2. Export definitions (topology: exchanges, queues, bindings, policies):

```bash {location="Terminal"}
curl -u guest:<RABBITMQ_PASSWORD> \
  http://127.0.0.1:15672/api/definitions \
  -o rabbitmq-definitions.json
```

The management API is available on port `15672`. The default username is `guest`.
Retrieve the password from the service environment variables:

```bash {location="Terminal"}
{{% vendor/cli %}} ssh -- env | grep RABBITMQ_PASSWORD
```

3. To export messages from a specific queue:

```bash {location="Terminal"}
curl -u guest:<RABBITMQ_PASSWORD> \
  -X POST http://127.0.0.1:15672/api/queues/%2F/<QUEUE_NAME>/get \
  -H "Content-Type: application/json" \
  -d '{"count": 10000, "ackmode": "ack_requeue_true", "encoding": "auto"}' \
  -o rabbitmq-messages.json
```

The `definitions.json` file can later be imported into any RabbitMQ instance via:

```bash {location="Terminal"}
curl -u guest:<PASSWORD> \
  -X POST http://<HOST>:15672/api/definitions \
  -H "Content-Type: application/json" \
  -d @rabbitmq-definitions.json
```

### Kafka

Kafka stores messages in on-disk topic partitions. You can export messages using the
`kafka-console-consumer` tool over an SSH session.

1. Open an SSH session to your app container (Kafka is not directly accessible via `tunnel:single`):

```bash {location="Terminal"}
{{% vendor/cli %}} ssh
```

2. From the app container, list available topics:

```bash {location="Terminal"}
kafka-topics.sh \
  --bootstrap-server $KAFKA_HOST:$KAFKA_PORT \
  --list
```

3. Export all messages from a topic to a file:

```bash {location="Terminal"}
kafka-console-consumer.sh \
  --bootstrap-server $KAFKA_HOST:$KAFKA_PORT \
  --topic <TOPIC_NAME> \
  --from-beginning \
  --max-messages <NUMBER> \
  --timeout-ms 5000 \
  > /tmp/kafka-export-<TOPIC_NAME>.txt
```

4. Download the exported file:

```bash {location="Terminal"}
# From your local machine
{{% vendor/cli %}} scp remote:/tmp/kafka-export-<TOPIC_NAME>.txt ./kafka-export-<TOPIC_NAME>.txt
```

The Kafka connection credentials (`KAFKA_HOST`, `KAFKA_PORT`) are available as
[service environment variables](/development/variables.md#service-environment-variables)
inside the app container.

Note that Kafka is designed as a streaming platform, not a primary data store.
In most architectures, the authoritative copy of your data exists elsewhere (for example in a database),
and Kafka topics can be replayed or re-populated from that source.


### Qdrant

Qdrant stores vector collections on disk inside the service container.
The recommended export method is the [Qdrant Snapshot API](https://qdrant.tech/documentation/concepts/snapshots/).

1. Open an SSH tunnel to your Qdrant service:

```bash {location="Terminal"}
{{% vendor/cli %}} tunnel:single --relationship <RELATIONSHIP_NAME>
```

By default the REST API is available on port `6333`.

2. Create a snapshot for a specific collection:

```bash {location="Terminal"}
curl -X POST "http://127.0.0.1:6333/collections/<COLLECTION_NAME>/snapshots"
```

The response includes the snapshot name (e.g. `<COLLECTION_NAME>-<TIMESTAMP>.snapshot`).

3. Download the snapshot:

```bash {location="Terminal"}
curl -o <COLLECTION_NAME>.snapshot \
  "http://127.0.0.1:6333/collections/<COLLECTION_NAME>/snapshots/<SNAPSHOT_NAME>"
```

4. To list all collections and snapshot all of them:

```bash {location="Terminal"}
# List collections
curl http://127.0.0.1:6333/collections

# Loop and snapshot each one
for COLLECTION in $(curl -s http://127.0.0.1:6333/collections | jq -r '.result.collections[].name'); do
  curl -X POST "http://127.0.0.1:6333/collections/${COLLECTION}/snapshots"
done
```

The `.snapshot` files can be restored into any Qdrant instance using the
[snapshot recovery endpoint](https://qdrant.tech/documentation/concepts/snapshots/#recover-via-api).


### Chroma

Chroma stores its vector database on disk as SQLite files within the service container's mount directory.
The data is directly accessible via the mount path and can be downloaded using the CLI or rsync.

1. Identify the mount path where Chroma stores its data (typically defined in your `.upsun/config.yaml`
as a `source: service` mount pointing to the Chroma service).

2. Download the data directory using the CLI:

```bash {location="Terminal"}
{{% vendor/cli %}} mount:download --mount <CHROMA_MOUNT_PATH> --target ./chroma-backup
```

3. The downloaded directory contains the SQLite database files (`.db`) used by Chroma.
These can be restored by placing them back in the mount path of a new Chroma service.

## 4. Get environment variables

Environment variables can contain critical information such as tokens or additional configuration options for your app.

Environment variables can have different prefixes:

- Variables beginning with `env:` are exposed [as Unix environment variables](/development/variables/_index.md#top-level-environment-variables).
- Variables beginning with `php:` are interpreted [as `php.ini` directives](/development/variables/_index.md#php-specific-variables).

All other variables are [part of `$PLATFORM_VARIABLES`](/development/variables/use-variables.md#use-provided-variables).

To back up your environment variables:

{{< codetabs >}}

+++
title=Using the CLI
+++

1. Get the variable's values by running the following command:

   ```bash
   {{% vendor/cli %}} ssh -- 'echo $PLATFORM_VARIABLES | base64 -d | jq'
   ```

   Note that you can also get all the environment variable values by running the following command:

   ```bash
   {{% vendor/cli %}} ssh -- env
   ```

2. Store the data somewhere secure on your computer.

<--->

+++
title=In the Console
+++

1. In the [Console]({{% vendor/urlraw "console" %}}), open your project and click **{{< icon settings >}}**.
2. Click **Project Settings {{< icon chevron >}}**.
3. Click **Variables** and access your variable's values and settings.
4. Store the data somewhere secure on your computer.

Note that in the Console, you can't access the value of variables that have been [marked as sensitive](/development/variables/set-variables.md#variable-options).
Use the CLI to retrieve these values.

{{< /codetabs >}}

## What's next

- Migrate data from elsewhere [into {{% vendor/name %}}](/learn/tutorials/migrating/_index.md).
- Migrate to [another region](/projects/region-migration.md).
- To use data from an environment locally, export your data and set up your [local development environment](/development/local/_index.md).
