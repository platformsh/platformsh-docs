# Import your own code

## Configure services

In the previous step, you created a collection of empty configuration files that have given your project the following structure:

```.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── .platform.app.yaml
└── < application code >
```

Now you will need to include information that will tell Platform.sh how you want your application to connect to its [services](/configuration/services.md). An example `.platform/services.yaml` will look something like this:

`.platform/services.yaml`

{% codesnippet "https://raw.githubusercontent.com/platformsh/language-examples/master/.platform/services.yaml", language="yaml" %}{% endcodesnippet %}

If you're application does not use any services at this point, you can leave it blank, but it must exist in your repository to run on Platform.sh. If your application does use a database or other services, you can configure them with the following attributes:

* `name`: Provide a name for the service, so long as it is alphanumeric. If your application requires multiple services of the same type (i.e., three MySQL databases), make sure to give them different names so that your data from one service is never overwritten by another (i.e., `mysqldb1`, `mysqldb2`, `mysqldb3`).

* `type`: This specifies the service type and its version using the format `type:version`. Consult the table below that lists all Platform.sh maintained services, along with their `type` and supported `version`s. The links will take you to each service's dedicated page in the documentation.

| **Service**                                                    | **`type`**        | **Supported `version`**             |
|----------------------------------------------------------------|-------------------|-------------------------------------|
| [Elasticsearch](/configuration/services/elasticsearch.md)      | `elasticsearch`   | 5.3, 5.4, 6.5                       |
| [Headless Chrome](/configuration/services/headless-chrome.md)  | `chrome-headless` | 73                                  |
| [InfluxDB](/configuration/services/influxdb.md)                | `influxdb`        | 1.2, 1.3, 1.7                       |
| [Kafka](/configuration/services/kafka.md)                      | `kafka`           | 2.1                                 |
| [Memcached](/configuration/services/memcached.md)              | `memcached`       | 1.4                                 |
| [MongoDB](/configuration/services/mongodb.md)                  | `mongodb`         | 3.0, 3.2, 3.4, 3.6                  |
| [MariaDB](/configuration/services/mysql.md)                    | `mysql`           | 10.0, 10.1, 10.2                    |
| [MySQL](/configuration/services/mysql.md)                      | `oracle-mysql`    | 5.7, 8.0                            |
| [Network Storage](/configuration/services/network-storage.md)  | `network-storage` | 1.0                                 |
| [PostgreSQL](/configuration/services/postgresql.md)            | `postgresql`      | 9.6, 10, 11                         |
| [RabbitMQ](/configuration/services/rabbitmq.md)                | `rabbitmq`        | 3.5, 3.6, 3.7                       |
| [Redis](/configuration/services/redis.md)                      | `redis`           | 3.2, 4.0, 5.0                       |
| [Solr](/configuration/services/solr.md)                        | `solr`            | 3.6, 4.10, 6.3, 6.6, 7.6, 7.7, 8.0  |
| [Varnish](/configuration/services/varnish.md)                  | `varnish`         | 5.2, 6.0                            |


* `disk`: The `disk` attribute configures the amount of persistent disk that will be allocated between all of your services. Projects by default are allocated 5 GB (5120 MB), and that space can be distributed across all of your services.

> Each language and framework may have additional attributes that you will need to include in `.platform/services.yaml` depending on the needs of your application. To find out what else you may need to include to configure your services, consult
>
> * **The [Services](/configuration/services.md) documentation for Platform.sh**
>
>    The documentation goes into far more extensive detail of which attributes can also be included for service configuration, and should be used as your primary reference.  
>
> * **Language-specific templates for Platform.sh Projects**
>
>    Compare the `.platform/services.yaml` file from the simple template above to other templates when writing your own.


Platform.sh provides _managed services_, and each service comes with considerable default configuration that you will not have to include yourself in `.services.yaml`. Next,
you will next need to tell Platform.sh how to build and deploy your application using the `.platform.app.yaml` file.

<div class="buttons">
  <a href="#" class="button-link prev">Back</a>
  <a href="#" class="button-link next">I have configured my services</a>
</div>
