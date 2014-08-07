.. _drupal_redis:

Using Solr with Drupal 7.x
==========================

Search API
----------

You will need to add the module and the library to your make file to make use of Redis

.. code-block:: ini

   projects[search_api][version] = 1.13
   projects[search_api_solr][version] = 1.x-dev
   
Configuration
^^^^^^^^^^^^^

admin/config/search/search_api

Click Add Server

Give the server a name and description

* Server class: *Solr service*

* Solr host: ``solr.internal``
* Solr port: ``8080``
* Solr path: ``/solr``

Apache Solr Module
------------------

