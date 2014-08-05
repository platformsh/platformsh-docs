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

Toolstack
---------

You can define variables based on the :term:`toolstack` you're working with.

For example with Drupal, you would prefix your :term:`Environment variables` with ``drupal:``.

Those variables will then be special-cased by our ``settings.local.php`` and directly added to ``$conf``.

An example will be: ``drupal:site_name`` which will directly set the site name of your Drupal site.
