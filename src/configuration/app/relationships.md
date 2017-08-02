---
search:
    keywords: ['.platform.app.yaml', 'relationships']
---

# Relationships

The `relationships` block defines how services are mapped within your application.  By default, your application may not talk to any other container within a project.  To access another container you must define a relationship to it.

![](/images/config_diagrams/relationships.svg)

Each relationship has an arbitrary name, although by convention the primary SQL database of an application (if any) is usually `database`.  That is the name by which the relationship will be known in the `PLATFORM_RELATIONSHIPS` environment variable, which will include credentials for accessing the service.

The relationship is specified in the form `service_name:endpoint_name`.  The "service name" is the name of the service given in `.platform/services.yaml`, or the name of another application in the same project (that is, the `name` property of the `.platform.app.yaml` file for that application).  The "endpoint" is the exposed functionality of the service to use.  For most services that is simply the same as the service type, but on MySQL, for example, could be different if the service is running multiple databases.

See the [Services](/configuration/services.md) documentation for a full list of currently supported service types and service endpoints.

## How do I get access to multiple services?

In the following example, there is a single MySQL service named `mysqldb` offering two databases, a Redis cache service named `arediscache`, and an Elasticsearch service named `searchserver`.

```yaml
relationships:
    database: 'mysqldb:db1'
    database2: 'mysqldb:db2'
    cache: 'arediscache:redis'
    search: 'searchserver:elasticsearch'
```
