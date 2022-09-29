---
title: "RabbitMQ (Message queue service)"
weight: 10
sidebarTitle: "RabbitMQ"
---

RabbitMQ is an open source message broker software (sometimes called message-oriented middleware) that implements the Advanced Message Queuing Protocol (AMQP).

See the [RabbitMQ documentation](http://www.rabbitmq.com/documentation.html) for more information.

{{% frameworks %}}

- [Spring](../guides/spring/rabbitmq.md)

{{% /frameworks %}}

## Supported versions

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="rabbitmq" status="supported" environment="grid" >}} | {{< image-versions image="rabbitmq" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="rabbitmq" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "rabbitmq" %}}

## Relationship

The format exposed in the `$PLATFORM_RELATIONSHIPS` [environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

{{< relationship "rabbitmq" >}}

## Usage example

{{% endpoint-description type="rabbitmq" /%}}

{{< codetabs >}}

---
title=Go
file=static/files/fetch/examples/golang/rabbitmq
highlight=go
---

<--->

---
title=Java
file=static/files/fetch/examples/java/rabbitmq
highlight=java
---

<--->

---
title=PHP
file=static/files/fetch/examples/php/rabbitmq
highlight=php
---

<--->

---
title=Python
file=static/files/fetch/examples/python/rabbitmq
highlight=python
---

{{< /codetabs >}}

(The specific way to inject configuration into your application varies.
Consult your application or framework's documentation.)

## Connecting to RabbitMQ

### From your local development environment

For debugging purposes, it's sometimes useful to connect directly to a service with an SSH tunnel.
Open a tunnel with port forwarding:

```bash
platform tunnel:single -g
```

Then launch a RabbitMQ client of your choice configured to connect to the location returned.

### Access the management plugin  (Web UI)

To access the browser-based UI, use an SSH tunnel.
To open a tunnel, follow these steps.

1. SSH into your app container with a flag for local port forwarding:

   ```bash
   ssh $(platform ssh --pipe) -L 15672:<RELATIONSHIP_NAME>.internal:15672
   ```

2. Within that SSH session, get the username and password.
   Use the following command to see your app's relationships:

   ```bash
   echo "$PLATFORM_RELATIONSHIPS" | base64 --decode | jq .
   ```

3. Open `http://localhost:15672` in your browser.
   Use the credentials from step 2.

### From the application container

The application container currently doesn't include any useful utilities to connect to RabbitMQ with. However, you can install your own by adding a client as a dependency in your `.platform.app.yaml` file.

For example, you can use [amqp-utils](https://github.com/dougbarth/amqp-utils/) by adding this:

 ```yaml
dependencies:
    ruby:
        amqp-utils: "0.5.1"
```

Then, when you SSH into your container, you can type any `amqp-` command available to manage your queues.

## Configuration

### Virtual hosts

You can configure additional [virtual hosts](https://www.rabbitmq.com/vhosts.html) to a RabbitMQ service, which can be useful for separating resources, such as exchanges, queues, and bindings, to their own namespace. In your `.platform/services.yaml` file define the names of the virtual hosts under the `configuration.vhosts` attribute:

```yaml
rabbitmq:
    type: rabbitmq:3.8
    disk: 512
    configuration:
        vhosts:
            - foo
            - bar
```
