---
title: "MariaDB read-only replication"
sidebarTitle: "MariaDB read-only replication"
description: Configure and access read-only MariaDB replicas to ease the load on a primary database.
---

You can improve the performance of read-heavy applications by defining read-only replicas of your MariaDB database and then connecting your application to those replicas. 

Examples of read-heavy applications include: 
- Listing pages or dashboards
- Reporting or analytics jobs
- Background jobs that frequently query data

{{< note theme="info" title="Note" >}}
- **To prevent data loss or interruptions** during replication, you must configure the disk size for each replica. The replica service does not inherit the disk size of the primary database. The replica disk size must at least match the primary service's disk capacity. See the example below. 
- **Replication is asynchronous**: Delays of a few milliseconds might occur between writes on the primary database and reads on the replica database.
- **Replicas are read-only**: This restriction ensures data consistency and integrity. Attempts to modify data will result in an SQL error.
{{< /note >}}

## Supported versions

You can select the major and minor version.

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

{{< image-versions image="mariadb-replica" status="supported" >}}

### Read-only vs. external replicas
Read-only replicas are used primarily to improve application performance by distributing database read requests from read-heavy applications.  

Other common use cases for read-only replicas include: 
- Cross-region backup: Replicating data to different geographical regions
- Data warehousing: Extracting data from production to analytics projects

[External replicas](/add-services/mysql/mysql-replication.md) reside on remote servers and have different use cases, including disaster recovery.

### Replica scope and sharing services {#replica-scope-sharing-services}
MariaDB services (which provide access to databases and replicas) defined in a project cannot be accessed by or shared with applications in other projects. 

To share the MariaDB service among applications in different projects, you must complete the following high-level steps: 
1. Migrate the {{% vendor/name %}} projects to {{% vendor/company_name %}} Flex.  
1. Migrate the applications that are in those projects. 
1. Move the desired applications into one Flex project, rather than separate Flex projects. In {{% vendor/company_name %}} Flex, multiple applications in one project can share the same services. 

For details, see [Converting from {{% vendor/name %}}](https://docs.upsun.com/learn/tutorials/migrating/from-fixed.html) in the {{% vendor/company_name %}} Flex product docs.

## 1. Configure the primary and replica services

The following code fragment defines two MariaDB services: a primary and a replica. You can use this fragment as a template by copying it into your `services.yaml` or `application.yaml` file. 

Be sure to: 
- Replace `<VERSION>` with the [supported MariaDB version](/add-services/mysql/_index.md#supported-versions) that you need. Use the same version number for the primary and replica services.
- Replace `<SIZE>` with a `disk` size in (MB) that is sufficient for the primary database's disk capacity.
- **Important:** Use `replicator` as the endpoint name when you define the replica service. This is a special endpoint name that the replica service uses to connect to the database.

```yaml {configFile="services"}
services:
  db:
    type: mariadb:<VERSION>
    disk: <SIZE>
    configuration:
      schemas:
        - main
      endpoints:
        main:
          default_schema: main
          privileges:
              main: admin
        replicator:
          privileges:
            main: replication

  db-replica1:
    type: mariadb-replica:<VERSION>
    disk: <SIZE>
    configuration:
      schemas:
        - main
      endpoints:
        main:
          default_schema: main
          privileges:
            main: admin
    relationships:
      primary: db:replicator # Do not change the name `primary`. The service expects to receive this name.

  db-replica2:
    type: mariadb-replica:<VERSION>
    disk: <SIZE>
    configuration:
      schemas:
        - main
      endpoints:
        main:
          default_schema: main
          privileges:
            main: admin
    relationships:
      primary: db:replicator # Do not change the name `primary`. The service expects to receive this name.
```

### How it works

Using the sample code fragment above: 

1. The primary service (`db`) defines an additional `replicator` endpoint, granting the `replication` privilege. This enables a replica to connect and continuously replicate data from the primary database. 

    ```yaml
    replicator:
      privileges:
        main: replication
    ```

2. The replica services (`db-replica1` and `db-relica2`) use the `mariadb-replica` image type and connect back to the primary database service through the primary relationship. This establishes a replication link from `db` (the source) to `db-replica` (the target).

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


