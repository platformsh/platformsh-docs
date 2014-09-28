Backup and Restore 
==================

Backup
------

Manual backup
^^^^^^^^^^^^^

Backups are triggered directly via the web UI or via the CLI. The backup creates a complete snapshot of the environment. It includes all the services (MySQL, SOLR...) and files.

.. note::
  You should backup your live environment before merging an environment to the live environment.

If you're using the CLI, you can run:

.. code-block:: console

   $ platform environment:backup

Automated backups
^^^^^^^^^^^^^^^^^

.. rubric:: Platform.sh Standard

Backups are triggered via the web UI or via the CLI.

A daily EBS backup is generated automatically, but it's not as reliable as the snapshots that will be created if you back up your work. I suggest you do that for now.

.. note::
  If you increase the storage space of your services, take a backup soon after. If we restore from an old backup, you get the size of that old backup.

.. rubric:: Platform.sh Enterprise

If your site it running on Platform.sh Enterprise, then we run a daily backup around 2AM CET. Those backus are kept for a month.

In parallel we run EBS snapshots every four hours. Those snapshots are kept for seven days.

Restore
-------

Commerce Guys restore from backup for you. Request a restore by opening a ticket which contains the name of the environment to restore.
