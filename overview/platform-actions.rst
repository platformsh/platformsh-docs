.. _platform_actions:

Platform.sh main actions
========================

The :ref:`platform_ui` exposes 5 main actions that you can use to interface with your :ref:`environments`.

.. image:: /overview/images/icon-git.png
  :alt: Git

Git
---

The Git icon displays the commands to use to clone or pull your Git repository locally.

------------

.. image:: /overview/images/icon-branch.png
  :alt: Branch

.. _branch:

Branch
------

Branching an :term:`environment` means creating a new branch in the Git repository, as well as an exact copy of that :term:`environment`.

The new branch includes code, all of the data that is stored on disk (database, Solr indexes, uploaded files, etc.), and also a new copy of the running services (and their configuration) that the application needs. This means that when you branch an :term:`environment`, you also branch the complete infrastructure. 

During a ``branch``, three things happen:

* A new branch is created in Git
* The new branch is deployed
* The application is rebuilt

------------

.. image:: /overview/images/icon-merge.png
  :alt: Merge

.. _merge:

Merge
-----

Merging an :term:`environment` means introducing the code changes from a branch to its parent branch and redeploying the parent environment.

During a ``merge``:

* The code changes are merged via Git to the parent branch
* The parent branch is deployed
* The application is rebuilt

------------

.. image:: /overview/images/icon-sync.png
  :alt: Sync

.. _sync:

Sync
----

Synchronizing means updating the child :term:`environment` with the code and/or data of its parent and redeploying the child environment.

Note that ``sync`` is only available if your branch has no unmerged commits, and can be fast-forwarded. On ``sync``, your code branch will be fast-forwarded to its parent's tip, and the data (e.g. databases) of the services on the branch will be overwritten with an exact copy of the parent's. Syncing of data and code can be done individually, so if desired, you can benefit from having only code changes applied.

.. image:: /overview/images/icon-backup.png
  :alt: Backup

.. _backup_restore:

Backup & Restore
----------------

Backing up an :term:`environment` means saving a copy of the database, so that it could be restored, if need be.

.. warning::

   * Restoring environments is not yet available in the :term:`Platform UI`.