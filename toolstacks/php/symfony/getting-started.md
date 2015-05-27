Getting started
===============

Prerequisites
-------------

**Composer**

Composer is a tool for dependency management in PHP. It allows you to
declare the dependent libraries your project needs and it will install
them in your project for you.

> -   [Install Composer](https://getcomposer.org/download/)

Configure your app
------------------

Make sure your `.platform.app.yaml` is specific to Symfony.

A Symfony specific `.platform.app.yaml` file would look like this:

``` {.sourceCode .console}
toolstack: "php:symfony"

web:
    document_root: "/web"
    passthru: "/app_dev.php"

mounts:
    "/app/cache": "shared:files/cache"
    "/app/logs": "shared:files/logs"

hooks:
    build: "./app/console cache:warmup"
```

> -   configuration\_files

