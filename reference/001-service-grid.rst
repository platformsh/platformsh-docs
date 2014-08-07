.. _service_grid:

Introduction to the service grid
================================

The Services Grid allows us to separate functionality and scale the services, as needed

+--------------+----------+-------------------+------+
| Service      | Software | Host              | Port |
+==============+==========+===================+======+
| Database     | MariaDb  | database.internal | 3306 |
+--------------+----------+-------------------+------+
| Search       | Solr     | solr.internal     | 8080 |
+--------------+----------+-------------------+------+
| Object Cache | Redis    | redis.internal    |      |
+--------------+----------+-------------------+------+
