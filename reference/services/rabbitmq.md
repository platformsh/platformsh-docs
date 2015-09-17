# RabbitMQ

RabbitMQ is an open source message broker software (sometimes called message-oriented middleware) that implements the Advanced Message Queuing Protocol (AMQP).

## Supported versions

* 3.5.4 (default)

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](reference/environment-variables.md):

```bash
{
    "rabbitmq": [
        {
            "username": "guest",
            "password": "guest",
            "host": "248.0.65.98",
            "scheme": "solr",
            "scheme": "amqp",
            "port": 5672
        }
    ]
}
```

## Usage example

In your ``.platform/services.yaml``:

```yaml
myqueue:
    type: rabbitmq:3.5.4
    disk: 1024
```

In your ``.platform.app.yaml``:

```yaml
relationships:
    rabbitmq: "myqueue:rabbitmq"
```

You can them use the service in a configuration file of your application with something like:

```php
<?php
$relationships = getenv("PLATFORM_RELATIONSHIPS");
if (!$relationships) {
  return;
}

$relationships = json_decode(base64_decode($relationships), TRUE);

foreach ($relationships['rabbitmq'] as $endpoint) {
  $container->setParameter('rabbitmq_host', $endpoint['host']);
  $container->setParameter('rabbitmq_port', $endpoint['port']);
}
```

## Known issue

The PHP container that is deployed doesn't ship with the [AMQP](https://pecl.php.net/package/amqp) PHP extension. This means you won't be able to use the RabbitMQ Management Command Line Tool as is.

 You can work around this issue by using any other CLI (like [amqp-utils](https://github.com/dougbarth/amqp-utils/))and include it in the dependencies in your ``.platform.app.yaml``:
 
 ```yaml
dependencies:
  ruby:
    amqp-utils: "0.5.1"
```

Then, when you SSH in your PHP container, you can simply type any ``amqp-`` command available to manage your queues.
