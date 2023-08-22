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

| Grid | {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|------|-------------------------------|------------------------------ |
|  {{< image-versions image="kafka" status="supported" environment="grid" >}} | {{< image-versions image="kafka" status="supported" environment="dedicated-gen-3" >}} | {{< image-versions image="kafka" status="supported" environment="dedicated-gen-2" >}} |

{{% relationship-ref-intro %}}

{{% service-values-change %}}

```yaml
{
    "service": "kafka25",
    "ip": "169.254.27.10",
    "hostname": "t7lv3t3ttyh3vyrzgqguj5upwy.kafka25.service._.eu-3.platformsh.site",
    "cluster": "rjify4yjcwxaa-master-7rqtwti",
    "host": "kafka.internal",
    "rel": "kafka",
    "scheme": "kafka",
    "type": "kafka:2.5",
    "port": 9092
}
```

## Usage example

{{% endpoint-description type="kafka" /%}}

{{< codetabs >}}

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


(The specific way to inject configuration into your application varies. Consult your application or framework's documentation.)
