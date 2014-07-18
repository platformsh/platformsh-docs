Components of the Hosting Stack
===============================
:term:`Environments <environment>` rely on :term:`services <service>`, which are deployed inside highly restricted :term:`containers <container>` on a grid of servers. Monitoring and fail-over happen automatically, behind the scenes.

:term:`Services <service>` are grouped together in *virtual clusters*, and dynamically keep track of each other.

.. image:: /platform-components/images/service-grid.png
  :alt: Service Grid
  :align: center

.. todo::
   * We need to write an entry for the Entry Point Service.

Router Service
--------------
Based on nginx, the Router Service processes HTTP requests, handles security, dynamic page construction (ESI), URL rewriting and mapping.

PHP Service
-----------
Supports PHP 5.3 and up, the APC and ZO+ opcode caches, and all major PHP extensions, rewriting and mapping.

Database Service (MariaDb)
--------------------------
Transactional data storage. Based on MariaDB, supporting the XtraDB storage engine.

File System
-----------
Accessible transparently from PHP and mappable to a URL space by the Router component.

Search Service (Solr)
---------------------
Solr search engine. Generic schemas provided, along with support for custom schemas.

Object Cache (Redis)
--------------------
Redis, configured as an in-memory data store; can be used as a cache area for your application.

.. todo::
   * We need to write an entry for SSL.
