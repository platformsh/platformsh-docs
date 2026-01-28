---
title: "FrankenPHP"
weight: 6
sidebarTitle: "FrankenPHP"
---
<!-- vale off -->
[FrankenPHP](https://frankenphp.dev/) is a modern PHP application server designed as a high-performance alternative to traditional PHP-FPM setups. It combines a native PHP runtime with an HTTP server, reducing orchestration overhead while enabling new execution models that can significantly improve performance.

FrankenPHP is particularly well-suited for modern PHP frameworks and applications that want faster request handling, simpler infrastructure, and optional support for long-running workers.

## Why FrankenPHP?

Traditional PHP deployments rely on multiple moving parts: a web server, PHP-FPM, and external process management. FrankenPHP simplifies this architecture by embedding PHP execution directly into the server. Some key features include:

- Faster startup times and reduced per-request overhead compared to [PHP-FPM](/languages/php/fpm.html).
- A modern architecture that works for contemporary PHP runtimes and frameworks.
- Fewer services to configure and maintain.
- Support for a worker-based execution model that avoids re-booting the application on every request.

### Execution modes

FrankenPHP supports two distinct execution modes. Choosing the right mode depends on your application’s architecture and tolerance for stateful execution.

#### Classic mode

Classic mode behaves similarly to [PHP-FPM](/languages/php/fpm.html) and is the recommended default for most applications.

- Each request runs in a clean, isolated environment
- No application state is shared between requests
- Lifecycle expectations are identical to PHP-FPM
- Safe for existing PHP applications without modification

In this mode, FrankenPHP provides performance and architectural improvements while preserving the [stateless](#stateless-execution-php-fpm-and-classic-mode) execution model.

#### Worker mode

Worker mode enables long-running PHP worker processes that handle multiple requests over their lifetime.

- The application is booted once and kept in memory
- Subsequent requests reuse the already-loaded application
- Significantly reduced cold-start overhead
- Higher throughput and faster response times

This mode introduces [stateful](#stateful-execution-worker-mode) execution.

### Understanding Worker modes

#### Stateless execution (PHP-FPM and Classic mode)

In traditional PHP execution models every request starts from a clean slate, the application boots, handles the request, then shuts down and there are no variables, objects, or internal state persist between requests.

This guarantees isolation and predictability, but it comes with unavoidable overhead as the full boot and teardown cycle happens on every request. 

#### Stateful execution (Worker mode)

With Stateful execution in Worker mode, the application is booted once. It remains in memory and handles many requests and internal state persists unless explicitly reset. This improves performance dramatically, but introduces new risks. For example, in a stateful environment:

- Mutated variables may leak into later requests
- Static properties and singletons persist
- Cached data may become stale or invalid
- Connection pools or services may behave unexpectedly

These issues do not occur in stateless PHP-FPM setups.

{{< note theme="info" >}}

Aplications not explicitly designed for long-running workers may require manual state resets between requests, careful handling of static properties and global variables, explicit cleanup logic and auditing of caching and service lifecycles.

Tools like [Laravel Octane](https://laravel.com/docs/master/octane) or the [Symfony FrankenPHP Runtime](https://github.com/php-runtime/frankenphp-symfony) are designed to manage this environment safely. They often serve clones of the application or reset the container state between requests to prevent variables from leaking.

{{< /note >}}

### Observability and profiling

FrankenPHP is well supported by [Blackfire](/increase-observability/integrate-observability/blackfire.html), making it easy to profile and monitor performance in both Classic and Worker modes.

{{< note version="1" >}}

See the [Blackfire](https://docs.blackfire.io/php/integrations/frankenphp) documentation for FrankenPHP integration.

{{< /note >}}

## Configuration

FrankenPHP is available as a package in {{% vendor/name %}} composable stacks.

{{% composable/disclaimer %}}

### Classic mode configuration

```yaml {configFile="app"}
applications:
  app:
    type: "composable:25.11"
    source:
      root: "/"

    stack:
      runtimes:
        - "php@8.4":
            extensions:
              - apcu
              - blackfire
              - ctype
              - iconv
              - mbstring
              - pdo_pgsql
              - sodium
              - xsl
        - "nodejs@22"
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
### Worker mode configuration

```yaml {configFile="app"}
applications:
  app:
    type: "composable:25.11"
    source:
      root: "/"

    stack:
      runtimes:
        - "php@8.4":
            extensions:
              - apcu
              - blackfire
              - ctype
              - iconv
              - mbstring
              - pdo_pgsql
              - sodium
              - xsl
        - "nodejs@22"
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
### Using the latest FrankenPHP version

You can request FrankenPHP from the Nix unstable channel to access the latest available version.

```yaml {configFile="app"}
stack:
  packages:
    - package: frankenphp
      channel: unstable

```
### Choosing the right mode

- Use [Classic mode](#classic-mode) if you want safety, predictability, and drop-in compatibility with existing PHP applications.
- Use [Worker mode](#worker-mode) if you need maximum performance and are prepared to manage application state explicitly.

Both modes are fully supported on {{% vendor/name %}}, allowing you to choose the execution model that best fits your application.

## Related content

- [Blackfire FrankenPHP documentation](https://docs.blackfire.io/php/integrations/frankenphp)
- [Up(Sun) and running with FrankenPHP](https://upsun.com/blog/upsun-and-running-with-frankenphp/)
- [How we scaled live connections for 1200 developers at SymfonyCon](https://devcenter.upsun.com/posts/how-we-scaled-live-connections-for-1200-developers-at-symfonycon/#starting-with-frankenphp-the-documentation-gap)
<!-- vale on -->
