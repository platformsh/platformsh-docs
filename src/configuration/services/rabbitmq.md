# RabbitMQ (Message Queue service)

RabbitMQ is an open source message broker software (sometimes called message-oriented middleware) that implements the Advanced Message Queuing Protocol (AMQP).

See the [RabbitMQ documentation](http://www.rabbitmq.com/documentation.html) for more information.

## Supported versions

<div id = "rabbitmqSupported"></div>

<script>
makeImagesList("services", "rabbitmq", "supported", "rabbitmqSupported");
</script>

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{% codesnippet "https://examples.docs.platform.sh/relationships/rabbitmq", language="json" %}{% endcodesnippet %}

## Usage example

In your ``.platform/services.yaml``:

```yaml
myrabbitmq:
    type: rabbitmq:3.7
    disk: 1024
```

In your ``.platform.app.yaml``:

```yaml
relationships:
    rabbitmq: "myrabbitmq:rabbitmq"
```

You can then use the service in a configuration file of your application with something like:

{% codetabs name="PHP", type="php", url="https://examples.docs.platform.sh/php/rabbitmq" -%}

{%- language name="Python", type="py", url="https://examples.docs.platform.sh/python/rabbitmq" -%}

{%- endcodetabs %}

(The specific way to inject configuration into your application will vary. Consult your application or framework's documentation.)

# Connecting to RabbitMQ

## From your local development environment

For debugging purposes, it's sometimes useful to be able to directly connect to a service instance. You can do this using SSH tunneling. To open a tunnel, log into your application container like usual, but with an extra flag to enable local port forwarding:

```bash
ssh -L 5672:mq.internal:5672 <projectid>-<branch_ID>@ssh.eu.platform.sh
```

Within that SSH session, use the following command to pretty-print your relationships. This lets you see which username and password to use, and you can double check that the remote service's port is 5672.

```bash
php -r 'print_r(json_decode(base64_decode($_ENV["PLATFORM_RELATIONSHIPS"])));'
```

If your service is running on a different port, you can re-open your SSH session with the correct port by modifying your `-L` flag: `-L 5672:mq.internal:<remote port>`.

Finally, while the session is open, you can launch a RabbitMQ client of your choice from your local workstation, configured to connect to `localhost:5672` using the username and password you found in the relationship variable.

## From the application container

The application container currently doesn't include any useful utilities to connect to RabbitMQ with. However, you can install your own by adding a client as a dependency in your `.platform.app.yaml` file.

For example, you can use [amqp-utils](https://github.com/dougbarth/amqp-utils/) by adding this:

 ```yaml
dependencies:
  ruby:
    amqp-utils: "0.5.1"
```

Then, when you SSH into your container, you can simply type any `amqp-` command available to manage your queues.
