Backup and Restore 
==================

Backup
------

Manual backup
^^^^^^^^^^^^^

Backups are triggered directly via the web UI or via the CLI. The backup creates a complete snapshot of the environment. It includes all persistent data from all running services (MySQL, SOLR...) and any files stored on the mounted volumes.

.. note::
  Make backups of your live environment before merging an environment to the live environment.

Using the CLI:

.. code-block:: console

   $ platform environment:backup

Automated backups
^^^^^^^^^^^^^^^^^

.. rubric:: Platform.sh Standard

No backup is triggered automatically on Platform.sh Standard. You can trigger your backup via the web UI or via the CLI. 

If you want to automatize your backups, you can use Jenkins and trigger the following CLI command:

.. code-block:: console

   $ platform environment:backup

.. note::
  We advise you to backup your environment each time you increase the storage space of your services.

.. rubric:: Platform.sh Enterprise

Platform.sh Enterprise backups are run daily. Backups are retained for a month.

In parallel we run EBS snapshots every four hours. Those snapshots are kept for seven days.

Restore
-------

Commerce Guys can restore from backup for you. Request a restore by opening a ticket which contains the name of the environment to restore.


last update: |today|

