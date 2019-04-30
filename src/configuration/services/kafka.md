# Kafka (Message Queue service)

Apache Kafka is an open-source stream-processing software platform.  It is a framework for storing, reading and analysing streaming data.

See the [Kafka documentation](https://kafka.apache.org/documentation/) for more information.

## Supported versions

* 2.1

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/kafka", language="json" %}{% endcodesnippet %}

## Usage example

In your ``.platform/services.yaml``:

```yaml
mykafka:
    type: kafka:2.1
    disk: 1024
```

In your ``.platform.app.yaml``:

```yaml
relationships:
    kafka: "mykafka:kafka"
```

You can then use the service in a configuration file of your application with something like:

{% codetabs name="Python", type="python", url="https://examples.docs.platform.sh/python/kafka" -%}

{%- endcodetabs %}

(The specific way to inject configuration into your application will vary. Consult your application or framework's documentation.)
