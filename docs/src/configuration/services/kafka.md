---
title: "Kafka (Message queue service)"
weight: 4
description: |
  Apache Kafka is an open-source stream-processing software platform.
sidebarTitle: "Kafka"
---

{{< description >}}

It is a framework for storing, reading and analyzing streaming data. See the [Kafka documentation](https://kafka.apache.org/documentation) for more information.

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="kafka" status="supported" environment="grid" >}} | {{< image-versions image="kafka" status="supported" environment="dedicated" >}} | {{< image-versions image="kafka" status="supported" environment="dedicated-gen-3" >}} |

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables.md#platformsh-provided-variables):

{{< relationship "kafka" >}}

## Usage example

{{% endpoint-description type="kafka" %}}

Service definition:

{{< readFile file="src/registry/images/examples/full/kafka.services.yaml" highlight="yaml" >}}

App configuration:

{{< readFile file="src/registry/images/examples/full/kafka.app.yaml" highlight="yaml" >}}

{{% /endpoint-description %}}

{{< codetabs >}}

---
title=Java
file=static/files/fetch/examples/java/kafka
highlight=java
---

<--->

---
title=Python
file=static/files/fetch/examples/python/kafka
highlight=python
---

<--->

---
title=Ruby
file=none
highlight=ruby
---
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

(The specific way to inject configuration into your application will vary. Consult your application or framework's documentation.)
