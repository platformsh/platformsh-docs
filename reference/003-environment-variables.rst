Environment variables
=====================

Platform exposes :term:`environment variables` to the runtime environment (ie. PLATFORM_*) which allow you to define any specific configuration at the environment level.

You can edit those :term:`environment variables` directly from the Platform UI under the ``Variables`` tab of the configuration page of the environment.

Runtime
-------

* :term:`Environment variables` are exposed in the runtime (ie. PHP) with the PLATFORM_VARIABLES environment variable. It's a base64-encoded JSON object that maps variable names to variable values.

Hierarchy
---------

* :term:`Environment variables` are resolved following the environment hierarchy. If a variable is not defined in an environment, it takes the value of its parent.

Drupal $conf
------------

* :term:`Environment variables` prefixed by ``drupal:`` are special-cased by our ``settings.local.php``: they are directly added to ``$conf``.

For example, you can set ``drupal:site_name`` which will directly set the site name.
