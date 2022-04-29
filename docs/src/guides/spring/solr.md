---
title: Configure Spring with Solr
sidebarTitle: Solr
weight: -110
description: Configure a Spring application with Solr.
---

You can use [Spring Data Solr](https://spring.io/projects/spring-data-solr)
for [Solr](../../add-services/solr.md) with your app.
First, determine the Solr client using the [Java configuration reader library](https://github.com/platformsh/config-reader-java).

```java
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.solr.core.SolrTemplate;
import sh.platform.config.Config;
import sh.platform.config.Solr;
@Configuration
public class SolrConfig {
    @Bean
    public HttpSolrClient elasticsearchTemplate() {
        Config config = new Config();
        final Solr credential = config.getCredential("solr", Solr::new);
        final HttpSolrClient httpSolrClient = credential.get();
        String url = httpSolrClient.getBaseURL();
        httpSolrClient.setBaseURL(url.substring(0, url.lastIndexOf('/')));
        return httpSolrClient;
    }
    @Bean
    public SolrTemplate solrTemplate(HttpSolrClient client) {
        return new SolrTemplate(client);
    }
}
```
