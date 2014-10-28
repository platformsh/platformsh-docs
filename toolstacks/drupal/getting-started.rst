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
    When building as a profile, you **need a make file for Drupal core** called: ``project-core.make``. See :ref:`_drush_make_files`_.

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
    ... (Drupal files)
    includes/
    profiles/
    modules/
      contrib/
      custom/
    themes/
      contrib/
      custom/
    libraries
      contrib/
      custom/

Configure your app
------------------

Platform.sh uses configuration files to determine what toolstack you want to deploy and how you want to deploy it.

.. seealso::
  * :ref:`configuration_files`

If you're working with Drupal, your ``.platform.app.yaml`` should target the "php:drupal" toolstack. You can find an example of a Drupal specific ``.platform.app.yaml`` file on `Github <https://github.com/platformsh/platform-drupal/blob/master/.platform.app.yaml>`_.