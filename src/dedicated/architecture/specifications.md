## Platform.sh Enterprise cluster specifications

## Architecture

Platform.sh Enterprise clusters are launched into a Triple Redundant configuration consisting of 3 virtual machines (VMs).  This is an N+1 configuration that is sized to withstand the total loss of any one of the 3 members of the cluster without incurring any downtime.  Each instance hosts the entire application stack, allowing this architecture superior fault tolerance to traditional N-Tier installations. Moreover, the Cores assigned to production are solely for production.

## Storage

Each enterprise cluster comes with 50GB of storage per environment by default.  This storage is intended for customer data - databases, search indexes, user uploaded files, etc. - and can be subdivided in any way that the customer wishes.  50GB is only the default amount; more storage can be added easily as a line item in the contract and can be added at anytime that the project requires: at contract renewal or at any point in the term.

Default storage is based on the default SSD block-storage offering for each cloud. Extra provisioned IOPS can be discussed with your sales representative.

## Compatible services

| Service        | Versions                 |
| ---------------|:------------------------:|
| PHP            | 5.6, 7.0, 7.1 (ZTS)      |
| NodeJS         | 9.8                      |
| [MariaDB](https://docs.platform.sh/configuration/services/mysql.html)        | 10.0 Galera, 10.1 Galera |
| [RabbitMQ](https://docs.platform.sh/configuration/services/rabbitmq.html)       | 3.6                      |
| [Solr](https://docs.platform.sh/configuration/services/solr.html)           | 4.10, 6.3                |
| [ElasticSearch](https://docs.platform.sh/configuration/services/elasticsearch.html)  | 1.7, 2.4, 5.2            |
| [Redis](https://docs.platform.sh/configuration/services/redis.html)          | 3.2                      |
| [Memcached](https://docs.platform.sh/configuration/services/memcached.html)      | 1.4                      |

Your application will be able to connect to each service by referencing the exact same environment variables as on Platform.sh Professional.  While the configuration of the service will be performed by our team, the application configuration is the same and your code should be the same.  See the [Platform.sh Professional documentation](https://docs.platform.sh/configuration/services.html) for service-specific details.
