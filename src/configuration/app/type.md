# Type

The `type` key defines the base container image that will be used to run the application.  There is a separate base container image for each primary language for the application, often in multiple versions.  

## Supported types

Available languages and their supported versions include:

{% include "../../registry/images/tables/runtimes_supported.md" %}

## Example configuration

{% codesnippet "/registry/images/examples/full/php.app.yaml", language="yaml" %}{% endcodesnippet %}

## Runtime

The `.platform.app.yaml` file also supports a `runtime` key that allows selected customizations to the language runtime. As those possibilities vary by language, please see the appropriate language documentation.

* [PHP](/languages/php.md)
