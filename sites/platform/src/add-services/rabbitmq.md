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

{{% frameworks version="1" %}}

- [Spring](../guides/spring/rabbitmq.md)

{{% /frameworks %}}

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="rabbitmq" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="rabbitmq" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="rabbitmq" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

{{% deprecated-versions %}}

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 3</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="rabbitmq" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="rabbitmq" status="deprecated" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="rabbitmq" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>


{{% relationship-ref-intro %}}

{{% service-values-change %}}

```json
{
  "username": "guest",
  "scheme": "amqp",
  "service": "rabbitmq",
  "fragment": null,
  "ip": "123.456.78.90",
  "hostname": "azertyuiopqsdfghjklm.rabbitmq.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
  "port": 5672,
  "cluster": "azertyuiopqsdf-main-afdwftq",
  "host": "rabbitmq.internal",
  "rel": "rabbitmq",
  "path": null,
  "query": [],
  "password": "ChangeMe",
  "type": "rabbitmq:{{% latest "rabbitmq" %}}",
  "public": false,
  "host_mapped": false
}
```

## Usage example

{{% endpoint-description type="rabbitmq" /%}}

<!-- Version 1: Codetabs using config reader + examples.docs.platform.sh -->
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
open an SSH tunnel with the [{{% vendor/name %}} CLI](../administration/cli/_index.md).

To open an SSH tunnel to your service with port forwarding,
run the following command:

```bash
{{% vendor/cli %}} tunnel:single --gateway-ports
```

Then configure a RabbitMQ client to connect to this tunnel using the credentials from the [relationship](#relationship-reference).
See a [list of RabbitMQ client libraries](https://www.rabbitmq.com/devtools.html).

### Access the management UI

RabbitMQ offers a [management plugin with a browser-based UI](https://www.rabbitmq.com/management.html).
You can access this UI with an SSH tunnel.

To open a tunnel, follow these steps.

1.
   a) (On [grid environments](/glossary.md#grid)) SSH into your app container with a flag for local port forwarding:

    ```bash
    ssh $({{% vendor/cli %}} ssh --pipe) -L 15672:{{< variable "RELATIONSHIP_NAME" >}}.internal:15672
    ```

    {{< variable "RELATIONSHIP_NAME" >}} is the [name you defined](#2-add-the-relationship).

   b) (On [dedicated environments](/glossary.html#dedicated-gen-2)) SSH into your cluster with a flag for local port forwarding:

    ```bash
    ssh $({{% vendor/cli %}} ssh --pipe) -L 15672:localhost:15672
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

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
rabbitmq:
    type: "rabbitmq:{{% latest "rabbitmq" %}}"
    disk: 512
    configuration:
        vhosts:
            - host1
            - host2
```

## Upgrading

When upgrading RabbitMQ, skipping major versions (e.g. 3.7 -> 3.11) [is not supported](https://www.rabbitmq.com/upgrade.html#rabbitmq-version-upgradability).
Make sure you upgrade sequentially (3.7 -> 3.8 -> 3.9 -> 3.10 -> 3.11) and that each upgrade commit translates into an actual deployment.
