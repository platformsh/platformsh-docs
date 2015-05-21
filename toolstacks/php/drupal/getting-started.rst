Getting Started
===============

Structure your files
--------------------

Platform.sh is very flexible and allows you to structure your files as you wish within your Git repository, and will build your project based on how your files are organized.

Here are the three build modes that can happen:

* **Profile**: Platform.sh builds your project like Drupal.org does for distributions.
* **Project**: Platform.sh builds your make file using *drush make*. You don't need any Drupal core files nor any contributed modules, themes or libraries within your Git repository.
* **Vanilla**: Platform.sh builds your project as it is in your Git repository. You can push all Drupal files and contributed modules, themes or libraries.

Profile mode
^^^^^^^^^^^^

If your repository contains a ``.profile`` file, Platform.sh builds your project in profile mode. This is similar to what Drupal.org does to build distributions. Everything you have in your repository will be copied to your ``profiles/[name]`` folder.

This build mode supports having a ``project.make`` file for your contributed modules, themes or libraries.

.. note::
    When building as a profile, you **need a make file for Drupal core** called: ``project-core.make``. See :ref:`drush_make_files`.

.. code-block:: console

    .git/
    project.make
    project-core.make
    my_profile.info
    my_profile.install
    my_profile.profile
    modules/
      features/
        my_feature_01/
        ...
      custom/
        my_custom_module/
        ...
    themes/
      custom/
        my_custom_theme/
        ...
    libraries/
      custom/
        my_custom_libraries/
        ...
    translations/
      ...

Project mode
^^^^^^^^^^^^

If your repository doesn’t contain a ``.profile`` file, but contains a make file called: ``project.make`` (or even ``drupal-org.make``), Platform.sh builds your project using Drush make. Everything you have in your repository will be copied to your ``sites/default`` folder.

.. code-block:: console

    .git/
    project.make
    modules/
      features/
        my_feature_01/
        ...
      custom/
        my_custom_module/
        ...
    themes/
      custom/
        my_custom_theme/
        ...
    libraries/
      custom/
        my_custom_libraries/
        ...
    translations/
      ...

Vanilla mode
^^^^^^^^^^^^

Platform.sh accepts your project's files. You are expected to have an ``index.php`` file at the root of your repository.

.. code-block:: console

    .git/
    index.php
    ... (other Drupal core files)
    sites/
      all/
        modules/
        themes/
      default/

Configure your app
------------------

Platform.sh uses configuration files to determine what toolstack you want to deploy and how you want to deploy it.

Drupal 7
^^^^^^^^

For Drupal 7, your ``.platform.app.yaml`` should specify the ``php:drupal`` toolstack. You can see a `working example on Github <https://github.com/platformsh/platformsh-examples/tree/drupal/7.x>`__.

.. seealso::
  * :ref:`configuration_files`
  * `Drupal 7 .platform.app.yaml <https://github.com/platformsh/platformsh-examples/blob/drupal/7.x/.platform.app.yaml>`_

Drupal 8
^^^^^^^^

For Drupal 8, your ``.platform.app.yaml`` should specify the ``php:drupal`` toolstack, and install Drush 7 RC as a build-time dependency:

.. code-block:: console

    # Note: Drush 7.0.0 is no longer compatible with Drupal 8, but the
    # pre-release -rc versions were.
    dependencies:
        php:
            "drush/drush": "7.0.0-rc2"

You can see a `working example on Github <https://github.com/platformsh/platformsh-examples/tree/drupal/8.x>`__.

.. seealso::
  * :ref:`configuration_files`
  * `Drupal 8 .platform.app.yaml <https://github.com/platformsh/platformsh-examples/blob/drupal/8.x/.platform.app.yaml>`_
