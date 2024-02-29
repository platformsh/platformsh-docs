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

```bash
KAFKA25_SERVICE=kafka25
KAFKA25_IP=123.456.78.90
KAFKA25_HOSTNAME=azertyuiopqsdfghjklm.clickhouse.service._.eu-1.{{< vendor/urlraw "hostname" >}}
KAFKA25_CLUSTER=azertyuiop-main-7rqtwti
KAFKA25_HOST=kafka.internal
KAFKA25_REL=kafka
KAFKA25_SCHEME=kafka
KAFKA25_TYPE=kafka:{{< latest "kafka" >}}
KAFKA25_PORT=9092
```

{{% note %}}
For some advanced use cases, you can use the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
to gather service information in a [`.environment` file](/development/variables/set-variables.md#use-env-files):

```bash {location=".environment"}
export APP_KAFKA_HOST=$(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".kafka25[0].host")
```

The structure of the `PLATFORM_RELATIONSHIP` environment variable can be obtained by running `{{< vendor/cli >}} relationships` in your terminal.
{{% /note %}}

## Usage example

{{% endpoint-description type="kafka" /%}}

(The specific way to inject configuration into your application varies. Consult your application or framework's documentation.)
