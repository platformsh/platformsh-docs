.. _environment_variables:

Environment variables
=====================

Platform.sh exposes :term:`environment variables` which you can interact with.

When you're logging via SSH to an environment, you can list the variables of an environment by running:

.. code-block:: console

	web@kjh43kbobssae-master--php:~$ export

Since they are **base64-encoded JSON object** that maps variable names to variable values, you can decode the value of a specific variable by running:

.. code-block:: console

	web@kjh43kbobssae-master--php:~$ php5 -r 'print_r(json_decode(base64_decode(getenv("PLATFORM_RELATIONSHIPS"))));'

	stdClass Object
	(
	    [solr] => Array
	        (
	            [0] => stdClass Object
	                (
	                    [ip] => 250.0.80.135
	                    [host] => solr.internal
	                    [scheme] => solr
	                    [port] => 8080
	                )
	        )
	    [database] => Array
	        (
	            [0] => stdClass Object
	                (
	                    [username] =>
	                    [password] =>
	                    [ip] => 250.0.80.112
	                    [host] => database.internal
	                    [query] => stdClass Object
	                        (
	                            [is_master] => 1
	                        )

	                    [path] => main
	                    [scheme] => mysql
	                    [port] => 3306
	                )
	        )
	)

.. note::
	:term:`environment variables` are **configurable** directly from the :ref:`platform_ui` under the *Variables* tab of the configuration page of the environment. 

.. note::
	:term:`environment variables` are **hierarchical**, so if a variable is not defined in an environment, it will take the value it has in the parent environment and use it as ``inherited``.

Platform.sh variables
---------------------

:term:`Environment variables` that are specific to Platform.sh are exposed in the runtime (*ie. PHP*) and prefixed with ``PLATFORM_*``.

* **PLATFORM_RELATIONSHIPS**: A base64 encoded JSON object which keys are the relationship name and the values are arrays of relationship endpoint definitions. Each relationship endpoint definition is a decomposed form of a URL. It has a ``scheme``, a ``host``, a ``port``, and optionally a ``username``, ``password``, ``path`` and some additional information in ``query``.
* **PLATFORM_ROUTES**: Describe the routes that you defined in the environment. It maps the content of the ``.platform/routes.yaml`` file.
* **PLATFORM_PROJECT**: The ID of the project.
* **PLATFORM_ENVIRONMENT**: The name of the environment (*ie. the name of the branch in Git*).
* **PLATFORM_TREE_ID**: The ID of the tree the application was built from. It's essentially the SHA of the tree in Git.
* **PLATFORM_VARIABLES**: A base64 encoded JSON object which keys are variables names and values are variable values (*a string*).
* **PLATFORM_APPLICATION**: A base64 encoded JSON object that describes the application. It maps the content of the ``.platform.app.yaml`` that you have in Git and it has a few subkeys.

Since values can change over time, the best thing is to just introspect the variable at runtime and use it to configure your application.

For example with Drupal, we use the **PLATFORM_RELATIONSHIPS** variable to configure your ``settings.local.php``.

Toolstack specific variables
----------------------------

You can define variables based on the :term:`toolstack` you're working with.

For example with Drupal, you would prefix your :term:`Environment variables` with ``drupal:``. Those variables will then be special-cased by our ``settings.local.php`` and directly added to ``$conf``.

An example variable:

* ``drupal:site_name`` which will directly set the site name of your Drupal site on an environment.


