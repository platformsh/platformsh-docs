---
title: Configure Spring with RabbitMQ
sidebarTitle: RabbitMQ
weight: -110
description: Configure a Spring application with RabbitMQ.
---

You can use [Spring JMS](https://spring.io/guides/gs/messaging-jms/)
to use [RabbitMQ](../../add-services/rabbitmq.md) with your app.
First, determine the MongoDB client using the [Java configuration reader library](https://github.com/platformsh/config-reader-java).

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.connection.CachingConnectionFactory;
import org.springframework.jms.support.converter.MappingJackson2MessageConverter;
import org.springframework.jms.support.converter.MessageConverter;
import org.springframework.jms.support.converter.MessageType;
import sh.platform.config.Config;
import sh.platform.config.RabbitMQ;

import javax.jms.ConnectionFactory;

@Configuration
@EnableJms
public class JMSConfig {

    private ConnectionFactory getConnectionFactory() {
        Config config = new Config();
        final RabbitMQ rabbitMQ = config.getCredential("rabbitmq", RabbitMQ::new);
        return rabbitMQ.get();
    }

    @Bean
    public MessageConverter getMessageConverter() {
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setTargetType(MessageType.TEXT);
        converter.setTypeIdPropertyName("_type");
        return converter;
    }

    @Bean
    public CachingConnectionFactory getCachingConnectionFactory() {
        ConnectionFactory connectionFactory = getConnectionFactory();
        return new CachingConnectionFactory(connectionFactory);
    }
}
```
