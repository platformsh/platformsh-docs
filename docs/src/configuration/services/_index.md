---
title: "Services"
weight: 3
description: |
  Platform.sh allows you to completely define and configure the topology and services you want to use on your project.
sidebarTitle: "Services (services.yaml)"
layout: single
---

{{< description >}}

Unlike other PaaS services, Platform.sh is **batteries included** which means that you don't need to subscribe to an external service to get a cache or a search engine. And that those services are managed. When you back up your project, all of the services are backed-up. **Services** are configured through the `.platform/services.yaml` file you will need to commit to your Git repository. This section describes specifics you might want to know about for each service."

If you do not need additional services, you can leave the `.platform/services.yaml` file empty. This is the recommended approach for a static website.

![Services](/images/management-console/relationships.png "0.50")

Here is an example of a `.platform/services.yaml` file:

```yaml
database1:
    type: mysql:10.1
    disk: 2048

database2:
    type: postgresql:9.6
    disk: 1024
```

## Configuration

### Name

The `name` you want to give to your service. You are free to name each service as you wish (*lowercase alphanumeric only*).

{{< note >}}
Because we support multiple services of the same type (you can have 3 different MySQL instances), changing the name of the service in `services.yaml` will be interpreted as destroying the existing service and creating a new one. This will make **all the data in that service disappear forever**. Remember to always back up your environment in which you have important data before modifying this file.
{{< /note >}}

### Type

The `type` of your service. It's using the format `type:version`.

If you specify a version number which is not available, you'll see this error when pushing your changes:

```bash
Validating configuration files.
E: Error parsing configuration files:
    - services.mysql.type: 'mysql:5.6' is not a valid service type.
```

Service types and their supported versions include:
<!--
To update the versions in this table, use docs/data/registry.json
-->
{{< readFile file="src/registry/images/tables/services_supported.md" markdownify="true">}}

### Disk

The `disk` attribute is the size of the persistent disk (in MB) allocated to the service.

For example, the current default storage amount per project is 5GB (meaning 5120MB) which you can distribute between your application (as defined in `.platform.app.yaml`) and each of its services.
For memory-resident-only services such as `memcache` or `redis`, the `disk` key is not available and will generate an error if present.

{{< note >}}

Downsizing a service's persistent disk isn't currently supported
in the [`eu.platform.sh`](/guides/general/region-migration.md)
and [`us.platform.sh`](/guides/general/region-migration.md) regions.

{{< /note >}}

### Size

By default, Platform.sh will allocate CPU and memory resources to each container automatically.
Some services are optimized for high CPU load, some for high memory load.
By default, Platform.sh will try to allocate the largest "fair" size possible to all services, given the available resources on the plan.
That is not always optimal, however, and you can customize that behavior on any service or on any application container.
See the [application sizing](/configuration/app/size.md) page for more details.

## Service timezones

All services have their system timezone set to UTC by default.
In most cases that is the best option.
For some applications it's possible to change the application timezone, which will affect only the running application itself.

* MySQL - You can change the per-connection timezone by running SQL `SET time_zone = <timezone>;`.
* PostgreSQL - You can change the timezone of current session by running SQL `SET TIME ZONE <timezone>;`.

## Using the services

In order for a service to be available to an application in your project (Platform.sh supports not only multiple backends but also multiple applications in each project) you will need to refer to it in the [`.platform.app.yaml`](/configuration/app/_index.md) file which configures the *relationships* between applications and services.

## Endpoints

All services offer one or more `endpoints`.
An endpoint is a named set of credentials that can be used to give access to other applications and services in your project to that service.
Only some services support multiple user-defined endpoints.
If you do not specify one then one will be created with a standard defined name, generally the name of the service type (e.g., `mysql` or `solr`).
An application container, defined by a `.platform.app.yaml` file, always exposes an endpoint named `http` to allow the [router](/configuration/routes/_index.md) to forward requests to it.

When defining relationships in a configuration file you will always address a service as `<servicename>`:`<endpoint>`.
See the appropriate service page for details on how to configure multiple endpoints for each service that supports it.

## Connect to a service

Once a service is running and exposed as a relationship,
its appropriate credentials (such as the host, username, and password) are available through the `PLATFORM_RELATIONSHIPS` environment variable.
The structure of each is documented on the appropriate service's page along with sample code for how to connect to it from your application.

The keys in the `PLATFORM_RELATIONSHIPS` variable are fixed, but the values may change on deployment or restart.
So you should check the environment variable every time your script or app starts.

Access to the database or other services is only available from within the cluster.
For security reasons, they can't be accessed directly.

To connect to a service, you need the [service credentials](#obtain-service-credentials).
Then you can connect with an [SSH tunnel](../../development/ssh/_index.md#connect-to-services).

### Obtain service credentials

To get the credentials for a given service, run the following command
(replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with appropriate values):

```bash
$ platform relationships -p <PROJECT_ID> -e <ENVIRONMENT_NAME>
database:
    -
        username: user
        scheme: mysql
        service: database
        fragment: null
        ip: 246.0.80.37
        hostname: e3wffyxtwnrxujeyg5u3kvqi6y.database.service._.us.platformsh.site
        public: false
        cluster: jyu7waly36ncj-main-7rqtwti
        host: database.internal
        rel: mysql
        query:
            is_master: true
        path: main
        password: ''
        type: 'mariadb:10.5'
        port: 3306
        host_mapped: false
        url: 'mysql://user:@database.internal:3306/main'
```

With this example, you can connect to the `database` relationship
with the user `user`, an empty password, and the database name `main` (from the `path`).

### Connect to the tunnel

Once you have [opened a tunnel](../../development/ssh/_index.md#connect-to-services), you can use it to connect to your service.

If you have a direct tunnel, you might connect to `127.0.0.1:30000` to the `main` database with the username `user` and an empty password.

If you have an app tunnel, you might SSH to `ssh.us.platform.sh` as user `jyu7waly36ncj-main-7rqtwti--app`
and then connect to host `database.internal` to the `main` database with the username `user` and an empty password.
