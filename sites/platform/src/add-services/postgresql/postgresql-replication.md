---
title: "PostgreSQL Replication"
sidebarTitle: "PostgreSQL Replication"
description: Configure and use read-only postgreSQL replicas to ease the load on a primary database.
---

To help distribute database read requests from read-heavy applications, you can define read-only replicas of a PostgreSQL service and then connect applications to one or more replicas. 

The use of replicas helps to prevent overloading a primary database and can improve scalability. 

Examples of read-heavy applications include: 
- Listing pages or dashboards
- Reporting or analytics jobs
- Background jobs that frequently query data

{{< note theme="info" title="Important" >}}
- **To prevent data loss or interruptions** during replication, you must configure the disk size for each replica. The replica service does not inherit the disk size of the primary database. The replica disk size must at least match the primary service's disk capacity. See the example below. 
- **Replication is asynchronous**: Delays of a few milliseconds might occur between writes on the primary database and reads on the replica database.
- **Replicas are read-only**: This restriction ensures data consistency and integrity. Attempts to modify data will result in an SQL error.
 

{{< /note >}}

## 1. Configure the primary and replica services

The following code fragment defines two PostgreSQL services: a primary and a replica. You can use this fragment as a template by copying it into your `services.yaml` file, replacing `<VERSION>` with the PostgreSQL version you need. 

Be sure to: 
- Use the same version number for the primary and replica services.
- Specify a `disk` size that is sufficient for the primary database's disk capacity.

<!-- does this apply for postgres? To set up replication you need to create a replication-enabled user? 

For each database that you'd like to replicate, you need to assign a `replication` permission/role under a corresponding `endpoint`:
-->

```yaml {configFile="services"}
services:
  db:
    type: postgresql:<VERSION>
    disk: 1024
    configuration:
      extensions:
        - postgis
      endpoints:
        replicator:
          replication: true

  db-replica1:
    type: postgresql-replica:<VERSION>
    disk: 1024
    configuration:
      endpoints:
        postgresql:
          default_database: main
      extensions:
        - postgis
    relationships:
      primary: db:replicator

  db-replica2:
    type: postgresql-replica:<VERSION>
    disk: 1024
    configuration:
      endpoints:
        postgresql:
          default_database: main
      extensions:
        - postgis
    relationships:
      primary: db:replicator

```

### How it works

Using the sample code fragment above: 

1. The primary PostgreSQL service defines a replicator endpoint that enables replication. 
    ```yaml
    endpoints:
      replicator:
        replication: true
    ```

2. The replica services (`db-replica1` and `db-relica2`) use the `postgresql-replica` image type and connect back to the primary database service through the primary relationship:

    ```yaml
    relationships:
      primary: db:replicator
    ```
    
3. The `db-replica1` and `db-replica2` replica services continuously stream data from the primary endpoint, maintaining a read-only mirror of the primary database content. Write operations are not permitted on the replicas. 


## 2. Define the relationship between the application and the replica

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


