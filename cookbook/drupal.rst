Drupal
======

Setting up your Drupal development with Platform.sh
---------------------------------------------------

This guide will teach you how to set up local Drupal development for use with Platform.sh.

### Prerequisites

To succeed with Platform.sh you need the following installed on your local machine:

* Git
* Composer
* `platform CLI tool <https://github.com/platformsh/platformsh-cli>`_
* MariaDB (or MySQL) database
* Optional: Solr, Redis

You will also need to have signed up for a `Platform.sh <https://platform.sh>`_ project.

### Goals

1. Use the Platform CLI to obtain your project’s repository
2. Settings.php (understand how Platform manages it)
3. Drush Aliases (Platform makes them for you)
4. Synchronize databases and files with Platform.sh
5. Use the Platform CLI to build your project 

### Use the Platform CLI to obtain your project’s repository

The Platform CLI will authenticate you with Platform.sh and show your projects. For example, if my Platform.sh project is this:
https://eu.platform.sh/projects/x7mougrk7bcq6/

I can obtain a local copy of the project like this:

Run the platform command:



Use platform get [ID] to get a project



Now you can see the local directory structure that the Platform CLI provides for your local development:

The repository directory is your local checkout of the Platform.sh Git repository.
The shared directory is for your local settings.php file which will allow you to connect to your local database. See the section below about Settings.php
The builds directory contains built copies of the Drupal site. This is relevant when you use Drush Make files to assist in your site building.
The www symlink is created by the platform build command and will always reference the latest build in the builds directory. The www directory should become your DOCROOT for local development.
The .platform-project file is metadata for the platform tool.

### Settings.php

An important step in setting up your local environment is editing shared/settings.local.php. It is in this file that your local database connection details can be set. (NOTE: If there is no shared/settings.local.php file, create one following the example here, and re-run platform build) The platform build command will generate a sites/default/settings.php file with each build of your application (when using Drush Make files). The shared/settings.local.php file will also be symlinked into the www/sites/default directory, where the generated settings.php can include it.

Example code from the generated settings.php:

.. code-block:: console
	$local_settings = dirname(__FILE__) . '/settings.local.php';
	if (file_exists($local_settings)) {
	  include $local_settings;
	}

The above code (found in the generated settings.php) shows how the shared/settings.local.php gets included in the built application.


### Drush Aliases
The platform tool generates and maintains Drush Aliases that allow you to issue remote Drush commands on any environment (branch) that is running on Platform.sh. After you have run platform build, there is also a Drush Alias for your local site. 

For example, on my site, here are my Drush Aliases:


### Change the Drush alias group

You can set the Drush alias group name to something more convenient:

.. code-block:: console
	$ platform drush-aliases -g robshouse

### Synchronize Databases and Files with Platform.sh

Given the Drush aliases shown above, I can now use a normal Drush command to synchronize my local database with the data from my Master environment online:

.. code-block:: console
	$ drush sql-sync @robshouse.master @robshouse._local

In the same style, use Drush to grab the uploaded files from the files directory and pull them into your local environment:

.. code-block:: console
	$ drush rsync @robshouse.staging:%files @robshouse._local:%files

### Use the Platform CLI to build your project 

Drupal sites have two separate build modes. In the “Vanilla” build mode, you commit all of your Drupal files (sans settings.php, which you should let Platform generate) into your git repository (NOTE: Never commit the uploaded files in your files directory - these never go into Git). In this build mode, running platform build will take care of creating symlinks with the local shared directory but nothing more.

The other build mode is when you use a directory structure like this and a Drush Make file to build your project. This is the best way! In this build mode, platform build will first execute the Drush Make file, and then move the other assets (modules, themes, libraries) into the newly built www/sites/default/ directory. It will then take care of the symlinks with the local shared directory.

### IDE specific tips:

MAMP pro:

In order for MAMP to work well with the symlinks created by the `platform CLI tool <https://github.com/platformsh/platformsh-cli>`_, add the following to the section under Hosts > Advanced called “Customized virtual host general settings.”

.. code-block:: console

	<Directory />
	        Options FollowSymLinks
	        AllowOverride All
	</Directory>

	.. seealso::
	   * :ref:`Laravel Forum Archives <http://forumsarchive.laravel.io/viewtopic.php?pid=11232#p11232>`_

last update: |today|
