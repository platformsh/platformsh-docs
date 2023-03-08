---
title: "Environment Variables"
sidebarTitle: "Environment Variables"
weight: -105
description: |
    Environment variables added by Symfony configurator.
---

By default, Platform.sh exposes information to your application via [environment variables](/development/variables), including database credentials, the SMTP address, and more.

## Platform.sh Environment Variables

Platform.sh exposes [environment variables](/development/variables) about the application and infrastructure.
In addition, Symfony projects exposes some more:

* ``SYMFONY_CACHE_DIR`` (only available during the build hook execution): The absolute path to a subdirectory of our build cache directory.

  The build cache directory is persisted between builds, but is **not** deployed. It’s a good place to store build artifacts, such as downloaded files, that can be reused between builds.

  {{< note title="Tip">}}
  This directory is shared by **all** builds on **all** branches, make sure your build hook accounts for that.
  {{< /note >}}

  {{< note >}}
  If you need to clear the build cache directory, use the ``symfony cloud:project:clear-build-cache`` command.
  {{< /note >}}

* ``SYMFONY_PROJECT_DEFAULT_ROUTE_URL`` (only defined at **runtime**): The default endpoint serving your project.
  It can be used to avoid hard-coding domains that can be used to reach non-production environments.
  Parts of the URL are also exposed as their own variables whose name starts with ``SYMFONY_PROJECT_DEFAULT_ROUTE_`` followed by the name of the part (``SCHEME``, ``DOMAIN``, ``PORT``, and ``PATH``).

  Guessing the default endpoint is usually straightforward but can become complicated for multi-routes or multi-applications projects. For these cases, the following   preference order is used:

  1. project wide route defined only by ``{default}`` or ``{all}`` (no path)
  1. project wide route defined by ``www.{default}`` or ``www.{all}`` (no path)
  1. route for the **current application** including ``{default}`` or ``{all}`` (might include a path)
  1. route for the **current application** including ``www.{default}`` or ``www.{all}`` (might include a path)
  1. first route for the current application
  1. first route for the whole project

  When several routes match a rule, the first one wins, the user order is kept. There's no preference regarding protocols.

  {{< note title="Tip">}}
  For multi-applications projects where several applications are publicly reachable, but one needs to determine the current application endpoint (for webhooks for example) and the project endpoint (to send emails for instance), an additional ``SYMFONY_APPLICATION_DEFAULT_ROUTE_*`` environment variables set is available. The same rules are applied to determine their value but only routes matching the current application are evaluated.
  {{< /note >}}

For Symfony projects, information about services are also exposed via environment variables (see below to learn more about the specifics for each service type). List all available environment variables with the following command:

```bash
symfony ssh -- symfony var:export --multiline
```

The following sections lists all exposed environment variables that are automatically defined for each service. Each environment variable is prefixed by the relationship name. For instance, given the following relationships:

```yaml
relationships:
    database: "securitydb:postgresql"
```

Environment variables for the database will be prefixed by ``DATABASE_``, the upper-cased version of the key defined in the relationship.

## Emails

The configuration is exposed via the following environment variables:

* ``MAILER_ENABLED``: 1 if outgoing emails are enabled, 0 otherwise
* ``MAILER_DSN``/``MAILER_URL``: The Symfony-compatible mailer URL
* ``MAILER_HOST``: The SMTP server host
* ``MAILER_PORT``: The SMTP server port
* ``MAILER_TRANSPORT``: The SMTP transport mode (``smtp``)
* ``MAILER_AUTH_MODE``: The SMTP auth mode (``plain``)
* ``MAILER_USER``: The SMTP server user
* ``MAILER_PASSWORD``: The SMTP server password

Symfony Mailer uses the value of ``MAILER_DSN`` automatically.

## HTTP

If your project has multiple applications, the configuration is exposed via the following environment variables (where ``SOME_SERVICE`` is the upper-cased version of the key defined in the relationship):

* ``SOME_SERVICE_URL``: The full URL of the service
* ``SOME_SERVICE_IP``: The HTTP service IP
* ``SOME_SERVICE_PORT``: The HTTP service port
* ``SOME_SERVICE_SCHEME``: The HTTP service scheme
* ``SOME_SERVICE_HOST``: The HTTP service host

## MySQL/MariaDB

[MySQL/MariaDB](/configuration/services/mysql.html) configuration is exposed via the following environment variables (where ``DATABASE`` is the upper-cased version of the key defined in the relationship above):

* ``DATABASE_URL``: The database URL (in the PHP or Go format depending on your application)
* ``DATABASE_SERVER``: The database server
* ``DATABASE_DRIVER``: The database driver
* ``DATABASE_VERSION``: The database version
* ``DATABASE_HOST``: The database host
* ``DATABASE_PORT``: The database port
* ``DATABASE_NAME``: The database name
* ``DATABASE_DATABASE``: Alias for ``DATABASE_NAME``
* ``DATABASE_USERNAME``: The database username
* ``DATABASE_PASSWORD``: The database password

