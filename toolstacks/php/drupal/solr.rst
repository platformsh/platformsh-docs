.. _drupal_solr:

Using Solr with Drupal 7.x
==========================

Requirements
------------

You will need to add the `Search API <https://www.drupal.org/project/search_api>`_ and `Search API Solr <https://www.drupal.org/project/search_api_solr>`_ modules to your project.

If you are using a make file, you can add those lines to your ``project.make``:

.. code-block:: ini

   projects[search_api][version] = 1.13
   projects[search_api_solr][version] = 1.x-dev

.. seealso::
  * :ref:`drush_make_files`
   
Configuration
-------------

Go to ``/admin/config/search/search_api`` and click on *Add Server*. Give the server a name and a description.

* Server class: *Solr service*
* Solr host: ``solr.internal``
* Solr port: ``8080``
* Solr path: ``/solr``

.. todo::
   Apache Solr Module