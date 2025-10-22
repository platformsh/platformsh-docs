---
title: "PostgreSQL Replication"
sidebarTitle: "PostgreSQL Replication"
description: Configure and use read-only postgreSQL replicas to ease the load on a primary database.
---

To help distribute read-heavy database workloads, you can define read-only replicas of a postgreSQL service and then connect workloads to those replicas. This replication helps to prevent overloading a primary database and can improve scalability. 

Examples of read-heavy workloads include: 
- Listing pages or dashboards
- Reporting or analytics jobs
- Background jobs that frequently query data

Workloads that have intense read-heavy requirements can even be configured to use _multiple_ replicas. 

Replicas are read-only - any attempt to modify data results in an SQL error.

Replication is asynchronous, and delays of a few milliseconds might occur between writes on the primary database and reads on the replica database. 


## Define the primary and replica PostgreSQL service

You can copy the code fragment below into your config.yaml file. 

<!-- does this apply for postgres? To set up replication you need to create a replication-enabled user? 

For each database that you'd like to replicate, you need to assign a `replication` permission/role under a corresponding `endpoint`:
-->

```yaml {configFile="services"}
services:
  db:
    type: postgresql:16
    configuration:
      extensions:
        - postgis
      endpoints:
        replicator:
          replication: true

  db-replica:
    type: postgresql-replica:16
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

Using the example above: 

1. The primary PostgreSQL service defines a replicator endpoint that enables replication. 
```yaml
endpoints:
  replicator:
    replication: true
```

1. The replica service (`db-replica`) uses the `postgresql-replica` image type and connects back to the primary [service?] through the primary relationship:

```yaml
relationships:
  primary: db:replicator
```
1. The replica continuously streams data from the primary endpoint, maintaining a read-only mirror of the primary database content. To ensure data consistency and integrity, writes are not permitted on the replica. 


## Add a relationship for the new endpoint
<!-- keep or delete? -->
Even if your application won't access the replication endpoint, you still need to expose the endpoint to an application as a relationship so that you can connect to it over SSH.
Add a new relationship to your application container:

```yaml {configFile="app"}
name: myapp

[...]

# Relationships enable an app container's access to a service.
relationships:
  # Please note: Legacy definition of the relationship is still supported:
  # More information: https://docs.upsun.com/anchors/fixed/app/reference/relationships/
  database:
    service: "mariadb"
    endpoint: "mysql"
  replication:
    service: "mariadb"
    endpoint: "replicator"
```

## Configuring applications to connect to the replica service

After you define the replicas, you can configure an application to use them. Define a relationship in the application configuration, as shown below:

```yaml
relationships:
  database:
    service: db
    endpoint: main
  database-readonly:
    service: db-replica
```


