---
title: "FrankenPHP"
weight: 6
sidebarTitle: "FrankenPHP"
description: Run PHP applications on {{% vendor/name %}} using FrankenPHP, a modern PHP application server built on Caddy.
---
<!-- vale off -->
[FrankenPHP](https://frankenphp.dev/) is a modern PHP application server designed as a high-performance alternative to traditional PHP-FPM setups. It combines a native PHP runtime with an HTTP server, reducing orchestration overhead while enabling new execution models that can significantly improve performance.

FrankenPHP is particularly well-suited for modern PHP frameworks and applications that want faster request handling, simpler infrastructure, and optional support for long-running workers.

FrankenPHP is available as a dedicated `frankenphp` runtime image, and as a package in {{% vendor/name %}} composable stacks.
The runtime image starts FrankenPHP for you and is the recommended way to run it.

## Supported versions

See [Image statuses](/learn/tutorials/upgrade-runtimes-services.md#image-statuses) for what Active means for the versions listed here.

The `frankenphp` image version combines the FrankenPHP major version and the PHP version, in the form `<FrankenPHP major>.<PHP version>`. See the versions below for current examples.
PHP is built thread safe (ZTS).

{{< image-versions-live image="frankenphp" status="active" >}}

Patch versions of FrankenPHP and PHP are applied periodically. When you deploy your app, you get the latest available patches.

### Specify the runtime image

To use the dedicated `frankenphp` runtime image, set `frankenphp` as your [app's `type`](/create-apps/app-reference/single-runtime-image.md#types):

```yaml {configFile="app"}
# The app's name, which must be unique within the project.
name: myapp
type: 'frankenphp:{{% latest "frankenphp" %}}'
```

To use FrankenPHP with the composable image instead, see [Composable image configuration](#composable-image-configuration).

## Deprecated versions

Each `frankenphp` version eventually follows the lifecycle of the PHP version it ships, but with a delay.
When a PHP version becomes [deprecated](/languages/php/_index.md#deprecated-versions) or retired on {{% vendor/name %}},
the matching `frankenphp` version doesn't necessarily change status on the same date.
See [Image statuses](/learn/tutorials/upgrade-runtimes-services.md#image-statuses) for what each status means.

The following versions are still available in your projects,
but their PHP version is at its end of life and no longer receives security updates from upstream:

{{< image-versions-live image="frankenphp" status="sunset" >}}

To keep your project stable, switch to a [supported version](#supported-versions).

## Retired versions

The following versions have been decommissioned and are no longer available. See [Image statuses](/learn/tutorials/upgrade-runtimes-services.md#image-statuses) for what each status means.
If your project uses a retired version, you must update to a [supported version](#supported-versions).

{{< image-versions-live image="frankenphp" status="decommissioned" >}}

## Why FrankenPHP?

Traditional PHP deployments rely on multiple moving parts: a web server, PHP-FPM, and external process management. FrankenPHP simplifies this architecture by embedding PHP execution directly into the server. Some key features include:

- Faster startup times and reduced per-request overhead compared to [PHP-FPM](/languages/php/fpm.html).
- A modern architecture that works for contemporary PHP runtimes and frameworks.
- Fewer services to configure and maintain.
- Support for a worker-based execution model that avoids re-booting the application on every request.

## Execution modes

FrankenPHP supports two distinct execution modes. Choosing the right mode depends on your application's architecture and tolerance for stateful execution.

### Classic mode (stateless)

Classic mode behaves similarly to [PHP-FPM](/languages/php/fpm.html) and is the recommended default for most applications. Every request starts from a clean slate: the application boots, handles the request, then shuts down, with no variables, objects, or internal state persisting between requests.

- Each request runs in a clean, isolated environment
- No application state is shared between requests
- Lifecycle expectations are identical to PHP-FPM
- Safe for existing PHP applications without modification

This guarantees isolation and predictability, but it comes with unavoidable overhead, since the full boot and teardown cycle happens on every request.

### Worker mode (stateful)

See [Configure worker mode](#configure-worker-mode) below.

Worker mode enables long-running PHP worker processes that handle multiple requests over their lifetime. The application is booted once and remains in memory; internal state persists unless explicitly reset. This improves performance dramatically, but introduces new risks:

- Mutated variables may leak into later requests
- Static properties and singletons persist
- Cached data may become stale or invalid
- Connection pools or services may behave unexpectedly

These issues do not occur in Classic mode.

{{< note theme="info" >}}

Applications not explicitly designed for long-running workers may require manual state resets between requests, careful handling of static properties and global variables, explicit cleanup logic and auditing of caching and service lifecycles.

Tools like [Laravel Octane](https://laravel.com/docs/master/octane) or the [Symfony FrankenPHP Runtime](https://github.com/php-runtime/frankenphp-symfony) are designed to manage this environment safely. They often serve clones of the application or reset the container state between requests to prevent variables from leaking.

{{< /note >}}

### Choosing the right mode

- Use [Classic mode](#classic-mode-stateless) if you want safety, predictability, and drop-in compatibility with existing PHP applications.
- Use [Worker mode](#worker-mode-stateful) if you need maximum performance and are prepared to manage application state explicitly.

Both modes are supported on {{% vendor/name %}}; see [Configure worker mode](#configure-worker-mode).

## Observability and profiling

[Blackfire](/increase-observability/integrate-observability/blackfire.html)'s automated monitoring integration is enabled on this image out of the box, as it is on the `php` image: no setup is required to get Application Performance Monitoring (APM) and alerting in both Classic and Worker modes. To profile requests with the full `blackfire` extension, enable it through [`runtime.extensions`](#php-extensions). Other profiling probes, such as `datadog-profiling` and `tideways`, are also available through `runtime.extensions`. See the [Blackfire](https://docs.blackfire.io/php/integrations/frankenphp) documentation for FrankenPHP integration.

## Configure Classic mode

Classic mode works with either the dedicated runtime image or the composable image. The following sections through Dependencies and build cover the dedicated image specifically; skip ahead to [Composable image configuration](#composable-image-configuration) if you're using that instead.

### Runtime image configuration

The image starts FrankenPHP automatically, so you don't need a `web.commands.start` command.
On each deploy, the image generates a Caddy configuration from your `web.locations`:

- The `/` location becomes the site root, served from `/app/<ROOT>`.
- Locations with `scripts: true` run PHP through the `php_server` directive.
- Locations with `scripts: false` serve files as they are, including `.php` sources.
- Other locations are served from their own `root` under `/app`.

A minimal configuration that serves a `public` directory:

```yaml {configFile="app"}
name: myapp
type: 'frankenphp:{{% latest "frankenphp" %}}'
source:
  root: "/"

web:
  upstream:
    socket_family: unix
    protocol: http
  locations:
    "/":
      root: "public"
      passthru: true
      allow: true
      scripts: true # Required on every location that runs PHP; omitting it serves .php files as plain text.
```

{{< note theme="warning" title="Warning" >}}
Set `scripts: true` on every location that runs PHP. A location with `scripts: false` serves `.php` files as plain text, exposing your source code, including any secrets or credentials in it, to anyone who requests the file.

Use `socket_family: unix` by default. Keep `protocol` set to `http`.
{{< /note >}}

### Extending the generated Caddyfile

FrankenPHP embeds Caddy, so requests are served over HTTP through the embedded server.
To add Caddy directives without replacing the generated configuration, put them in `Caddyfile.d/*.caddyfile` files at the root of your app.
The image imports them into the generated site block, in alphabetical order.
`web.locations` and `runtime.threads` keep working.

```text {location="Caddyfile.d/site.caddyfile"}
encode zstd gzip
header -Server

handle /healthz {
  respond 200
}
```

When writing directives, keep these in mind:

- `header`, `encode`, `redir`, `rewrite`, and `basic_auth` apply to every request unless you scope them with a matcher.
- Add routes with `handle <path> { ... }`. A `respond` or `file_server` written outside a `handle` block is shadowed by the generated handles.
- Directives for the `php_server` block itself, such as `env` or `resolve_root_symlink`, go in `Caddyfile.d/php_server/*.caddyfile` instead; the image imports them inside every generated `php_server`.
- A fragment with a syntax error fails the deploy, like the rest of the configuration.

{{< note >}}
Requests to `/Caddyfile` and `/Caddyfile.d/` always get a 404, so your fragments stay private even when the document root is the app root.
{{< /note >}}

### Sizing

The image sets the number of PHP threads from the resources of your container, the way the `php` image sets the number of PHP-FPM workers.
The number is calculated as follows:

```text
threads = min(max(2, floor((memory - reserved memory) / request memory)), max(25, 5 * CPU))
```

- `memory` is the memory of your container, in MB.
- `reserved memory` is the memory reserved for FrankenPHP itself. It defaults to 70 MB.
- `request memory` is the memory counted for each thread. It defaults to 45 MB.
- `CPU` is the number of CPUs of your container.

The result is rounded down, never goes below 2 threads, and is capped at 5 threads per CPU or 25 threads, whichever is higher.

The following table shows a few examples:

| Container | Threads |
|---|---|
| 0.1 CPU, 64 MB | 2 |
| 0.5 CPU, 512 MB | 9 |
| 1 CPU, 1024 MB | 21 |
| 2 CPU, 4096 MB | 25 |

Adjust the assumptions with `runtime.sizing_hints`, as on the `php` image, or set the count yourself:

```yaml {configFile="app"}
name: myapp
type: 'frankenphp:{{% latest "frankenphp" %}}'

runtime:
  sizing_hints:
    reserved_memory: 128
    request_memory: 64
  threads: 6
```

Below 2, it's raised to 2 with a warning.
Values above the automatic sizing are kept, with a warning in the deploy log.

The computed thread count is exported to FrankenPHP as `FRANKENPHP_NUM_THREADS`, so a [custom Caddyfile](#custom-caddyfile) can reuse it.

### Custom Caddyfile

To take over the Caddy configuration, add a `Caddyfile` at the root of your app.
The image uses it as it is and skips the generated configuration.
`runtime.threads` and `Caddyfile.d` fragments are ignored.
To keep the [automatic sizing](#sizing), read the exported count instead of hardcoding it:

```text {location="Caddyfile"}
{
  frankenphp {
    num_threads {$FRANKENPHP_NUM_THREADS}
  }
}
```

Your Caddyfile has to serve files from `/app` and listen on the Unix socket from the `SOCKET` environment variable:

```text {location="Caddyfile"}
{
  auto_https off
  admin off
  persist_config off

  servers {
    trusted_proxies static 127.0.0.1/32 ::1/128
    trusted_proxies_unix
    client_ip_headers X-Client-IP
  }

  frankenphp {
    num_threads 4
  }
}

:{$PORT} {
  bind unix/{$SOCKET}
  root * /app/public
  php_server {
    env REMOTE_ADDR {client_ip}
    env HTTPS {header.X-Client-SSL}
  }
}
```

With `socket_family: tcp`, listen on the port from the `PORT` environment variable instead of binding to `unix/{$SOCKET}`.

The image validates the file during the deploy. A syntax error fails the deploy.
See the [FrankenPHP configuration reference](https://frankenphp.dev/docs/config/) for the available directives.

### Monitor FrankenPHP with Ember

This is an optional workflow for inspecting FrankenPHP internals directly; most apps don't need it.

The default Caddyfile that {{% vendor/company_name %}} generates for your app turns the Caddy admin API off. To inspect FrankenPHP, use a [custom Caddyfile](#custom-caddyfile) that replaces `admin off` in the global block with `admin localhost:2019` and adds the `metrics` option:

```text {location="Caddyfile"}
{
  auto_https off
  admin localhost:2019
  persist_config off
  metrics
}
```

{{< note theme="warning" title="Warning" >}}
Keep the admin API bound to `localhost` rather than a broader address such as `0.0.0.0`. It has no authentication of its own.
{{< /note >}}

You can then monitor FrankenPHP from your own machine with [Ember](https://github.com/alexandre-daubois/ember),
a terminal dashboard for Caddy with FrankenPHP support (per-thread state, worker queue depth, crashes, memory).
Install Ember locally by following its [installation instructions](https://github.com/alexandre-daubois/ember#install),
then open an SSH tunnel to the admin port in a terminal:

```bash
ssh -N -L 2019:localhost:2019 $({{% vendor/cli %}} ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT> -A <APP_NAME>)
```

In another terminal, run `ember`. It connects to `localhost:2019` by default.

Without Ember, the following command returns the raw FrankenPHP metrics (such as `frankenphp_total_workers`):

```bash
{{% vendor/cli %}} ssh -- curl -s localhost:2019/metrics | grep frankenphp_
```

### PHP extensions

The image ships a thread-safe (ZTS) build of most [extensions of the `php` image](/languages/php/extensions.md), plus a few that only exist here (`ast`, `brotli`, `deepclone`, `lz4`, `parallel`, `xlswriter`, `xz`, `zstd`).
Manage them with `runtime.extensions` and `runtime.disabled_extensions`, as on the `php` image.

The following tables show the extensions built into PHP, the ones on by default, and the ones available on request, including the profiling probes.
You can turn on the available ones with the `extensions` key and turn off those on by default with the `disabled_extensions` key.
The availability is the same for `1.8.5`, `1.8.4`, `1.8.3`, and `1.8.2`.

| Built-in extension | Description |
|---|---|
| `calendar` | Calendar conversion functions. |
| `ctype` | Character type checking functions. |
| `curl` | HTTP and network requests via libcurl. |
| `date` | Date and time functions. |
| `dom` | DOM XML document manipulation. |
| `exif` | Read image EXIF metadata. |
| `fileinfo` | MIME type and file metadata detection. |
| `filter` | Input filtering and validation. |
| `hash` | Hashing functions (md5, sha256, and more). |
| `iconv` | Character set conversion. |
| `json` | JSON encode/decode functions. |
| `libxml` | libxml bindings used by the XML extensions. |
| `mbstring` | Multibyte string functions. |
| `opcache` | Bytecode cache and optimizer. |
| `openssl` | OpenSSL cryptography, TLS, and certificate handling. |
| `pcntl` | Process control: fork and signals. |
| `pcre` | Perl-compatible regular expressions. |
| `phar` | PHAR archive support. |
| `posix` | POSIX process and system functions. |
| `readline` | Interactive readline support. |
| `Reflection` | Reflection API. |
| `session` | Session handling. |
| `simplexml` | SimpleXML parsing API. |
| `sockets` | Low-level socket API. |
| `sodium` | Modern cryptography (libsodium). |
| `SPL` | Standard PHP Library. |
| `standard` | Core standard functions. |
| `tokenizer` | PHP tokenizer functions. |
| `xml` | Core XML parser support. |
| `xmlreader` | Streaming XML reader. |
| `xmlwriter` | Streaming XML writer. |
| `zlib` | zlib compression. |

| Default extension | Description |
|---|---|
| `bcmath` | Arbitrary precision mathematics. |
| `bz2` | bzip2 compression support. |
| `dba` | DBA key-value database abstraction. |
| `ftp` | FTP client functions. |
| `gd` | Image creation and manipulation (GD). |
| `gettext` | Native gettext i18n support. |
| `intl` | Internationalization (ICU) features. |
| `mysqli` | MySQL improved driver. |
| `mysqlnd` | MySQL native driver. |
| `pdo` | PHP Data Objects core. |
| `pdo_mysql` | PDO driver for MySQL/MariaDB. |
| `pdo_sqlite` | PDO driver for SQLite. |
| `soap` | SOAP client/server support. |
| `sqlite3` | SQLite3 driver. |
| `sysvmsg` | System V message queue support. |
| `sysvsem` | System V semaphore support. |
| `sysvshm` | System V shared memory support. |
| `zip` | ZIP archive support. |

| Available extension | Description |
|---|---|
| `amqp` | RabbitMQ/AMQP messaging client. |
| `apcu` | In-memory user data cache (APCu). |
| `ast` | Abstract syntax tree of PHP code, used by static analysis tools. |
| `blackfire` | Blackfire profiling probe. |
| `brotli` | Brotli compression. |
| `datadog-profiling` | Datadog continuous profiler. |
| `deepclone` | Deep cloning support for PHP objects. |
| `gmp` | Big integer arithmetic (GMP). |
| `igbinary` | Compact binary serializer. |
| `imagick` | Image processing with ImageMagick. |
| `ldap` | LDAP directory access. |
| `lz4` | LZ4 compression. |
| `memcached` | Memcached client extension. |
| `msgpack` | MessagePack serialization. |
| `opentelemetry` | OpenTelemetry tracing/metrics SDK. |
| `parallel` | Parallel concurrency API for thread-safe PHP. |
| `pdo_pgsql` | PDO driver for PostgreSQL. |
| `pgsql` | PostgreSQL driver. |
| `protobuf` | Protocol Buffers support. |
| `redis` | Redis client extension. |
| `shmop` | Shared memory operations. |
| `ssh2` | SSH2 and SFTP support. |
| `tideways` | PHP extension for tideways support. |
| `tidy` | HTML/XML cleanup and repair. |
| `uuid` | UUID generation and handling. |
| `xlswriter` | XLSX spreadsheet reading and writing. |
| `xsl` | XSLT transformations. |
| `xz` | XZ (LZMA) compression. |
| `yaml` | YAML parsing and emitting. |
| `zstd` | Zstandard compression. |

For example, to connect to PostgreSQL and use Redis:

```yaml {configFile="app"}
name: myapp
type: 'frankenphp:{{% latest "frankenphp" %}}'

runtime:
  extensions:
    - pdo_pgsql
    - redis
  disabled_extensions:
    - soap
```

{{< note >}}
The following extensions of the `php` image aren't available on this image:

`enchant`, `event`, `ffi`, `geoip`, `gnupg`, `grpc`, `http`, `imap`, `ioncube`, `mailparse`, `mongodb`, `newrelic`, `oauth`, `odbc`, `pdo_dblib`, `pdo_firebird`, `pdo_odbc`, `pdo_sqlsrv`, `raphf`, `rdkafka`, `snmp`, `sourceguardian`, `swoole`, `sybase`, `xdebug`, `xmlrpc`
{{< /note >}}

### PHP settings

Set `php.ini` directives through `variables.php` in your app configuration, or ship a `php.ini` file at the root of your app.
Settings from `php.ini` take precedence over `variables.php`.

```yaml {configFile="app"}
name: myapp
type: 'frankenphp:{{% latest "frankenphp" %}}'

variables:
  php:
    memory_limit: "256M"
    opcache.preload: config/preload.php
```

Sessions are stored in `/tmp/sessions` by default.
To retrieve and customize settings, see [PHP settings](/languages/php/_index.md#php-settings).

### Dependencies and build

The build works like the `php` image.
A `composer.json` file triggers `composer install` during the build, `build.flavor: none` disables it,
and `dependencies.php` installs global Composer packages.
Composer 2 and Node.js 24 are in the image, which lets you run `npm` in your build hook.
See [Dependencies](/languages/php/_index.md#dependencies).

### Composable image configuration

The `frankenphp` runtime image only runs FrankenPHP and PHP. If your app needs another language runtime, system packages, or a pinned tool version, use a [composable image](/create-apps/app-reference/composable-image.md) instead.

With a composable image, you install FrankenPHP as a package instead of using the `frankenphp` runtime. You start it yourself with a `web.commands.start` command and manage PHP extensions through `stack.runtimes`.

Don't use the composable image just to get Node.js for your build hook: the `frankenphp` runtime image already includes it (see [Dependencies and build](#dependencies-and-build)).

```yaml {configFile="apps"}
app:
  type: "composable:{{% latest "composable" %}}"
  source:
    root: "/"

  stack:
    runtimes:
      - "php@{{% latest "php" %}}":
          extensions:
            - apcu
            - blackfire
            - ctype
            - iconv
            - mbstring
            - pdo_pgsql
            - sodium
            - xsl
      - "nodejs@{{% latest "nodejs" %}}"
    packages:
      - "frankenphp"

  variables:
    php:
      opcache.preload: config/preload.php
    env:
      APP_RUNTIME: 'Runtime\\FrankenPhpSymfony\\Runtime'
      # composer require runtime/frankenphp-symfony

  web:
    upstream:
      socket_family: tcp
      protocol: http

    commands:
      start: frankenphp php-server --listen=localhost:$PORT --root=$PLATFORM_DOCUMENT_ROOT index.php

    locations:
      "/":
        root: "public"
        expires: 1h
        passthru: true
        allow: true
        scripts: true
        request_buffering:
          enabled: false
```

See also [Configure worker mode](#configure-worker-mode) if you need long-running PHP workers.

## Configure worker mode

Worker mode works with either the dedicated runtime image or the composable image.

### Runtime image configuration

Set `runtime.worker` to the script that boots your app, usually your front controller:

```yaml {configFile="app"}
name: myapp
type: 'frankenphp:{{% latest "frankenphp" %}}'

runtime:
  worker:
    script: public/index.php
```

Requests to the `/` location that reach this script run in worker mode. Other PHP files and other locations run in Classic mode.
Without `num`, the image starts 2 workers per CPU, rounded up, and keeps at least one thread for Classic mode.
If you set both `runtime.worker.num` and `runtime.threads`, `threads` has to be greater than `num`.
The worker count is exported to FrankenPHP as `FRANKENPHP_WORKER_NUM`.

### Composable image configuration

```yaml {configFile="apps"}
app:
  type: "composable:{{% latest "composable" %}}"
  source:
    root: "/"

  stack:
    runtimes:
      - "php@{{% latest "php" %}}":
          extensions:
            - apcu
            - blackfire
            - ctype
            - iconv
            - mbstring
            - pdo_pgsql
            - sodium
            - xsl
      - "nodejs@{{% latest "nodejs" %}}"
    packages:
      - "frankenphp"

  variables:
    php:
      opcache.preload: config/preload.php
    env:
      APP_RUNTIME: 'Runtime\\FrankenPhpSymfony\\Runtime'
      # composer require runtime/frankenphp-symfony

  web:
    upstream:
      socket_family: tcp
      protocol: http

    commands:
      start: frankenphp php-server --worker $PLATFORM_DOCUMENT_ROOT/index.php --listen=localhost:$PORT --root=$PLATFORM_DOCUMENT_ROOT

    locations:
      "/":
        root: "public"
        expires: 1h
        passthru: true
        allow: true
        scripts: true
        request_buffering:
          enabled: false
```

See also [Composable image configuration](#composable-image-configuration) above for Classic mode.

### Frameworks

Symfony: `symfony/runtime` 7.4 and later detects FrankenPHP worker mode on its own.
On older versions, install `runtime/frankenphp-symfony` and set `APP_RUNTIME` to `Runtime\FrankenPhpSymfony\Runtime` in `variables.env`.

### Using the latest FrankenPHP version

You can request FrankenPHP from the Nix unstable channel to access the latest available version.

```yaml {configFile="app"}
stack:
  packages:
    - package: frankenphp
      channel: unstable
```

## Related content

- [`runtime` property reference](/create-apps/app-reference/single-runtime-image.md#runtime)
- [Blackfire FrankenPHP documentation](https://docs.blackfire.io/php/integrations/frankenphp)
- [Up(Sun) and running with FrankenPHP](https://upsun.com/blog/upsun-and-running-with-frankenphp/)
- [How we scaled live connections for 1200 developers at SymfonyCon](https://devcenter.upsun.com/posts/how-we-scaled-live-connections-for-1200-developers-at-symfonycon/#starting-with-frankenphp-the-documentation-gap)
<!-- vale on -->
