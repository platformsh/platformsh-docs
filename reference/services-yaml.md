# `.platform/services.yaml`
## Configure Services

Platform.sh allows you to completely define and configure the topology
and services you want to use on your project.

Unlike other PaaS services, Platform.sh is "batteries included" which means
that you don't need to subscribe to an external service to get a cache or
a search engine. And that those services are manages. When you back up your
project all of the services are backed-up.

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
  type: mysql
  disk: 2048
database2:
  type: postgresql
  disk: 1024
```
This one will give you a MySQL with 2GB of disk space and a Postgres instance 
with 1GB allocated.
You are free to call each service as you wish (lowercase alphanumeric only), 
usually you will see in examples we simply call the mysql a 'mysql' you can
have multiple instances of each. 

In order for a service to be available to an application in your project 
(Platform.sh supports not only multiple backends but also multiple 
applications in each project) you will need to refer to it in the 
`.platform.app.yaml` file which configures the Relationships between 
applications and services, [documented here](/reference/platform-app-yaml.html).

**Available services**

* MySQL 5.5
* PostgreSQL 9.3
* ElasticSearch 0.90 and 1.4
* Redis 2.8
* Solr 3.6 and 4.10
* MongoDB 2.6 (in beta not generally available)

We are adding new services all the time.

## Defaults
If you do not have a `routes.yaml` file the following default one will be loaded:

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

## Supported versions

For some services, you can specify the version you want to use using the ``type`` key.

```yaml
solr:
    type: "solr:4.10"
```

**Solr**:
* 3.6 (default)
* 4.10

**ElasticSearch**
* 0.9 (default)
* 1.4
