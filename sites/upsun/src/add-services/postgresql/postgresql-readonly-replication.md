---
title: "PostgreSQL read-only replication"
sidebarTitle: "Read-only replication"
description: Configure and access read-only PostgreSQL replicas to ease the load on a primary database.
---

You can improve the performance of read-heavy applications by defining read-only replicas of your PostgreSQL database and then connecting your applications to those replicas. 

Examples of read-heavy applications include: 
- Listing pages or dashboards
- Reporting or analytics jobs
- Background jobs that frequently query data

{{< note theme="info" title="Note" >}}
- **Replication is asynchronous**: Delays of a few milliseconds might occur between writes on the primary database and reads on the replica database.
- **Replicas are read-only**: This restriction ensures data consistency and integrity. Attempts to modify data will result in an SQL error.
{{< /note >}}

## Supported versions

You can select the major version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

{{< image-versions image="postgresql-replica" status="supported" >}}

### Replica scope and sharing services {#replica-scope-sharing-services}
PostgreSQL services (which provide access to databases and replicas) defined in a project cannot be accessed by or shared with applications in other projects. 



## 1. Configure the primary and replica services 

The following code fragment defines two MariaDB services: a primary and a replica. You can use this fragment as a template by copying it into your `services.yaml` or `application.yaml` file. 

Be sure to: 
- Replace `<VERSION>` with the [supported PostgreSQL version](/add-services/postgresql/_index.md#supported-versions) that you need. Use the same version number for the primary and replica services.
- **Important:** Use `replicator` as the endpoint name when you define the replica service. This is a special endpoint name that the replica service uses to connect to the database.

```yaml {configFile="services"}
services:
  db:
    type: postgresql:<VERSION>
    configuration:
      extensions:
        - postgis
      endpoints:
        replicator:
          replication: true

  db-replica1:
    type: postgres-replica:<VERSION>
    configuration:
      endpoints:
        postgresql:
          default_database: main
      extensions:
        - postgis
    relationships: 
      primary: db:replicator # Do not change the name `primary`. The service expects to receive this name.

  db-replica2:
    type: postgres-replica:<VERSION>
    configuration:
      endpoints:
        postgresql:
          default_database: main
      extensions:
        - postgis
    relationships: 
      primary: db:replicator # Do not change the name `primary`. The service expects to receive this name.
```


### How it works

Using the sample code fragment above: 

1. After you define the replicator endpoints, the primary service creates a `replicator` user that has permission to replicate the database. You must specify `replicator` as the endpoint name, as described at the start of this topic. 

    ```yaml
    endpoints:
      replicator:
        replication: true
    ```

2. In the replica services (in this example, db-replica1 and db-replica2), defining the relationship `primary: db:replicator` ensures that the service can connect to the primary database as the `replicator` user. 

    ```yaml
    relationships:
      primary: db:replicator
    ```
    
The `db-replica1` and `db-replica2` replica services continuously stream data from the primary endpoint, maintaining a read-only copy of the primary database content. Write operations are not permitted on the replicas. 


## 2. Define the relationship between the application and the replicas

Even if your application won't access the replication endpoint, you must expose the endpoint to an application as a relationship so that you can connect to it over SSH.

Add a new relationship to your application container, as shown below:

```yaml {configFile="app"}
name: myapp

[...]

# Relationships enable an app container's access to a service.
relationships:
  # More information: https://fixed.docs.upsun.com/anchors/fixed/app/reference/relationships/
  database:
    service: db
    endpoint: main
  database-readonly:
    service: db-replica
```

If your application's performance is still not what you expect, you can configure additional replicas as described above.