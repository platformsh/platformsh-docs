#Services
Services are configured through the [.platform/services.yaml](reference/services-yaml.md)
file you will need to commit to your git repository. This section describes
specificities you might want to know about, for each service.


## MySQL

* Supported Versions: 5.5

** notes: ** 

1. There is a single MySQL user, so you can not use "DEFINER" Access Control 
    mechanism for Stored Programs and Views
2. MySQL Errors such as "PDO Exception 'MySQL server has gone away'" are usually
    simply the result of exhausting your existing diskspace. Be sure you have
    sufficient space allocated to the service in [.platform/services.yaml](reference/services-yaml.md)

##PostgreSQL 

* Supported Versions: 9.3

##ElasticSearch
* Supported Versions:  0.9 (*default*), 1.4

## Redis

* Supported Versions: 2.8

** notes: ** 

1. Redis is configured to serve as a cache, its storage is not persistent. You
    should not use it as a database.

## Solr

* Supported Versions: 3.6 (*default*), 4.10
