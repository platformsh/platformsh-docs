Platform.sh main actions
========================

The ui\_overview exposes 5 main actions that you can use to interface
with your environments.

![image](/overview/images/icon-git.png)

Git
---

The Git icon displays the commands to use to clone or pull your Git
repository locally.

------------------------------------------------------------------------

![image](/overview/images/icon-branch.png)

Branch
------

Branching an environment means creating a new branch in the Git
repository, as well as an exact copy of that environment.

The new branch includes code, all of the data that is stored on disk
(database, Solr indexes, uploaded files, etc.), and also a new copy of
the running services (and their configuration) that the application
needs. This means that when you branch an environment, you also branch
the complete infrastructure.

During a `branch`, three things happen:

-   A new branch is created in Git
-   The new branch is deployed
-   The application is rebuilt

------------------------------------------------------------------------

![image](/overview/images/icon-merge.png)

Merge
-----

Merging an environment means introducing the code changes from a branch
to its parent branch and redeploying the parent environment.

During a `merge`:

-   The code changes are merged via Git to the parent branch
-   The parent branch is deployed
-   The application is rebuilt

------------------------------------------------------------------------

![image](/overview/images/icon-sync.png)

Sync
----

Synchronizing means updating the child environment with the code and/or
data of its parent and redeploying the child environment.

Note that `sync` is only available if your branch has no unmerged
commits, and can be fast-forwarded. On `sync`, your code branch will be
fast-forwarded to its parent's tip, and the data (e.g. databases) of the
services on the branch will be overwritten with an exact copy of the
parent's. Syncing of data and code can be done individually, so if
desired, you can benefit from having only code changes applied.

![image](/overview/images/icon-backup.png)

Snapshot & Restore
------------------

Creating a snapshot for an environment means saving a copy of the
database, so that it could be restored (in other words, create a
backup). You will see the snapshot in the activity feed of you
environment in the Platform UI where you can trigger the restore by
clicking on the `restore` link.

You can also use the CLI with:

```bash
platform environment:backup
```

to create a snapshot, and

```bash
platform environment:restore
```

to restore an existing snapshot.

