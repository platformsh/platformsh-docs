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

Backups are triggered via the web UI or via the CLI.

Platform.sh will automatically create a snapshot backup of the Master environment on a daily basis.

.. note::
  If you increase the storage space of your services, take a backup soon after. 

.. rubric:: Platform.sh Enterprise

Platform.sh Enterprise backups are run daily. Backups are retained for a month.

In parallel we run EBS snapshots every four hours. Those snapshots are kept for seven days.

Restore
-------

Commerce Guys can restore from backup for you. Request a restore by opening a ticket which contains the name of the environment to restore.


last update: |today|

