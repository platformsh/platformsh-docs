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

## Known issues

### AMQP PHP extension

The PHP container that is deployed doesn't ship with the [AMQP](https://pecl.php.net/package/amqp) PHP extension. The reason is that there is no stable release yet. 

This means you won't be able to connect to RabbitMQ within the PHP container as you would do for MySQL for example.

A possible workaround is to use a PHP library (like [PHP AMQPlib](https://github.com/videlalvaro/php-amqplib)).

### Use a CLI

You can use any CLI for RabbitMQ (like [amqp-utils](https://github.com/dougbarth/amqp-utils/)).

All you need to do is to include it as a dependency in your ``.platform.app.yaml``:
 ```yaml
dependencies:
  ruby:
    amqp-utils: "0.5.1"
```

Then, when you SSH in your PHP container, you can simply type any ``amqp-`` command available to manage your queues.
