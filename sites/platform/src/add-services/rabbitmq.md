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

{{% version/specific %}}
<!-- API Version 1 -->

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

<--->
<!-- API Version 2 -->

{{< image-versions image="rabbitmq" status="supported" environment="grid" >}}

{{% /version/specific %}}

{{% deprecated-versions %}}

{{% version/specific %}}
<!-- API Version 1 -->

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

<--->
<!-- API Version 2 -->

{{< image-versions image="rabbitmq" status="deprecated" environment="grid" >}}

{{% /version/specific %}}

## Usage example

{{% endpoint-description type="rabbitmq" /%}}

<!-- Version 1: Codetabs using config reader + examples.docs.platform.sh -->
{{< codetabs v2hide="true" >}}

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

<!-- Version 2: .environment shortcode + context -->
{{% version/only "2" %}}

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
# Relationships enable an app container's access to a service.
relationships:
    rabbitmqqueue: "queuerabbit:rabbitmq"
{{< /snippet >}}
{{< snippet name="queuerabbit" config="service" placeholder="true" >}}
    type: rabbitmq:{{% latest "rabbitmq" %}}
    disk: 256
{{< /snippet >}}
```

{{< v2connect2app serviceName="queuerabbit" relationship="rabbitmqqueue" var="AMQP_URL">}}

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export QUEUE_SCHEME=$(echo $RELATIONSHIPS_JSON | jq -r ".rabbitmqqueue[0].scheme")
export QUEUE_USERNAME=$(echo $RELATIONSHIPS_JSON | jq -r ".rabbitmqqueue[0].username")
export QUEUE_PASSWORD=$(echo $RELATIONSHIPS_JSON | jq -r ".rabbitmqqueue[0].password")
export QUEUE_HOST=$(echo $RELATIONSHIPS_JSON | jq -r ".rabbitmqqueue[0].host")
export QUEUE_PORT=$(echo $RELATIONSHIPS_JSON | jq -r ".rabbitmqqueue[0].port")

# Set a single RabbitMQ connection string variable for AMQP.
export AMQP_URL="${QUEUE_SCHEME}://${QUEUE_USERNAME}:${QUEUE_PASSWORD}@${QUEUE_HOST}:${QUEUE_PORT}/"
```

{{< /v2connect2app >}}

{{% /version/only %}}

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

{{% version/specific %}}

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

<--->

1.  SSH into your app container with a flag for local port forwarding:
2.  
    ```bash
    ssh $({{% vendor/cli %}} ssh --pipe) -L 15672:{{< variable "RELATIONSHIP_NAME" >}}.internal:15672
    ```
    
    {{< variable "RELATIONSHIP_NAME" >}} is the [name you defined](#2-add-the-relationship).

{{% /version/specific %}}

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

{{< version/specific >}}
<!-- Version 1 -->

```yaml {configFile="services"}
{{< snippet name="rabbitmq" config="service" >}}
    type: "rabbitmq:{{% latest "rabbitmq" %}}"
    disk: 512
    configuration:
        vhosts:
            - host1
            - host2
{{< /snippet >}}
```

<--->
<!-- Version 2 -->

```yaml {configFile="services"}
{{< snippet name="rabbitmq" config="service" >}}
    type: "rabbitmq:{{% latest "rabbitmq" %}}"
    configuration:
        vhosts:
            - host1
            - host2
{{< /snippet >}}
```

{{< /version/specific >}}

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
{
    "username": "guest",
    "scheme": "amqp",
    "service": "rabbitmq38",
    "fragment": null,
    "ip": "169.254.57.5",
    "hostname": "iwrccysk3gpam2zdlwdr5fgs2y.rabbitmq38.service._.eu-3.{{< vendor/urlraw "hostname" >}}",
    "port": 5672,
    "cluster": "rjify4yjcwxaa-master-7rqtwti",
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

## Upgrading

When upgrading RabbitMQ, skipping major versions (e.g. 3.7 -> 3.11) [is not supported](https://www.rabbitmq.com/upgrade.html#rabbitmq-version-upgradability).
Make sure you upgrade sequentially (3.7 -> 3.8 -> 3.9 -> 3.10 -> 3.11).