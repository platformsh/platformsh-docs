---
title: "Swoole"
weight: 8
sidebarTitle: "Swoole"
---

Swoole is a PHP extension that extends PHP core with a coroutine based asynchronous network application framework designed for building large scale concurrent systems.

Unlike PHP-FPM’s stateless operating, Swoole relies on establishing persistent connections with every user, sending and receiving data in real-time.

[Swoole](https://github.com/swoole/swoole-src) and [Open Swoole](https://openswoole.com/) are two forked libraries persuing that goal.

{{< note >}}
Swoole requires PHP 7.3+.
{{< /note >}}

## Install

Install the Swoole PHP extension during the build.

Take advantage of an [installation script](https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh).
You need to pass 2 parameters:
 - Which Swoole project to use: `openswoole` or `swoole`
 - Which version to use

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
        ...
        sh <( curl -s 'https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh') openswoole 4.11.1
```

## Use

Override the default web server with a [custom start command](../../../languages/php/_index.md#alternate-start-commands).
Octane should listen on a TCP socket.

```yaml {location=".platform.app.yaml"}
web:
    upstream:
        socket_family: tcp
        protocol: http
    commands:
        start: php path/to/swoole/start/command --port=$PORT
    locations:
        "/":
            allow: false
            passthru: true
```