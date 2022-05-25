---
title: "Swoole"
weight: 8
sidebarTitle: "Swoole"
---

Swoole is a PHP extension that extends PHP core with a coroutine based asynchronous network application framework designed for building large scale concurrent systems.

Unlike PHP-FPM’s stateless operating, Swoole relies on establishing persistent connections with every user, sending and receiving data in real-time.

[Swoole](https://github.com/swoole/swoole-src) and [Open Swoole](https://openswoole.com/) are two forked libraries persuing that goal.

{{< note theme="warning" >}}
Swoole requires PHP 7.3+.
{{< /note >}}

## Installation

Swoole PHP extension needs to be installed during build.

A [script](https://raw.githubusercontent.com/platformsh/snippets/main/src/install_swoole.sh) is available to ease its installation. It requires 2 parameters:
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

The default web server should be overriden by a [custom start command](../../../languages/php/_index.md#alternate-start-commands). Your application should listen the TCP socket.

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