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

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="kafka" status="supported" environment="grid" >}} | {{< image-versions image="kafka" status="supported" environment="dedicated" >}} |

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](/development/variables/#platformsh-provided-variables):

{{< highlight json >}}
{{< remote url="https://examples.docs.platform.sh/relationships/kafka" >}}
{{< /highlight >}}

## Usage example

In your ``.platform/services.yaml``:

{{< readFile file="src/registry/images/examples/full/kafka.services.yaml" highlight="yaml" >}}

In your ``.platform.app.yaml``:

{{< readFile file="src/registry/images/examples/full/kafka.app.yaml" highlight="yaml" >}}

{{< endpoint-clarification "kafka" >}}

You can then use the service in a configuration file of your application with something like:

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
