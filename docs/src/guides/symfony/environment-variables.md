---
title: "Environment Variables"
sidebarTitle: "Environment Variables"
weight: -105
description: |
    Environment variables added by the Symfony integration.
---

By default, Platform.sh exposes some [environment
variables](/development/variables/use-variables#use-platformsh-provided-variables).

If you are using the [Symfony integration](./integration), more [infrastructure
environment variables](#symfony-environment-variables) related to Symfony are
defined.

As Symfony relies heavily on environment variables to configure application
services (like the database or the mailer DSN), the Symfony integration
automatically defines [environment variables for all
services](#service-environment-variables) connected to the application.

{{< note theme="tip" >}}

The code that defines these additional environment variables is part of the
Open-Source [Symfony CLI tool](https://symfony.com/download). Check the code for
[infrastructure](https://github.com/symfony-cli/symfony-cli/blob/main/envs/remote.go#L139)
and
[service](https://github.com/symfony-cli/symfony-cli/blob/main/envs/envs.go#L110)
environment variables on Github.

{{< /note >}}

## Symfony Environment Variables

Platform.sh exposes [environment
variables](/development/variables/use-variables#use-platformsh-provided-variables) about the application and its infrastructure.

The Symfony integration exposes some more:

* `APP_ENV` is set to `prod` by default. You can manually override this value
  for a development environment by setting the `SYMFONY_ENV` environment
  variable to `dev`, and remove it when done.

* `APP_DEBUG` us set to `0` by default. You can manually override this value
  for a development environment by setting the `SYMFONY_DEBUG` environment
  variable to `1`, and remove it when done.

* `APP_SECRET` is set to the value of `PLATFORM_PROJECT_ENTROPY` which is a
  random and unique value for all Platform.sh projects; it overrides the one
  configured in the application `.env` file.

* `MAILFROM` is set to a random value, which is used as a From header when
  using [croncape](./integration#croncape).

* `SYMFONY_IS_WORKER` is set to `1` when the container is running in the
  context of a worker (instead of the main application container).

* `SYMFONY_CACHE_DIR` (only available during the build hook execution): The
  absolute path to a subdirectory of our build cache directory.

  The build cache directory is persisted between builds, but is **not** deployed. It’s a good place to store build artifacts, such as downloaded files, that can be reused between builds.

  {{< note title="Tip">}}
  This directory is shared by **all** builds on **all** branches, make sure your build hook accounts for that.
  {{< /note >}}

  {{< note >}}
  If you need to clear the build cache directory, use the `symfony cloud:project:clear-build-cache` command.
  {{< /note >}}

* `SYMFONY_PROJECT_DEFAULT_ROUTE_URL` (only defined at **runtime**): The default endpoint serving your project.
  It can be used to avoid hard-coding domains that can be used to reach non-production environments.
  Parts of the URL are also exposed as their own variables whose name starts with `SYMFONY_PROJECT_DEFAULT_ROUTE_` followed by the name of the part (`SCHEME`, `DOMAIN`, `PORT`, and `PATH`).

  Guessing the default endpoint is usually straightforward but can become complicated for multi-routes or multi-applications projects. For these cases, the following   preference order is used:

  1. project wide route defined only by `{default}` or `{all}` (no path)
  2. project wide route defined by `www.{default}` or `www.{all}` (no path)
  3. route for the **current application** including `{default}` or `{all}` (might include a path)
  4. route for the **current application** including `www.{default}` or `www.{all}` (might include a path)
  5. first route for the current application
  6. first route for the whole project

  When several routes match a rule, the first one wins, the user order is kept. There's no preference regarding protocols.

  {{< note title="Tip">}}

  For multi-applications projects where several applications are publicly reachable, but one needs to determine the current application endpoint (for webhooks for example) and the project endpoint (to send emails for instance), an additional `SYMFONY_APPLICATION_DEFAULT_ROUTE_*` environment variables set is available. The same rules are applied to determine their value but only routes matching the current application are evaluated.

  {{< /note >}}

## Service Environment Variables


When using the [Symfony integration](./integration), information about services
are exposed via environment variables.

List all exposed environment variables with the following command:

```bash
symfony ssh -- symfony var:export --multiline
```

Each exposed environment variable is prefixed by the relationship name. For
instance, given the following relationships:

```yaml
relationships:
    database: "securitydb:postgresql"
```

The environment variables for the database service will be prefixed by
`DATABASE_`, the upper-cased version of the key defined in the relationship;
like `DATABASE_URL`.

While most environment variable names are derived from the relationship and
service names, some are defined based on Symfony conventions like `MAILER_DSN`.

{{< note theme="warning" >}}

Be aware that service environment variables are not exposed when running
the build hook script as services are not available during the build hook.

{{< /note >}}

The following sections lists all exposed environment variables that are automatically defined for each service:

* [Emails](#emails)
* [HTTP](#http)
* [PostgreSQL](#postgesql)
* [MySQL/MariaDB](#mysql-mariadb)
* [MongoDB](#mongodb)
* [Redis](#redis)
* [RabbitMQ](#rabbitmq)
* [Elasticsearch](#elasticsearch)
* [Kafka](#kafka)
* [InfluxDB](#influxdb)
* [Memcached](#memcached)
* [Solr](#solr)

### Emails

The configuration is exposed via the following environment variables:

* `MAILER_ENABLED`: 1 if outgoing emails are enabled, 0 otherwise
* `MAILER_DSN`/`MAILER_URL`: The Symfony-compatible mailer URL
* `MAILER_HOST`: The SMTP server host
* `MAILER_PORT`: The SMTP server port
* `MAILER_TRANSPORT`: The SMTP transport mode (`smtp`)
* `MAILER_AUTH_MODE`: The SMTP auth mode (`plain`)
* `MAILER_USER`: The SMTP server user
* `MAILER_PASSWORD`: The SMTP server password

Symfony Mailer uses the value of `MAILER_DSN` automatically.

### HTTP

If your project has multiple applications, the configuration is exposed via the following environment variables (where `SOME_SERVICE` is the upper-cased version of the key defined in the relationship):

* `SOME_SERVICE_URL`: The full URL of the service
* `SOME_SERVICE_IP`: The HTTP service IP
* `SOME_SERVICE_PORT`: The HTTP service port
* `SOME_SERVICE_SCHEME`: The HTTP service scheme
* `SOME_SERVICE_HOST`: The HTTP service host

### MySQL/MariaDB

[MySQL/MariaDB](/configuration/services/mysql.html) configuration is exposed via the following environment variables (where `DATABASE` is the upper-cased version of the key defined in the relationship above):

* `DATABASE_URL`: The database URL (in the PHP or Go format depending on your application)
* `DATABASE_SERVER`: The database server
* `DATABASE_DRIVER`: The database driver
* `DATABASE_VERSION`: The database version
* `DATABASE_HOST`: The database host
* `DATABASE_PORT`: The database port
* `DATABASE_NAME`: The database name
* `DATABASE_DATABASE`: Alias for `DATABASE_NAME`
* `DATABASE_USERNAME`: The database username
* `DATABASE_PASSWORD`: The database password

{{< note title="Tip">}}
The database version and a default charset is included in the database URL. Override them using the `DATABASE_VERSION` and `DATABASE_CHARSET` environment variables respectively.
{{< /note >}}

### PostgreSQL

[PostgreSQL](/configuration/services/postgresql.html) configuration is exposed via the following environment variables (where `DATABASE` is the upper-cased version of the key defined in the relationship):

* `DATABASE_URL`: The database URL (in the PHP or Go format depending on your application)
* `DATABASE_SERVER`: The database server
* `DATABASE_DRIVER`: The database driver
* `DATABASE_VERSION`: The database version
* `DATABASE_HOST`: The database host
* `DATABASE_PORT`: The database port
* `DATABASE_NAME`: The database name
* `DATABASE_DATABASE`: Alias for `DATABASE_NAME`
* `DATABASE_USERNAME`: The database username
* `DATABASE_PASSWORD`: The database password

{{< note title="Tip">}}
The database version and a default charset is included in the database URL. Override them using the `DATABASE_VERSION` and `DATABASE_CHARSET` environment variables respectively.
{{< /note >}}

### Redis

[Redis](/configuration/services/redis.html) configuration is exposed via the following environment variables (where `REDIS` is the upper-cased version of the key defined in the relationship):

* `REDIS_URL`: The Redis URL
* `REDIS_HOST`: The Redis host
* `REDIS_PORT`: The Redis port
* `REDIS_SCHEME`: The Redis scheme

### Memcached

[Memcached](/configuration/services/memcached.html) configuration is exposed via the following environment variables (where `CACHE` is the upper-cased version of the key defined in the relationship):

* `CACHE_HOST`
* `CACHE_PORT`
* `CACHE_IP`

### Elasticsearch

[Elasticsearch](/configuration/services/elasticsearch.html) configuration is exposed via the following environment variables (where `ELASTICSEARCH` is the upper-cased version of the key defined in the relationship):

* `ELASTICSEARCH_URL`: The full URL of the Elasticsearch service
* `ELASTICSEARCH_HOST`: The Elasticsearch host
* `ELASTICSEARCH_PORT`: The Elasticsearch port
* `ELASTICSEARCH_SCHEME`: The Elasticsearch protocol scheme (`http` or `https`)

### Solr

[Apache Solr](/configuration/services/solr.html) configuration is exposed via the following environment variables (where `SOLR` is the upper-cased version of the key defined in the relationship):

* `SOLR_HOST`: The Solr host
* `SOLR_PORT`: The Solr port
* `SOLR_NAME`: The Solr name
* `SOLR_DATABASE`: An alias for `SOLR_NAME`

### RabbitMQ

[RabbitMQ](/configuration/services/rabbitmq.html) configuration is exposed via the following environment variables (where `RABBITMQ` is the upper-cased version of the key defined in the relationship):

* `RABBITMQ_URL`: The RabbitMQ standardized URL
* `RABBITMQ_SERVER`: The RabbitMQ server
* `RABBITMQ_HOST`: The RabbitMQ host
* `RABBITMQ_PORT`: The RabbitMQ port
* `RABBITMQ_SCHEME`: The RabbitMQ scheme
* `RABBITMQ_USER`: The RabbitMQ username
* `RABBITMQ_USERNAME`: The RabbitMQ username
* `RABBITMQ_PASSWORD`: The RabbitMQ password

### MongoDB

[MongoDB](/configuration/services/mongodb.html) configuration is exposed via the following environment variables (where `MONGODB` is the upper-cased version of the key defined in the relationship):

* `MONGODB_SERVER`
* `MONGODB_HOST`
* `MONGODB_PORT`
* `MONGODB_SCHEME`
* `MONGODB_NAME`
* `MONGODB_DATABASE`
* `MONGODB_USER`
* `MONGODB_USERNAME`
* `MONGODB_PASSWORD`

### InfluxDB

[InfluxDB](/configuration/services/influxdb.html) configuration is exposed via the following environment variables (where `TIMEDB` is the upper-cased version of the key defined in the relationship):

* `TIMEDB_SCHEME`
* `TIMEDB_HOST`
* `TIMEDB_PORT`
* `TIMEDB_IP`

### Kafka

[Apache Kafka](/configuration/services/kafka.html) configuration is exposed via the following environment variables (where `KAFKA` is the upper-cased version of the key defined in the relationship):

* `KAFKA_URL`
* `KAFKA_SCHEME`
* `KAFKA_HOST`
* `KAFKA_PORT`
* `KAFKA_IP`
