---
title: "Environment variables"
weight: -120
description: |
    Learn about the environment variables added by the Symfony integration.
---

By default, {{% vendor/name %}} exposes some [environment variables](/development/variables/use-variables#use-provided-variables).
If you're using the [Symfony integration](./integration),
more [infrastructure environment variables](#symfony-environment-variables) related to Symfony are defined.

As Symfony relies heavily on environment variables to configure application services (such as the database or the mailer DSN),
the Symfony integration automatically defines [environment variables for all the services](#service-environment-variables) connected to your app.

{{< note title="Tip" >}}

The code that defines these additional environment variables is part of the open-source [Symfony CLI tool](https://symfony.com/download).
Check the code for [infrastructure](https://github.com/symfony-cli/symfony-cli/blob/main/envs/remote.go#L139)
and [service](https://github.com/symfony-cli/symfony-cli/blob/main/envs/envs.go#L110) environment variables on GitHub.

{{< /note >}}

## Symfony environment variables

{{% vendor/name %}} exposes [environment variables](/development/variables/use-variables#use-provided-variables)
about the app and its infrastructure.

The Symfony integration exposes more environment variables:

- `APP_ENV` is set to `prod` by default.
  You can manually override this value for a preview environment
  by setting the `SYMFONY_ENV` environment variable to `dev`, and remove it when done.

- `APP_DEBUG` is set to `0` by default.
  You can manually override this value for a preview environment
  by setting the `SYMFONY_DEBUG` environment variable to `1`, and remove it when done.

- `APP_SECRET` is set to the value of `PLATFORM_PROJECT_ENTROPY`, which is a random and unique value for all {{% vendor/name %}} projects.
  It overrides the value configured in the `.env` file of your app.

- `MAILFROM` is set to a random value.
  This value is used as a `From` header when using [croncape](./crons#use-croncape).

- `SYMFONY_IS_WORKER` is set to `1` when the container is running in the context of a worker
  (instead of the main application container).

- `SYMFONY_CACHE_DIR` (only available during the build hook execution):
  The absolute path to a subdirectory of your build cache directory.

  Note that the build cache directory is persisted between builds but **isn't** deployed.
  It’s a good place to store build artifacts, such as downloaded files that can be reused between builds.

  {{< note title="Tip">}}

  This directory is shared by **all** builds on **all** branches.
  Make sure your [build hook](./integration.md#hooks) accounts for that.

  {{< /note >}}

  If you need to clear the build cache directory, run the `symfony cloud:project:clear-build-cache` command.

- `SYMFONY_PROJECT_DEFAULT_ROUTE_URL` (only defined at **runtime**): The default endpoint serving your project.
  Use this variable to avoid hard-coding domains that can be used to reach preview environments.
  Parts of the URL are also exposed as their own variables using the following syntax:
  `SYMFONY_PROJECT_DEFAULT_ROUTE_` followed by the name of the part (`SCHEME`, `DOMAIN`, `PORT`, and `PATH`).

  Guessing the default endpoint can prove difficult for multi-routes or multi-app projects.
  In such cases, the following preference order is used:

  1. Project-wide route defined only by `{default}` or `{all}` (no path)
  2. Project-wide route defined by `www.{default}` or `www.{all}` (no path)
  3. Route for the **current application** including `{default}` or `{all}` (might include a path)
  4. Route for the **current application** including `www.{default}` or `www.{all}` (might include a path)
  5. First route for the current application
  6. First route for the whole project

  When several routes match a rule, the first one wins, the user order is kept. There's no preference regarding protocols.

  {{< note title="Tip">}}

   If you have a multi-app project containing several publicly reachable apps,
   you might need to determine the current application endpoint (for webhooks for example)
   and the project endpoint (to send emails for example).

   In this case, you can use an additional `SYMFONY_APPLICATION_DEFAULT_ROUTE_*` set of environment variables.
   The same rules are applied to determine their value, but only routes matching the current application are evaluated.

  {{< /note >}}

## Service environment variables

When using the [Symfony integration](./integration), information about services
are exposed via environment variables.

To list all of the exposed environment variables, run the following command:

```bash
symfony ssh -- symfony var:export --multiline
```

Each exposed environment variable is prefixed by the relationship name.
For example, if you have the following [relationships](/create-apps/app-reference/single-runtime-image#relationships) in your configuration:

```yaml
relationships:
  database:
    service: securitydb
    endpoint: postgresql
```

The environment variables for the database service is prefixed by `DATABASE_`
which is the upper-cased version of the key defined in the relationship.
For example, you could have a `DATABASE_URL` environment variable.

Most environment variable names are derived from the relationship and service names.
But some are defined based on Symfony conventions, such as [`MAILER_DSN`](#emails).

{{< note theme="warning" >}}

Environment variables aren't exposed when the build hook script is running
as services aren't available during the [build process](/learn/overview/build-deploy.md#the-build).

{{< /note >}}

### Emails

The configuration is exposed via the following environment variables:

- `MAILER_ENABLED`: 1 if outgoing emails are enabled, 0 otherwise
- `MAILER_DSN`/`MAILER_URL`: The Symfony-compatible mailer URL
- `MAILER_HOST`: The SMTP server host
- `MAILER_PORT`: The SMTP server port
- `MAILER_TRANSPORT`: The SMTP transport mode (`smtp`)
- `MAILER_AUTH_MODE`: The SMTP auth mode (`plain`)
- `MAILER_USER`: The SMTP server user
- `MAILER_PASSWORD`: The SMTP server password

Symfony Mailer automatically uses the value of `MAILER_DSN`.

### HTTP

If your project has multiple apps,
the configuration is exposed via the following environment variables
(where `SOME_SERVICE` is the upper-cased version of the key defined in the relationship):

- `SOME_SERVICE_URL`: The full URL of the service
- `SOME_SERVICE_IP`: The HTTP service IP
- `SOME_SERVICE_PORT`: The HTTP service port
- `SOME_SERVICE_SCHEME`: The HTTP service scheme
- `SOME_SERVICE_HOST`: The HTTP service host

### MySQL/MariaDB

The [MySQL/MariaDB](/add-services/mysql) configuration is exposed via the following environment variables
(where `DATABASE` is the upper-cased version of the key defined in the relationship above):

- `DATABASE_URL`: The database URL (in PHP or Go format depending on your app)
- `DATABASE_SERVER`: The database server
- `DATABASE_DRIVER`: The database driver
- `DATABASE_VERSION`: The database version
- `DATABASE_HOST`: The database host
- `DATABASE_PORT`: The database port
- `DATABASE_NAME`: The database name
- `DATABASE_DATABASE`: Alias for `DATABASE_NAME`
- `DATABASE_USERNAME`: The database username
- `DATABASE_PASSWORD`: The database password

{{< note title="Tip">}}

The database version and a default charset are included in the database URL.
To override them, use the `DATABASE_VERSION` and `DATABASE_CHARSET` environment variables respectively.

{{< /note >}}

### PostgreSQL

The [PostgreSQL](/add-services/postgresql) configuration is exposed via the following environment variables
(where `DATABASE` is the upper-cased version of the key defined in the relationship):

- `DATABASE_URL`: The database URL (in PHP or Go format depending on your app)
- `DATABASE_SERVER`: The database server
- `DATABASE_DRIVER`: The database driver
- `DATABASE_VERSION`: The database version
- `DATABASE_HOST`: The database host
- `DATABASE_PORT`: The database port
- `DATABASE_NAME`: The database name
- `DATABASE_DATABASE`: Alias for `DATABASE_NAME`
- `DATABASE_USERNAME`: The database username
- `DATABASE_PASSWORD`: The database password

{{< note title="Tip">}}

The database version and a default charset are included in the database URL.
To override them, use the `DATABASE_VERSION` and `DATABASE_CHARSET` environment variables respectively.

{{< /note >}}

### Redis

The [Redis](/add-services/redis) configuration is exposed via the following environment variables
(where `REDIS` is the upper-cased version of the key defined in the relationship):

- `REDIS_URL`: The Redis URL
- `REDIS_HOST`: The Redis host
- `REDIS_PORT`: The Redis port
- `REDIS_SCHEME`: The Redis scheme

### Memcached

The [Memcached](/add-services/memcached) configuration is exposed via the following environment variables
(where `CACHE` is the upper-cased version of the key defined in the relationship):

- `CACHE_HOST`
- `CACHE_PORT`
- `CACHE_IP`

### Elasticsearch

The [Elasticsearch](/add-services/elasticsearch) configuration is exposed via the following environment variables
(where `ELASTICSEARCH` is the upper-cased version of the key defined in the relationship):

- `ELASTICSEARCH_URL`: The full URL of the Elasticsearch service
- `ELASTICSEARCH_HOST`: The Elasticsearch host
- `ELASTICSEARCH_PORT`: The Elasticsearch port
- `ELASTICSEARCH_SCHEME`: The Elasticsearch protocol scheme (`http` or `https`)

### Solr

The [Apache Solr](/add-services/solr) configuration is exposed via the following environment variables
(where `SOLR` is the upper-cased version of the key defined in the relationship):

- `SOLR_HOST`: The Solr host
- `SOLR_PORT`: The Solr port
- `SOLR_NAME`: The Solr name
- `SOLR_DATABASE`: An alias for `SOLR_NAME`

### RabbitMQ

The [RabbitMQ](/add-services/rabbitmq) configuration is exposed via the following environment variables
(where `RABBITMQ` is the upper-cased version of the key defined in the relationship):

- `RABBITMQ_URL`: The RabbitMQ standardized URL
- `RABBITMQ_SERVER`: The RabbitMQ server
- `RABBITMQ_HOST`: The RabbitMQ host
- `RABBITMQ_PORT`: The RabbitMQ port
- `RABBITMQ_SCHEME`: The RabbitMQ scheme
- `RABBITMQ_USER`: The RabbitMQ username
- `RABBITMQ_USERNAME`: The RabbitMQ username
- `RABBITMQ_PASSWORD`: The RabbitMQ password

### MongoDB

The [MongoDB](/add-services/mongodb) configuration is exposed via the following environment variables
(where `MONGODB` is the upper-cased version of the key defined in the relationship):

- `MONGODB_SERVER`
- `MONGODB_HOST`
- `MONGODB_PORT`
- `MONGODB_SCHEME`
- `MONGODB_NAME`
- `MONGODB_DATABASE`
- `MONGODB_USER`
- `MONGODB_USERNAME`
- `MONGODB_PASSWORD`

### InfluxDB

The [InfluxDB](/add-services/influxdb) configuration is exposed via the following environment variables
(where `TIMEDB` is the upper-cased version of the key defined in the relationship):

- `TIMEDB_SCHEME`
- `TIMEDB_HOST`
- `TIMEDB_PORT`
- `TIMEDB_IP`

### Kafka

The [Apache Kafka](/add-services/kafka) configuration is exposed via the following environment variables
(where `KAFKA` is the upper-cased version of the key defined in the relationship):

- `KAFKA_URL`
- `KAFKA_SCHEME`
- `KAFKA_HOST`
- `KAFKA_PORT`
- `KAFKA_IP`

{{< guide-buttons previous="Back" next="Workers" >}}
