
Architecture
============

The 
:term:`Environments <environment>` in 
`Platform.sh <https://platform.sh>`_ rely on :term:`services <service>`.
Services are deployed inside highly restricted :term:`containers <container>` on a grid of servers. Monitoring and fail-over happen automatically, behind the scene.

:term:`Services <service>` are grouped together in *virtual clusters*, and dynamically keep track of each other.

.. image:: /overview/images/service-grid.png
  :alt: Service Grid
  :align: center

.. note::
	Platform.sh currently supports the following services: PHP, MySQL (MariaDB), Solr, Redis. Additional services will be available soon.

.. todo::
   * We need to write an entry for the Entry Point Service.

Micro container
---------------

Platform.sh uses LXC containers for applications. Each container provides a secure space to run one application. Each environment is built from many containers - one for the router, another for the PHP service, a third for the database and so on.


Router service
--------------

Based on nginx, the Router service processes HTTP requests, handles security, dynamic page construction (ESI), URL rewriting and mapping.


PHP service
-----------

Supports 5.4, the APC and ZO+ opcode caches, and all major PHP extensions, rewriting, and mapping.


Database service (MariaDB)
--------------------------

Transactional data storage. Based on MariaDB, supporting the XtraDB storage engine (equivalent to MySQL with InnoDB).

* **host:** database.internal
* **port:** 3306
* **username:** [blank]
* **password:** [blank]

Access to MariaDB is only possible from the PHP-FPM containers, thus username/password based authentication is not used.

To access the MariaDB database directly, ssh into the web server and use the following command:
``mysql -h database.internal``

You can also use Drush:
``drush sql-cli``


File system
-----------

Accessible transparently from PHP and mappable to a URL space by the Router component.

Search Service (Solr)
---------------------

Solr search with generic schemas provided. Custom schemas are supported.

* **host:** solr.internal
* **scheme:** solr
* **port:** 8080

Object cache (Redis)
--------------------

Provides the in-memory object cache for your application. Can be used as a cache area for your application.

* **host:** redis.internal
* **scheme:** redis
* **port:** 6379
