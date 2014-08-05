Local setup
===========

There are 3 ways you can structure your files depending on how you're building your site.

File Structure
--------------

Profile
^^^^^^^

If your project contains a profile file: ``*.profile``, Platform builds your project in profile mode. This is similar to what Drupal.org does to build distributions. Everything you have in your repository will be copied to your ``profile/[name]`` folder.

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

Project
^^^^^^^

If your project doesn’t contain a profile file, but contains a make file: ``project.make``, Platform builds your project using Drush make. Everything you have in your repository will be copied to your ``sites/default`` folder.

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

Vanilla
^^^^^^^

In any other case, Platform builds your project as-is. In that case, you are expected to have a ``index.php`` at the root of your repository.

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

.. _drush_make:

Drush .make Files
-----------------

Platform can automatically build your site using make files. This allows you to easily test specific versions, apply patches and keep your site up to date. It also keeps your working directory much cleaner, since it only contains your custom code.

Simply name your make file:

.. code-block:: console

    project.make

And place all the contributed projects (modules, libraries, themes, etc...) you need on your site. 

Here is a sample make file which includes Drupal core with a patch applied to it and the Platform indicator module:

.. code-block:: console

    api = 2
    core = 7.x

    projects[drupal][type] = core
    projects[drupal][patch][] = "https://drupal.org/files/issues/install-redirect-on-empty-database-728702-36.patch"

    ; Platform indicator module.
    projects[platform][version] = "1.2"
    projects[platform][subdir] = "contrib"

.. note::
   You can also have a specific make file for Drupal core: ``project-core.make``. This is useful if you're building your site as an installation profile.
