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

{{< image-versions image="rabbitmq" status="supported" environment="grid" >}}

{{% deprecated-versions %}}

{{< image-versions image="rabbitmq" status="deprecated" environment="grid" >}}

{{% relationship-ref-intro %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

{{% service-values-change %}}

```bash
RABBITMQQUEUE_USERNAME=guest
RABBITMQQUEUE_SCHEME=amqp
RABBITMQQUEUE_SERVICE=rabbitmq
RABBITMQQUEUE_FRAGMENT=
RABBITMQQUEUE_EPOCH=0
RABBITMQQUEUE_IP=123.456.78.90
RABBITMQQUEUE_HOSTNAME=azertyuiopqsdfghjklm.rabbitmq.service._.eu-1.{{< vendor/urlraw "hostname" >}}
RABBITMQQUEUE_PORT=5672
RABBITMQQUEUE_CLUSTER=azertyuiop-main-afdwftq
RABBITMQQUEUE_HOST=rabbitmqqueue.internal
RABBITMQQUEUE_REL=rabbitmq
RABBITMQQUEUE_PATH=
RABBITMQQUEUE_QUERY={}
RABBITMQQUEUE_PASSWORD=ChangeMe
RABBITMQQUEUE_TYPE=rabbitmq:{{% latest "rabbitmq" %}}
RABBITMQQUEUE_PUBLIC=false
RABBITMQQUEUE_HOST_MAPPED=false
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal.

```json
{
    "username": "guest",
    "scheme": "amqp",
    "service": "rabbitmq",
    "fragment": null,
    "ip": "123.456.78.90",
    "hostname": "azertyuiopqsdfghjklm.rabbitmq.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "port": 5672,
    "cluster": "azertyuiopqsdf-master-7rqtwti",
    "host": "rabbitmqqueue.internal",
    "rel": "rabbitmq",
    "path": null,
    "query": [],
    "password": "ChangeMe",
    "type": "rabbitmq:{{% latest "rabbitmq" %}}",
    "public": false,
    "host_mapped": false
}
```

Example on how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_RABBITMQ_HOST=="$(echo $RELATIONSHIPS_JSON | jq -r '.rabbitmqqueue[0].host')"
```

{{< /codetabs >}}

## Usage example

{{% endpoint-description type="rabbitmq" /%}}

```yaml {configFile="app"}
{{% snippet name="myapp" config="app" root="myapp"  %}}
# Relationships enable an app container's access to a service.
relationships:
    rabbitmqqueue: "rabbitmq:rabbitmq"
{{% /snippet %}}
{{% snippet name="rabbitmq" config="service" placeholder="true"  %}}
    type: rabbitmq:{{% latest "rabbitmq" %}}
    disk: 256
{{% /snippet %}}
```

{{% v2connect2app serviceName="rabbitmq" relationship="rabbitmqqueue" var="AMQP_URL"%}}

```bash {location="myapp/.environment"}
# Set environment variables for individual credentials.
# For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-specific-variables.
export QUEUE_SCHEME=${RABBITMQQUEUE_SCHEME}
export QUEUE_USERNAME=${RABBITMQQUEUE_USERNAME}
export QUEUE_PASSWORD=${RABBITMQQUEUE_PASSWORD}
export QUEUE_HOST=${RABBITMQQUEUE_HOST}
export QUEUE_PORT=${RABBITMQQUEUE_PORT}

# Set a single RabbitMQ connection string variable for AMQP.
export AMQP_URL="${QUEUE_SCHEME}://${QUEUE_USERNAME}:${QUEUE_PASSWORD}@${QUEUE_HOST}:${QUEUE_PORT}/"
```

{{% /v2connect2app %}}

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

1.  SSH into your app container with a flag for local port forwarding:
2.
    ```bash
    ssh $({{% vendor/cli %}} ssh --pipe) -L 15672:{{< variable "RELATIONSHIP_NAME" >}}.internal:15672
    ```

    {{< variable "RELATIONSHIP_NAME" >}} is the [name you defined](#2-add-the-relationship).

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
{{% snippet name="rabbitmq" config="service"  %}}
    type: "rabbitmq:{{% latest "rabbitmq" %}}"
    configuration:
        vhosts:
            - host1
            - host2
{{% /snippet %}}
```

## Upgrading

When upgrading RabbitMQ, skipping major versions (e.g. 3.7 -> 3.11) [is not supported](https://www.rabbitmq.com/upgrade.html#rabbitmq-version-upgradability).
Make sure you upgrade sequentially (3.7 -> 3.8 -> 3.9 -> 3.10 -> 3.11) and that each upgrade commit translates into an actual deployment.
