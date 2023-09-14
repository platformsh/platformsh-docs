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
            <td>{{< image-versions image="kafka" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="kafka" status="supported" environment="dedicated-gen-3" >}}</td>
            <td>{{< image-versions image="kafka" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

<--->
<!-- API Version 2 -->

{{< image-versions image="kafka" status="supported" environment="grid" >}}

{{% /version/specific %}}

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
{
    "service": "kafka25",
    "ip": "169.254.27.10",
    "hostname": "t7lv3t3ttyh3vyrzgqguj5upwy.kafka25.service._.eu-3.{{< vendor/urlraw "hostname" >}}",
    "cluster": "rjify4yjcwxaa-master-7rqtwti",
    "host": "kafka.internal",
    "rel": "kafka",
    "scheme": "kafka",
    "type": "kafka:{{< latest "kafka" >}}",
    "port": 9092
}
```

## Usage example

{{% endpoint-description type="kafka" /%}}

{{< codetabs v2hide="true" >}}

+++
title=Java
file=static/files/fetch/examples/java/kafka
highlight=java
+++

<--->

+++
title=Python
file=static/files/fetch/examples/python/kafka
highlight=python
+++

<--->

+++
title=Ruby
highlight=ruby
markdownify=false
+++
## With the ruby-kafka gem

# Producer
require "kafka"
kafka = Kafka.new(["kafka.internal:9092"], client_id: "my-application")
kafka.deliver_message("Hello, World!", topic: "greetings")

# Consumer
kafka.each_message(topic: "greetings") do |message|
  puts message.offset, message.key, message.value
end

{{< /codetabs >}}

{{% version/only "2" %}}

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="myapp" >}}
# Relationships enable an app container's access to a service.
relationships:
    kafkaqueue: "queuekafka:kafka"
{{< /snippet >}}
{{< snippet name="queuekafka" config="service" placeholder="true" >}}
    type: kafka:{{% latest "kafka" %}}
    disk: 512
{{< /snippet >}}
```

{{< v2connect2app serviceName="queuekafka" relationship="kafkaqueue" var="KAFKA_URL">}}

```bash {location="myapp/.environment"}
# Decode the built-in credentials object variable.
export RELATIONSHIPS_JSON=$(echo ${{< vendor/prefix >}}_RELATIONSHIPS | base64 --decode)

# Set environment variables for individual credentials.
export KAFKA_HOST=$(echo $RELATIONSHIPS_JSON | jq -r ".kafkaqueue[0].host")
export KAFKA_PORT=$(echo $RELATIONSHIPS_JSON | jq -r ".kafkaqueue[0].port")

# Combine into a single connection string to be used within app.
export KAFKA_URL="${KAFKA_HOST}:${KAFKA_PORT}"
```

{{< /v2connect2app >}}

{{% /version/only %}}

(The specific way to inject configuration into your application varies. Consult your application or framework's documentation.)
