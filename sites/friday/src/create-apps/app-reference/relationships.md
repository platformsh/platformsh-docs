---
title: "Relationships"
weight: 40
description:
---

To access another container within your project, you need to define a relationship to it.
You can give each relationship any name you want.

The relationship is specified in the form `service_name:endpoint_name`.
The `service_name` is the name of the service given in the [services configuration](/add-services/_index.md)
or the name of another application in the same project specified as the `name` in that app's configration.

The `endpoint_name` is the exposed functionality of the service to use.
For most services, the endpoint is the same as the service type.
For some services (such as [MariaDB](/add-services/mysql/_index.md#multiple-databases)
and [Solr](/add-services/solr.md#solr-6-and-later)),
you can define additional explicit endpoints for multiple databases and cores in
the [service's configuration](/add-services/_index.md).

The following example shows a single MySQL service named `mysqldb` offering two databases,
a Redis cache service named `rediscache`, and an Elasticsearch service named `searchserver`.

{{< codetabs >}}
+++
title=Built-in image
+++
This example applies if you set your runtime using [built-in image (``type:``)](/create-apps/app-reference/images/builtin-image.md)

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'nodejs:{{% latest "nodejs" %}}'
    relationships:
      database: 'mysqldb:db1'
      database2: 'mysqldb:db2'
      cache: 'rediscache:redis'
      search: 'searchserver:elasticsearch'
```

<--->
+++
title=Composable image
+++
This example applies if you set your runtime using [Composable image (``stack:``)](/create-apps/app-reference/images/composable-image.md)

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    stack: ["nodejs@{{% latest nodejs %}}"]
    relationships:
      database: 'mysqldb:db1'
      database2: 'mysqldb:db2'
      cache: 'rediscache:redis'
      search: 'searchserver:elasticsearch'
```

{{< /codetabs >}}

{{% note %}}
Once a service is running and exposed via a relationship,
its credentials (such as the host, username, and password) are automatically available
as [service environment variables](/development/variables.html#service-environment-variables),
in the `$<RELATIONSHIP-NAME>_<SERVICE-PROPERTY>` format.
The available information is documented on each service's page, along with sample code for how to connect to it from
your app.
{{% /note %}}
