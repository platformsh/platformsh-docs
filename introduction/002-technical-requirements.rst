Technical Requirements & Recommendations
########################################

.. todo:: Blurb about requirements/recommendations on Platform. Generic. Minimal requirements should be emphasized. Maybe a bit about why Platform uses Git.

Requirements
************

The only technical requirements for developing on Platform are **Git** and **SSH**.

* :ref:`Git <git>` is the version control system used by Platform. You will need to have it installed to be able to interact with your codebase on Platform.

* An :ref:`SSH <ssh>` public/private keypair is required to interact with Platform using :ref:`Git <git>`.

.. seealso::
   * :ref:`Generating an SSH keypair <ssh_genkeypair>`

Recommendations
***************

.. rubric:: Drupal

Although Platform is created to work with many web technologies, it has been optimized for developing with `Drupal <http://drupal.org>`_. Platform utilizes :ref:`Drush <drush>` to streamline the Drupal development process and it is recommended that you are familiar with Drush so you can understand and take advantage of these services.

.. rubric:: Platform CLI

Commerce Guys has developed the :ref:`Platform CLI <cli>` to give you the ability to use and manage all of your Platform projects from the command line, including branching, merging, performing backups, etc.
