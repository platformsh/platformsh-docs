---
title: "Add a database"
weight: -130
description: |
  Once Your Express application has been deployed on {{% vendor/name %}}, you might want to add a service to your application.
---

{{% description %}}

{{% vendor/name %}} projects already include a [variety of services](/add-services.html#available-services) so you don’t have to subscribe to an external cache or search-engine services.
And as these services are included in your project, you can manage them through Git and they’re backed up along with the rest of your project.
Your project source code defines the services configuration in the main `.{{% vendor/cli %}}/config.yaml` file and this is where you can add new services.

As an example on how to do so, to add a [MariaDB database engine](/add-services/mysql.html) into your Express project, complete the following 4 steps:

## Create a new branch

## Add a MariaDB service
Configure the MariaDB service by adding this Yaml definition at the end of your `.{{% vendor/cli %}}/config.yaml` file:

```yaml
# .{{% vendor/cli %}}/config.yaml
{{< code-link destination="/add-services.html#available-services" text="services" title="Click to see the complete list of all available services" >}}:
  db:
    type: mariadb:10.4
```

Connect the service to your application ``app`` by adding a relationships settings into your ``app`` definition, within your .{{% vendor/cli %}}/config.yaml file:
```yaml
# .{{% vendor/cli %}}/config.yaml
applications:
  app:
    type: nodejs:18
    {{< code-link destination="/create-apps/app-reference.html#relationships" text="relationships" title="The relationships of the application with services or other applications. The left-hand side is the name of the relationship as it will be exposed to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand side is in the form `<service name>:<endpoint name>`." >}}:
      database: "db:mysql"
```

Commit your change:
```shell
git add . && git commit -m "adding MariaDb database service"
{{% vendor/cli %}} push
```

{{< note >}}
{{% vendor/name %}} will now read your configuration files, and begin building your application image. **Your push
will fail**; don't worry, this is expected. At this point {{% vendor/cli %}} is not aware of the resources
our new service needs. We need to tell it what kind of CPU, Memory, and disk to assign to the service container.

Please complete [Configure resources for your service](#configure-resources-for-your-service) step
{{< /note >}}

## Configure resources for your service
First time you push a new service to your project, it will fail, and you will need to allocate resources to it.
 Back in your terminal, run:

```shell
$ {{% vendor/cli %}} resource:set --size db:0.5 --disk db:512
Resource configuration for the project FHK Test Express 0926 (12345azerty), environment feat-database (type: development):
+------------------+------+-----+-------------+-----------+-----------+
| App or service   | Size | CPU | Memory (MB) | Disk (MB) | Instances |
+------------------+------+-----+-------------+-----------+-----------+
| app | 1    | 1   | 384         | N/A       | 1         |
| db               | 0.5  | 0.5 | 1408        | 512       | 1         |
```


## Configure your Express to use database






Configure your Express project to use it following the [official documentation](https://expressjs.com/en/guide/database-integration.html#mysql).

**TODO**: add a resource allocation process (or link) here

Then [deploy](#deploy) your modification and you’re good to go!

## Tip&Tricks
You can get the service information using the following command:
```shell
$ {{% vendor/cli %}} relationships
  ...
  database:
    -
      username: user
      scheme: mysql
      service: database
      fragment: null
      ip: 198.51.100.37
      hostname: abcdefghijklm1234567890123.database.service._.eu.{{% vendor/cli %}}.site
      #TODO maybe add a new params.yaml settings as it should be platformsh.site or friday.site
      public: false
      cluster: abcdefgh1234567-main-abcd123
      host: database.internal
      rel: mysql
      query:
        is_master: true
      path: main
      password: ''
      type: 'mariadb:10.6'
      port: 3306
      host_mapped: false
      url: 'mysql://user:@database.internal:3306/main'
```




