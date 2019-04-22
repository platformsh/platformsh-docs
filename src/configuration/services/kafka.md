# Kafka on platform.sh

Apache Kafka is an open-source stream-processing software platform  it is a framework for storing, reading and analysing streaming data.

# Setup

in `services.yaml`

```
kafka:
    type: kafka:2.1
    disk: 1024
```

Next setup, as usual in `.platform.app.yaml` a relationship from your app to the Kafka broker.

```
relationships:
    kafka: "kafka:kafka"
```

## Configuration :

You would usually export something like:

`KAFKA_URL=kafka.internal:9092`, `KAFKA_BROKER=kafka.internal:9092` or `KAFKA_BROKERS=kafka.internal:9092`  depending on the library you use.

## In Python using kafka-python

`pip install kafka-python`

The following example creates 1000 messages, encodes them as json and sends to kafka, from the other side it receives them and prints them out.

```python
from time import sleep
from json import dumps
from kafka import KafkaProducer

producer = KafkaProducer(bootstrap_servers=['kafka.internal:9092'],
                         value_serializer=lambda x: 
                         dumps(x).encode('utf-8'))
for e in range(1000):
    data = {'number' : e}
    producer.send('numtest', value=data)
    sleep(5)
```

```python
from kafka import KafkaConsumer
from json import loads

consumer = KafkaConsumer(
    'numtest',
     bootstrap_servers=['kafka.internal:9092'],
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     group_id='my-group',
     value_deserializer=lambda x: loads(x.decode('utf-8')))
     
for message in consumer:
    message = message.value
    print(message)
```

## In Ruby using the ruby-kafka gem this would be :

Produce some messages:

```ruby
require "kafka"

kafka = Kafka.new(["kafka.internal:9092"], client_id: "my-application")
kafka.deliver_message("Hello, World!", topic: "greetings")
```

Consume some messages:

```ruby
kafka.each_message(topic: "greetings") do |message|
  puts message.offset, message.key, message.value
end
```

## In Ruby using the racecar gem this would be :

In your .environment file you can put:

```
export RACECAR_BROKERS=kafka.internal:9092
```

You could consume events like this:

```ruby
class HelloConsumer < Racecar::Consumer
  subscribes_to "some-topic"

  def process(message)
    puts "Received message: #{message.value}"
  end
end
```

Here is an example of code that both consumes and produces events

```ruby
class ProducingConsumer < Racecar::Consumer
  subscribes_to "some-topic", start_from_beginning: false

  def process(message)
    value = message.value.reverse

    produce value, topic: "reverse-messages-topic"
  end
end
```

