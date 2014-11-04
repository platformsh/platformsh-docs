.. _platform_actions:

Platform.sh main actions
========================

You can see on the top right of the :ref:`platform_ui` the main actions that you can use to interface with your :ref:`environments`.

.. image:: /overview/images/icon-branch.png
  :alt: Branch

.. _branch:

Branch
------

Branching an :term:`environment` means creating an exact copy of that :term:`environment`.

A Platform branch includes code, and also the services that are needed to run the whole application. This means that when you branch an :term:`environment`, you also branch the complete infrastructure. A fork will be done of all the services, their configuration as well as their data.

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

Note that ``sync`` is only available if your branch has no unmerged commits, and can be fast-forwarded. On ``sync``, your code branch will be fast-forwarded to its parent's tip, and the data (e.g. databases) of the services on the branch will be overwritten with an exact copy of the parent's. Syncing of data and code can be done individually, so if desired, you can benefit from having only code changes applied for instance.

.. image:: /overview/images/icon-backup.png
  :alt: Backup

.. _backup_restore:

Backup & Restore
----------------

Backing up an :term:`environment` means saving a copy of the database, so that it could be restored, if need be.

.. warning::

   * Restoring environments is not yet available in the :term:`Platform UI`.

.. image:: /overview/images/icon-git.png
  :alt: Push

.. _push:

Push
----

Pushing code to a branch will update the code repository and also automatically triggers a rebuild of the application that is running on the infrastructure branch that was pushed to.

Which means you can test a new service, a different module version, or any specific configuration by simply pushing code to your Git repository.

During a ``push``, here is what happens:

* The code repository is updated
* The branch is deployed
* The application is rebuilt
