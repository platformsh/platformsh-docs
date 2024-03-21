---
title: "Runtime"
weight: 170
description:
---

[//]: # (TODO add a link to the composable image extension way to do it)

{{% note title="Disclaimer" %}}
The ``runtime`` key is valid only if you set your runtime using [built-in image (``type:``)](/create-apps/app-reference/images/builtin-image.md).
{{% /note %}}

The following table presents the various possible modifications to your PHP or Lisp runtime:

| Name                        | Type                                                       | Language | Description |
| --------------------------- | ---------------------------------------------------------- | -------- | ----------- |
| `extensions`                | List of `string`s OR [extensions definitions](#extensions) | PHP      | [PHP extensions](/languages/php/extensions.md) to enable. |
| `disabled_extensions`       | List of `string`s                                          | PHP      | [PHP extensions](/languages/php/extensions.md) to disable. |
| `request_terminate_timeout` | `integer`                                                  | PHP      | The timeout for serving a single request after which the PHP-FPM worker process is killed. |
| `sizing_hints`              | A [sizing hints definition](#sizing-hints)                 | PHP      | The assumptions for setting the number of workers in your PHP-FPM runtime. |
| `xdebug`                    | An Xdebug definition                                       | PHP      | The setting to turn on [Xdebug](/languages/php/xdebug.md). |
| `quicklisp`                 | Distribution definitions                                   | Lisp     | [Distributions for QuickLisp](/languages/lisp.md#quicklisp-options) to use. |

You can also set your [app's runtime timezone](/create-apps/timezone.md).

## Extensions

You can enable [PHP extensions](/languages/php/extensions.md) just with a list of extensions:

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'php:{{% latest "php" %}}'
        runtime:
            extensions:
                - geoip
                - tidy
```
Alternatively, if you need to include configuration options, use a dictionary for that extension:

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'php:{{% latest "php" %}}'
        runtime:
            extensions:
                - geoip
                - name: blackfire
                configuration:
                    server_id: foo
                    server_token: bar
```
In this case, the `name` property is required.

## Sizing hints

The following table shows the properties that can be set in `sizing_hints`:

| Name              | Type      | Default | Minimum | Description |
| ----------------- | --------- | ------- | ------- | ----------- |
| `request_memory`  | `integer` | 45      | 10      | The average memory consumed per request in MB. |
| `reserved_memory` | `integer` | 70      | 70      | The amount of memory reserved in MB. |

See more about [PHP-FPM workers and sizing](/languages/php/fpm.md).
