---
title: "2017 Changelog"
sidebarTitle: "2017"
description: |
  Look here for all the most recent additions to Platform.sh.
---

## December
  * New project subdomains: The routes generated for subdomains and literal domains in development environments will now use `.` instead of translating them to `---`, for projects created after this date.
  * `!include` tag support in YAML files: All YAML configuration files now support a generic [`!include`](/configuration/yaml.md) tag that can be used to embed one file within another.
  * Extended mount definitions: A new syntax has been added for defining [mount points](/configuration/app/app-reference.md#mounts) that is more self-descriptive and makes future extension easier.
  * Blocking older TLS versions: It is now possible to disable support for [HTTPS requests](/configuration/routes/https.md) using older versions of TLS. TLS 1.0 is known to be insecure in some circumstances and some compliance standards require a higher minimum supported version.
  * `{all}` placeholder for routes: A new placeholder is available in [`routes.yaml`](/configuration/routes/_index.md) files that matches all configured domains.
  * GitLab source code integration: Synchronize Git repository host on [GitLab](/integrations/source/gitlab.md) to Platform.sh.
---

## November
  * PHP 7.2 supported: With the release of PHP 7.2.0, Platform.sh now offers [PHP 7.2](/languages/php/_index.md) containers on Platform Professional.
---

## September
  * Health notifications: Low-disk warnings will now trigger a [notification](/integrations/notifications.md) via email, Slack, or PagerDuty.
---

## August
  * Worker instances: Applications now support [worker instances](/configuration/app/app-reference.md#workers).
---

## July
  * Node.js 8.2: [Node.js 8.2](/languages/nodejs/_index.md) is now available.
---

## June
  * Memcache 1.4: [Memcache 1.4](/configuration/services/memcached.md) is now available as a caching backend.
  * Custom static headers in `.platform.app.yaml`: Added support for setting custom headers for static files in `.platform.app.yaml`. [See the example](/configuration/app/web.md#how-can-i-control-the-headers-sent-with-my-files) for more information.
---

## May
  * Code-driven variables in `.platform.app.yaml`: Added support for setting [environment variables via `.platform.app.yaml`](/configuration/app/app-reference.m#variables).
  * Python 3.6, Ruby 2.4, Node.js 6.10: Added support for updated versions of several languages.
---

## April
  * Support for automatic SSL certificates: All production environments are now issued an SSL certificate automatically through Let's Encrypt.
    See the [routing documentation](/configuration/routes/https.md) for more information.
  * MariaDB 10.1: MariaDB 10.1 is now available (accessible as `mysql:10.1`).
    Additionally, both MariaDB 10.0 and 10.1 now use the Barracuda file format with `innodb_large_prefix` enabled,
    which allows for much longer indexes and resolves issues with some UTF-8 MB use cases.
---

## March
  * Elasticsearch 2.4 and 5.2 with support for plugins: Elasticsearch 2.4 and 5.2 are now available.
    Both have a number of optional plugins available.
    See the [Elasticsearch documentation](/configuration/services/elasticsearch.md) for more information.
  * InfluxDB 1.2: A new service type is available for InfluxDB 1.2, a time-series database.
    See the [InfluxDB documentation](/configuration/services/influxdb.md) for more information.
---

## February
  * HHVM 3.15 and 3.18: Two new HHVM versions are now available.
---

## January
  * Support for Multiple MySQL databases and restricted users: MySQL now supports multiple databases, and restricted users per MySQL service.
    See the [MySQL documentation](/configuration/services/mysql/_index.md) for details or read our [blog post](https://platform.sh/2017/02/multi-mysql).
  * Support for Persistent Redis services:
    Added a `redis-persistent` service that is appropriate for persistent key-value data.
    The `redis` service is still available for caching.
    See the [Redis documentation](/configuration/services/redis.md) for details.
  * Support Apache Solr 6.3 with multiple cores:
    Added an Apache 6.3 service, which can be configured with multiple cores.
    See the [Solr documentation](/configuration/services/solr.md) for details.
  * Support for HTTP/2:
    Any site configured with HTTPS will now automatically support HTTP/2.
    Read more on our [blog post](https://platform.sh/2017/1/http2).
---
