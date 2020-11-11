---
title: "How to Deploy Quarkus on Platform.sh"
sidebarTitle: "Get started"
weight: -110
layout: single
toc: false
description: |
    Create a Platform.sh account, download a few tools, and prepare to deploy Quarkus.
---



Quarkus is, in its own words, a cloud-native, (Linux) container-first framework for writing Java applications. It has become popular lately because of the amazingly fast boot time, incredibly low RSS memory. In this series of articles about Quarkus, we'll discuss how to deploy a Quarkus application even faster to the cloud with Platform.sh.

Quarkus became so popular because it is light and straightforward to use. Quarkus has integration with several databases such as [PostgreSQL](configuration/services/postgresql.md), [MariaDB](configuration/services/mysql.md), [MySQL](configuration/services/mysql.md), [MongoDB](configuration/services/mongodb.md), [Redis](configuration/services/redis.md), [Elasticsearch](configuration/services/elasticsearch.md), etc. 
To Dependency injection, it provides a Quarkus DI based on CDI. As Java Developer, you can let the frameworks handle the Object life cycle, besides taking advantage of the inversion of control (IoC) programming principle.

```
{{< note title="Tip">}}
[Quarkus has a vast guide](https://quarkus.io/guides/), where you can take advantage and learn the complete resources from there.
{{< /note >}}
```

