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

For example, the current default storage amount per project is 5GB (meaning 5120MB) which you can distribute between your application (as defined in `.platform.app.yaml`) and each of its services.  For memory-resident-only services such as `memcache` or `redis`, the `disk` key is not available and will generate an error if present.

{{< note >}}
Currently we do not support downsizing the persistent disk of a service.
{{< /note >}}

### Size

By default, Platform.sh will allocate CPU and memory resources to each container automatically.  Some services are optimized for high CPU load, some for high memory load.  By default, Platform.sh will try to allocate the largest "fair" size possible to all services, given the available resources on the plan.  That is not always optimal, however, and you can customize that behavior on any service or on any application container.  See the [application sizing](/configuration/app/size.md) page for more details.

## Service timezones

All services have their system timezone set to UTC by default.  In most cases that is the best option.  For some applications it's possible to change the application timezone, which will affect only the running application itself.

* MySQL - You can change the per-connection timezone by running SQL `SET time_zone = <timezone>;`.
* PostgreSQL - You can change the timezone of current session by running SQL `SET TIME ZONE <timezone>;`.

## Using the services

In order for a service to be available to an application in your project (Platform.sh supports not only multiple backends but also multiple applications in each project) you will need to refer to it in the [.platform.app.yaml](/configuration/app/_index.md) file which configures the *relationships* between applications and services.

## Endpoints

All services offer one or more `endpoints`.  An endpoint is simply a named set of credentials that can be used to give access to other applications and services in your project to that service.  Only some services support multiple user-defined endpoints.  If you do not specify one then one will be created with a standard defined name, generally the name of the service type (e.g., `mysql` or `solr`).  An application container, defined by a `.platform.app.yaml` file, always exposes an endpoint named `http` to allow the [router](/configuration/routes/_index.md) to forward requests to it.

When defining relationships in a configuration file you will always address a service as `<servicename>`:`<endpoint>`.  See the appropriate service page for details on how to configure multiple endpoints for each service that supports it.

## Connecting to a service

Once a service is running and exposed as a relationship, its appropriate credentials (host name, username if appropriate, etc.) will be exposed through the `PLATFORM_RELATIONSHIPS` environment variable.  The structure of each is documented on the appropriate service's page, along with sample code for how to connect to it from your application. Note that different applications manage configuration differently so the exact code will vary from one application to another.

Be aware that the keys in the `PLATFORM_RELATIONSHIPS` structure are fixed but the values they hold may change on any deployment or restart.  Never hard-code connection credentials for a service into your application.  You should re-check the environment variable every time your script or application starts.

Access to the database or other services is only available from within the cluster.  For security reasons, they cannot be accessed directly.  However, they can be accessed over an SSH tunnel.  There are two ways to do so.  (The example here uses MariaDB but the process is largely identical for any service.)

### Obtaining service credentials

In either case, you will also need the service credentials.  For that, run `platform relationships`.  That will give output similar to the following:

```yaml
redis:
    -
        service: rediscache
        ip: 246.0.82.19
        cluster: jyu7waly36ncj-master-7rqtwti
        host: redis.internal
        rel: redis
        scheme: redis
        port: 6379
database:
    -
        username: user
        scheme: mysql
        service: mysqldb
        ip: 246.0.80.37
        cluster: jyu7waly36ncj-master-7rqtwti
        host: database.internal
        rel: mysql
        path: main
        query:
            is_master: true
        password: ''
        port: 3306
```

That indicates that the `database` relationship can be accessed at host `database.internal`, user `user`, and an empty password.  The `path` key contains the database name, `main`.  The other values can be ignored.

{{< note >}}
When using the default endpoint on MySQL/MariaDB, the password is usually empty. It will be filled in if you define any custom endpoints. As there is only one user and port access is tightly restricted, the lack of a password does not create a security risk.
{{< /note >}}

### Open an SSH tunnel directly

The first option is to open an SSH tunnel for all of your services.  You can do so with the Platform.sh CLI, like so:

```bash
$ platform tunnel:open
SSH tunnel opened on port 30000 to relationship: redis
SSH tunnel opened on port 30001 to relationship: database
Logs are written to: ~/.platformsh/tunnels.log

List tunnels with: platform tunnels
View tunnel details with: platform tunnel:info
Close tunnels with: platform tunnel:close
```

The `tunnel:open` command will connect all relationships defined in the `.platform.app.yaml` file to local ports, starting at 30000.  You can then connect to those ports on `localhost` using the program of your choice.

The `platform tunnels` command will list all open tunnels:

```text
+-------+---------------+-------------+-----------+--------------+
| Port  | Project       | Environment | App       | Relationship |
+-------+---------------+-------------+-----------+--------------+
| 30000 | a43m75zns6k4c | master      | [default] | redis        |
| 30001 | a43m75zns6k4c | master      | [default] | database     |
+-------+---------------+-------------+-----------+--------------+
```

In this example, we would connect to `localhost:30001`, database name `main`, with username `user` and an empty password.

### Using an application tunnel

Alternatively, many database applications (such as MySQL Workbench and similar tools) support establishing their own SSH tunnel.  Consult the documentation for your application for how to enter SSH credentials, including telling it where your SSH private key is.  (Platform.sh does not support password-based SSH authentication.)

To get the values to use, the easiest way is to run `platform ssh --pipe`.  That will return a command line that can be used to connect over SSH, from which you can pull the appropriate information.  For example:

`jyu7waly36ncj-master-7rqtwti--app@ssh.us.platform.sh`

In this case, the username is `jyu7waly36ncj-master-7rqtwti--app` and the host is `ssh.us.platform.sh`.  Note that the host will vary per region, and the username will vary per *environment*.

In this example, we would configure our database application to set up a tunnel to `ssh.us.platform.sh` as user `jyu7waly36ncj-master-7rqtwti--app`, and then connect to the database on host `database.internal`, username `user`, empty password, and database name `main`.
