---
title: "Kafka (Message queue service)"
weight: -70
description: |
  Apache Kafka is an open-source stream-processing software platform.
sidebarTitle: "Kafka"
---

{{% description %}}

It is a framework for storing, reading and analyzing streaming data. See the [Kafka documentation](https://kafka.apache.org/documentation) for more information.

## Supported versions

{{% major-minor-versions-note configMinor="true" %}}

{{< image-versions image="kafka" status="supported" environment="grid" >}}

{{% relationship-ref-intro %}}

{{% service-values-change %}}

{{< codetabs >}}
+++
title= Service environment variables
+++

```bash
KAFKA_SERVICE=kafka
KAFKA_IP=123.456.78.90
KAFKA_HOSTNAME=azertyuiopqsdfghjklm.kafka.service._.eu-1.{{< vendor/urlraw "hostname" >}}
KAFKA_CLUSTER=azertyuiop-main-7rqtwti
KAFKA_HOST=kafka.internal
KAFKA_REL=kafka
KAFKA_SCHEME=kafka
KAFKA_TYPE=kafka:{{< latest "kafka" >}}
KAFKA_PORT=9092
```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
The structure of the `PLATFORM_RELATIONSHIPS` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal:

```json
{
    "service": "kafka",
    "ip": "123.456.78.90",
    "hostname": "azertyuiopqsdfghjklm.kafka.service._.eu-1.{{< vendor/urlraw "hostname" >}}",
    "cluster": "azertyuiop-main-7rqtwti",
    "host": "kafka.internal",
    "rel": "kafka",
    "scheme": "kafka",
    "type": "kafka:{{< latest "kafka" >}}",
    "port": 9092
}
```

Here is an example of how to gather [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export APP_KAFKA_HOST="$(echo $RELATIONSHIPS_JSON | jq -r '.kafka[0].host')"
```

{{< /codetabs >}}

## Usage example

{{% endpoint-description type="kafka" /%}}

(The specific way to inject configuration into your application varies. Consult your application or framework's documentation.)
