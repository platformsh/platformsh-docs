---
title: "RabbitMQ (message queue service)"
weight: 10
sidebarTitle: RabbitMQ
description: See how to configure RabbitMQ for your messaging needs.
---

[RabbitMQ](https://www.rabbitmq.com/documentation.html) is a message broker
that supports multiple messaging protocols, such as the Advanced Message Queuing Protocol (AMQP).
It gives your apps a common platform to send and receive messages
and your messages a safe place to live until they're received.

{{% frameworks %}}

- [Spring](../guides/spring/rabbitmq.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
| {{< image-versions image="rabbitmq" status="supported" environment="grid" >}} | {{< image-versions image="rabbitmq" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="rabbitmq" status="supported" environment="dedicated-gen-2" >}} |

{{% deprecated-versions %}}

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="rabbitmq" status="deprecated" environment="grid" >}} | {{< image-versions image="rabbitmq" status="deprecated" environment="dedicated-gen-3" >}} | {{< image-versions image="rabbitmq" status="deprecated" environment="dedicated-gen-2" >}} |

## Usage example

{{% endpoint-description type="rabbitmq" /%}}

{{< codetabs >}}

+++
title=Go
file=static/files/fetch/examples/golang/rabbitmq
highlight=go
+++

<--->

+++
title=Java
file=static/files/fetch/examples/java/rabbitmq
highlight=java
+++

<--->

+++
title=PHP
file=static/files/fetch/examples/php/rabbitmq
highlight=php
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/rabbitmq
highlight=python
+++

{{< /codetabs >}}

## Connect to RabbitMQ

When debugging, you may want to connect directly to your RabbitMQ service.
You can connect in multiple ways:

- An [SSH tunnel](#via-ssh)
- A [web interface](#access-the-management-ui)

In each case, you need the login credentials that you can obtain from the [relationship](#relationship-reference).

### Via SSH

To connect directly to your RabbitMQ service in an environment,
open an SSH tunnel with the [{{< vendor/name >}} CLI](../administration/cli/_index.md).

To open an SSH tunnel to your service with port forwarding,
run the following command:

```bash
platform tunnel:single --gateway-ports
```

Then configure a RabbitMQ client to connect to this tunnel using the credentials from the [relationship](#relationship-reference).
See a [list of RabbitMQ client libraries](https://www.rabbitmq.com/devtools.html).

### Access the management UI

RabbitMQ offers a [management plugin with a browser-based UI](https://www.rabbitmq.com/management.html).
You can access this UI with an SSH tunnel.

To open a tunnel, follow these steps.

1.  
   a) (On [grid environments](../other/glossary.md#grid)) SSH into your app container with a flag for local port forwarding:

    ```bash
    ssh $(platform ssh --pipe) -L 15672:{{< variable "RELATIONSHIP_NAME" >}}.internal:15672
    ```

    {{< variable "RELATIONSHIP_NAME" >}} is the [name you defined](#2-add-the-relationship).

   b) (On [dedicated environments](../other/glossary.html#dedicated-gen-2)) SSH into your cluster with a flag for local port forwarding:

    ```bash
    ssh $(platform ssh --pipe) -L 15672:localhost:15672
    ```

2.  Open `http://localhost:15672` in your browser.
    Log in using the username and password from the [relationship](#relationship-reference).

## Configuration options

You can configure your RabbitMQ service in the [services configuration](#1-configure-the-service) with the following options:

| Name     | Type              | Required | Description                                          |
|----------|-------------------|----------|------------------------------------------------------|
| `vhosts` | List of `string`s | No       | Virtual hosts used for logically grouping resources. |

You can configure additional [virtual hosts](https://www.rabbitmq.com/vhosts.html),
which can be useful for separating resources, such as exchanges, queues, and bindings, into their own namespaces.
To create virtual hosts, add them to your configuration as in the following example:

```yaml {location=".platform/services.yaml"}
rabbitmq:
    type: rabbitmq:3.11
    disk: 512
    configuration:
        vhosts:
            - host1
            - host2
```

{{% relationship-ref-intro %}}

{{% service-values-change %}}

{{< relationship "rabbitmq" >}}
