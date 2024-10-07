---
title: "Laravel Octane"
sidebarTitle: "Octane"
weight: -90
description: Improve Laravel apps' performance serving them with Laravel Octane.
---

[Laravel Octane](https://laravel.com/docs/octane) aims at improving the performance of Laravel applications by serving them using high-powered application servers, including [Swoole](https://github.com/swoole/swoole-src), [Open Swoole](https://openswoole.com/), and [RoadRunner](https://roadrunner.dev/).

{{< note >}}
Laravel Octane requires PHP 8.0+.
{{< /note >}}

{{% swoole %}}

## Use

Require Laravel Octane using Composer.

``` bash
composer require laravel/octane
```

Then make sure to clear the cache on all relevant {{% vendor/name %}} environments.

``` bash
php artisan optimize:clear
```

Override the default web server with a [custom start command](../../../languages/php/_index.md#alternate-start-commands).
Octane should listen on a TCP socket.

```yaml {configFile="app"}
web:
  upstream:
    socket_family: tcp
    protocol: http
  commands:
    start: php artisan octane:start --server=swoole --host=0.0.0.0 --port=$PORT
  locations:
    "/":
      passthru: true
      scripts: false
      allow: false
```

{{< guide-buttons previous="Back" next="Deploy" >}}
