---
title: "Laravel Octane"
sidebarTitle: "Octane"
weight: -90
description: Improve Laravel apps performance serving them with Laravel Octane.
---

[Laravel Octane](https://laravel.com/docs/octane) aim at improving Laravel applications performance by serving them using high-powered application servers, including [Swoole](https://github.com/swoole/swoole-src), [Open Swoole](https://openswoole.com/), and [RoadRunner](https://roadrunner.dev/).

{{< note theme="warning" >}}
Laravel Octane requires PHP 8.0+.
{{< /note >}}

## Installation

Swoole and Open Swoole are PHP extensions that need to be installed during build.

A [script](https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh) is available to ease the installation of Swoole. It requires 2 parameters:
 - the Swoole project to use: `openswoole` or `swoole`
 - the version of the library

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
        ...
        sh <( curl -s 'https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh') openswoole 4.11.1
```

## Usage

Require Laravel Octane using Composer.

``` bash
composer require laravel/octane
```

Make sure to clear the cache on relevant Platform.sh environments afterwards.

``` bash
php artisan optimize:clear
```

The default web server should be overriden by a [custom start command](../../../languages/php/_index.md#alternate-start-commands). Octane should listen the TCP socket.

```yaml {location=".platform.app.yaml"}
web:
    upstream:
        socket_family: tcp
        protocol: http
    commands:
        start: php artisan octane:start --server=swoole --host=0.0.0.0 --port=$PORT
    locations:
        "/":
            allow: false
            passthru: true
```