{{< note title="Tip">}}
The database version and a default charset is included in the database URL. Override them using the ``DATABASE_VERSION`` and ``DATABASE_CHARSET`` environment variables respectively.
{{< /note >}}
## PostgreSQL

[PostgreSQL](/configuration/services/postgresql.html) configuration is exposed via the following environment variables (where ``DATABASE`` is the upper-cased version of the key defined in the relationship):

* ``DATABASE_URL``: The database URL (in the PHP or Go format depending on your application)
* ``DATABASE_SERVER``: The database server
* ``DATABASE_DRIVER``: The database driver
* ``DATABASE_VERSION``: The database version
* ``DATABASE_HOST``: The database host
* ``DATABASE_PORT``: The database port
* ``DATABASE_NAME``: The database name
* ``DATABASE_DATABASE``: Alias for ``DATABASE_NAME``
* ``DATABASE_USERNAME``: The database username
* ``DATABASE_PASSWORD``: The database password

{{< note title="Tip">}}
The database version and a default charset is included in the database URL. Override them using the ``DATABASE_VERSION`` and ``DATABASE_CHARSET`` environment variables respectively.
{{< /note >}}

## Redis

[Redis](/configuration/services/redis.html) configuration is exposed via the following environment variables (where ``REDIS`` is the upper-cased version of the key defined in the relationship):

* ``REDIS_URL``: The Redis URL
* ``REDIS_HOST``: The Redis host
* ``REDIS_PORT``: The Redis port
* ``REDIS_SCHEME``: The Redis scheme

## Memcached

[Memcached](/configuration/services/memcached.html) configuration is exposed via the following environment variables (where ``CACHE`` is the upper-cased version of the key defined in the relationship):

* ``CACHE_HOST``
* ``CACHE_PORT``
* ``CACHE_IP``

## Elasticsearch

[Elasticsearch](/configuration/services/elasticsearch.html) configuration is exposed via the following environment variables (where ``ELASTICSEARCH`` is the upper-cased version of the key defined in the relationship):

* ``ELASTICSEARCH_URL``: The full URL of the Elasticsearch service
* ``ELASTICSEARCH_HOST``: The Elasticsearch host
* ``ELASTICSEARCH_PORT``: The Elasticsearch port
* ``ELASTICSEARCH_SCHEME``: The Elasticsearch protocol scheme (``http`` or ``https``)

## Solr

[Apache Solr](/configuration/services/solr.html) configuration is exposed via the following environment variables (where ``SOLR`` is the upper-cased version of the key defined in the relationship):

* ``SOLR_HOST``: The Solr host
* ``SOLR_PORT``: The Solr port
* ``SOLR_NAME``: The Solr name
* ``SOLR_DATABASE``: An alias for ``SOLR_NAME``

## RabbitMQ

[RabbitMQ](/configuration/services/rabbitmq.html) configuration is exposed via the following environment variables (where ``RABBITMQ`` is the upper-cased version of the key defined in the relationship):

* ``RABBITMQ_URL``: The RabbitMQ standardized URL
* ``RABBITMQ_SERVER``: The RabbitMQ server
* ``RABBITMQ_HOST``: The RabbitMQ host
* ``RABBITMQ_PORT``: The RabbitMQ port
* ``RABBITMQ_SCHEME``: The RabbitMQ scheme
* ``RABBITMQ_USER``: The RabbitMQ username
* ``RABBITMQ_USERNAME``: The RabbitMQ username
* ``RABBITMQ_PASSWORD``: The RabbitMQ password

## MongoDB

[MongoDB](/configuration/services/mongodb.html) configuration is exposed via the following environment variables (where ``MONGODB`` is the upper-cased version of the key defined in the relationship):

* ``MONGODB_SERVER``
* ``MONGODB_HOST``
* ``MONGODB_PORT``
* ``MONGODB_SCHEME``
* ``MONGODB_NAME``
* ``MONGODB_DATABASE``
* ``MONGODB_USER``
* ``MONGODB_USERNAME``
* ``MONGODB_PASSWORD``

## InfluxDB

[InfluxDB](/configuration/services/influxdb.html) configuration is exposed via the following environment variables (where ``TIMEDB`` is the upper-cased version of the key defined in the relationship):

* ``TIMEDB_SCHEME``
* ``TIMEDB_HOST``
* ``TIMEDB_PORT``
* ``TIMEDB_IP``

## Kafka

[Apache Kafka](/configuration/services/kafka.html) configuration is exposed via the following environment variables (where ``KAFKA`` is the upper-cased version of the key defined in the relationship):

* ``KAFKA_URL``
* ``KAFKA_SCHEME``
* ``KAFKA_HOST``
* ``KAFKA_PORT``
* ``KAFKA_IP``
