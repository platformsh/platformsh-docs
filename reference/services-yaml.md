# `.platform/services.yaml`
## Configure Services

Platform.sh allows you to completely define and configure the topology
and services you want to use on your project.

Unlike other PaaS services, Platform.sh is *batteries included* which means
that you don't need to subscribe to an external service to get a cache or
a search engine. And that those services are managed. When you back up your
project, all of the services are backed-up.

The topology is stored into a `services.yaml` file which should be added
inside the `.platform` folder at the root of your Git repository.

If you don't have a `.platform` folder, you need to create one:

```bash
$ mkdir .platform
$ touch .platform/services.yaml
```

Here is an example of a `services.yaml` file:

```yaml
database1:
  type: mysql:5.5
  disk: 2048

database2:
  type: postgresql:9.3
  disk: 1024
```

This configuration will give you a MySQL with 2GB of disk space, and a Postgres instance with 1GB allocated.
You are free to name each service as you wish (*lowercase alphanumeric only*). Usually you will see in our examples that we simply call the mysql: `mysql`. Note that you can have multiple instances of each services.

In order for a service to be available to an application in your project 
(Platform.sh supports not only multiple backends but also multiple 
applications in each project) you will need to refer to it in the 
`.platform.app.yaml` file which configures the Relationships between 
applications and services, [documented here](/user_guide/reference/platform-app-yaml.html).

## Defaults

If you do not have a `services.yaml` file the following default one will be loaded:

```yaml
mysql:
    type: mysql:5.5
    disk: 2048

redis:
    type: redis:2.8

solr:
    type: solr:3.6
    disk: 1024
```

> **note**
> We do not currently support persistence for Redis.

## Supported Services

We currently support the following services:
* MySQL **mysql**: 5.5
* PostgreSQL **postgresql**: 9.3
* ElasticSearch **elasticsearch**: 0.9 (*default*), 1.4
* Redis **redis**: 2.8
* Solr **solr**: 3.6 (*default*), 4.10
* MongoDB **mongodb**: 2.6 (in beta not generally available)

If no version number is specified, the *default* one will be deployed.

If the version number specified isn't available, you'll see this error when pushing your changes:
```bash
Validating configuration files.
E: Error parsing configuration files:
    - services.mysql.type: 'mysql:5.6' is not a valid service type.
```