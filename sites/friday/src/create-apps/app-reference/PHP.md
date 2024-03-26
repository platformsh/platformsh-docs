The following table presents the various possible modifications to your PHP runtime:

| Name                        | Type                                                       | Description                                                                                |
|-----------------------------|------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `extensions`                | List of `string`s OR [extensions definitions](#extensions) | [PHP extensions](/languages/php/extensions.md) to enable.                                  |
| `disabled_extensions`       | List of `string`s                                          | [PHP extensions](/languages/php/extensions.md) to disable.                                 |
| `request_terminate_timeout` | `integer`                                                  | The timeout for serving a single request after which the PHP-FPM worker process is killed. |
| `sizing_hints`              | A [sizing hints definition](#sizing-hints)                 | The assumptions for setting the number of workers in your PHP-FPM runtime.                 |
| `xdebug`                    | An Xdebug definition                                       | The setting to turn on [Xdebug](/languages/php/xdebug.md).                                 |

{{% note title="TODO" %}}
@Jerome: is all of this still valid? `request_terminate_timeout`, `sizing_hints`, `xdebug`?
{{% /note %}}

As an example:

```yaml {configFile="app"}
applications:
  frontend:
    stack:
      - "php@{{% latest "php" %}}":
        extensions:
          - apcu
          - sodium
          - xsl
          - pdo_sqlite
        disabled_extension:
          - gd
    # Additional frontend configuration
```

You can also set your [app's runtime timezone](/create-apps/timezone.md).