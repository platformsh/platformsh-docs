# Type

The `type` key defines the base container image that will be used to run the application. There is a separate base container image for each primary language for the application, often in multiple versions. Supported languages include:

- [`php`](/languages/php.md)
- [`hhvm`](/languages/php.md)
- [`nodejs`](/languages/nodejs.md)
- [`python`](/languages/python.md)
- [`ruby`](/languages/ruby.md)
- [`golang`](/languages/go.md)

See the appropriate language page for all available versions.

**Example**

```yaml
type: php:7.1
```

## Runtime

The `.platform.app.yaml` file also supports a `runtime` key that allows selected customizations to the language runtime. As those possibilities vary by language, please see the appropriate language documentation.

- [PHP](/languages/php.md)
