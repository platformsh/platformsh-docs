---
title: Restrict access to a service
sidebarTitle: Restrict service access
description: Learn how to restrict access to a service using a worker and additional endpoints to the service.
weight: 2
---

{{% vendor/name %}} allows you to restrict access to a service. 

In this tutorial, learn how to grant your Data team `read-only` access to your production database.

## Before you start

You need:

- A project with a database service
- A `viewer` user on your project

## 1. Add a read-only endpoint to your database service

Edit your `{{< vendor/configfile "services" >}}` file and add the following [endpoints](/add-services/mysql/_index.md#define-permissions):

- `website` with `admin` access to the `main` database
- `reporting` with read-only `ro` access to the `main` database

```yaml {configFile="services"}
maindb:
    type: mariadb:10.5
    disk: 2048
    configuration:
        schemas:
            - main
        endpoints:
            website:
                default_schema: main
                privileges:
                    main: admin
            reporting:
                privileges:
                    main: ro
```

## 2. Grant your app access to the new endpoints

Edit your app configuration and add new relationships to your new endpoints:

```yaml {configFile="app"}
relationships:
    database: 
        service: maindb
        endpoint: website
    reports:
        service: maindb
        endpoint: reporting
```

## 3. Create a worker with access to the read-only endpoint

Edit your app configuration to add a new worker which:

- Does nothing (`sleep infinity`) 
- Can access the read-only `reporting` endpoint
- Allows SSH access to `viewer`

```yaml {configFile="app"}
workers:
    data_access:
        size: S
        disk: 128
        mounts: {}
        commands:
            start: |
                sleep infinity
        relationships:
            reports:
                service: maindb
                endpoint: reporting
        access:
            ssh: viewer
```

You're done!
From now on, your `viewer` users can SSH in to the worker application,
and connect to your database with read-only permissions.