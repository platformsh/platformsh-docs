---
title: "Swoole"
weight: 8
sidebarTitle: "Swoole"
---

{{% composable/disclaimer %}}

Swoole is a PHP extension that extends PHP core with a coroutine based asynchronous network application framework designed for building large scale concurrent systems.

Unlike PHP-FPM’s stateless operating, Swoole relies on establishing persistent connections with every user, sending and receiving data in real-time.

[Swoole](https://github.com/swoole/swoole-src) and [Open Swoole](https://openswoole.com/) are two forked libraries pursuing that goal.

{{< note >}}
The `swoole` and `openswoole` extensions are [available by default](/languages/php/extensions.md) on {{% vendor/name %}} PHP 8.2 {{% vendor/name %}} containers.
{{< /note >}}

For other versions of PHP, you can install both extensions manually by following the instructions on this page.</br>
You need:

- PHP 7.3+ for Swoole
- PHP 7.4.0+ for Open Swoole
- The [Swoole installation script](https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh).
  {{< note >}}
  Currently, the installation script is compatible with PHP <=8.0.</br>It is **not** compatible with PHP 8.3,
  and the `swoole` and `openswoole` extensions are **not** available on {{% vendor/name %}} PHP 8.3 containers yet.
  {{< /note >}}


<!-- @todo: To be added once Laravel guide for Upsun is live -->
{{% swoole %}}

## Use

Override the default web server with a [custom start command](./_index.md#alternate-start-commands).
Octane should listen on a TCP socket.

```yaml {configFile="app"}
applications:
  myapp:
    type: 'php:{{% latest "php" %}}'
    web:
      upstream:
        socket_family: tcp
        protocol: http
      commands:
        start: php {{<variable "PATH_TO_SWOOLE_START_COMMAND" >}} --port=$PORT
      locations:
        "/":
          passthru: true
          scripts: false
          allow: false
```
