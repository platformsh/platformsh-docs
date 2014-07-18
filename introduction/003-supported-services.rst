Supported services
==================

PHP
----

Supports PHP 5.3 and 5.4, the APC and ZO+ opcode caches, and all major PHP extensions, rewriting, and mapping.

MySQL
-----
MariaDB with the XtraDB storage engine (equivalent to MySQL with InnoDB)

| **host:** database.internal
| **port:** 3306
| **username:** [blank]
| **password:** [blank]

Access to MariaDB is only possible from the PHP-FPM containers, thus username/password based authentication is not used.

To access the MariaDB database directly, ssh into the web server and use the following command:
``mysql -h database.internal``

You can also use Drush:
``drush sql-cli``

Redis
-----
Provides the in-memory object cache for your application.

| **host:** redis.internal
| **scheme:** redis
| **port:** 6379

Solr
----
Solr search with generic schemas provided. Custom schemas are supported.

| **host:** solr.internal
| **scheme:** solr
| **port:** 8080

Other
-----
Additional services will be available soon...
