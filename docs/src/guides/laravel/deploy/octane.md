---
title: "Laravel Octane"
sidebarTitle: "Octane"
weight: -90
description: Improve Laravel apps performance serving them with Laravel Octane.
---

[Laravel Octane](https://laravel.com/docs/octane) aims at improving the performance of Laravel applications by serving them using high-powered application servers, including [Swoole](https://github.com/swoole/swoole-src), [Open Swoole](https://openswoole.com/), and [RoadRunner](https://roadrunner.dev/).

{{< note >}}
Laravel Octane requires PHP 8.0+.
{{< /note >}}

## Install

Install the PHP extension for Swoole or Open Swoole during the build.

Take advantage of an [installation script](https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh).
You need to pass 2 parameters:

 - Which Swoole project to use: `openswoole` or `swoole`
 - Which version to install

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
        ...
        sh <( curl -s 'https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh') openswoole 4.11.1
```

## Use

Require Laravel Octane using Composer.

``` bash
composer require laravel/octane
```

Then make sure to clear the cache on all relevant Platform.sh environments.

``` bash
php artisan optimize:clear
```

Override the default web server with a [custom start command](../../../languages/php/_index.md#alternate-start-commands).
Octane should listen on a TCP socket.

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
