---
title: "Kafka (Message queue service)"
weight: 4
description: |
  Apache Kafka is an open-source stream-processing software platform.
sidebarTitle: "Kafka"
---

{{% description %}}

It is a framework for storing, reading and analyzing streaming data. See the [Kafka documentation](https://kafka.apache.org/documentation) for more information.

## Supported versions

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="kafka" status="supported" environment="grid" >}} | {{< image-versions image="kafka" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="kafka" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "kafka" %}}

## Relationship

The format exposed in the ``$PLATFORM_RELATIONSHIPS`` [environment variable](../development/variables/use-variables.md#use-platformsh-provided-variables):

{{< relationship "kafka" >}}

## Usage example

{{% endpoint-description type="kafka" /%}}

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
markdownify=false
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


(The specific way to inject configuration into your application varies. Consult your application or framework's documentation.)
