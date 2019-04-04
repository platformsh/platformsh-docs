# Web Interface

Platform.sh provides a responsive Web Interface which allows you to interact with your projects and manage your environments. Everything you can do with this interface you can also achieve with the  [CLI (Command Line Interface)](/gettingstarted/cli.md) and vice versa.

![Web Interface](/images/platform-ui.png)

## Updates - Platform.sh Management Console

Platform.sh has released our newly designed Management Console, which will soon replace our this Web Interface. You can access the updated documentation on our main site [here](https://docs.platform.sh/).

## Environment List

Each of the environments of your projects are available on the left sidebar.

The name of the environment is strikethroughed if it's been disabled. If it has an arrow next to it, this means the environment has children.

## Activity Feed

The Web Interface displays all the activity happening on your environments. You can filter messages per type.

## Header


The Web Interface exposes 5 main actions that you can use to interface with your environments.

![Header](/images/ui-header.png)

### Git

The Git icon displays the commands to use to get your project set up locally with the CLI or clone the codebase via Git.

------------------------------------------------------------------------

![Branch](/images/icon-branch.png)

### Branch

Branching an environment means creating a new branch in the Git repository, as well as an exact copy of that environment.

The new branch includes code, all of the data that is stored on disk (database, Solr indexes, uploaded files, etc.), and also a new copy of the running services (and their configuration) that the application needs. This means that when you branch an environment, you also branch the complete infrastructure.

During a `branch`, three things happen:

* A new branch is created in Git.
* The application is rebuilt on the new branch, if necessary.
* The new branch is deployed.

------------------------------------------------------------------------

![Merge](/images/icon-merge.png)

### Merge

Merging an environment means introducing the code changes from a branch to its parent branch and redeploying the parent.

During a `merge`:

* The code changes are merged via Git to the parent branch.
* The application is rebuilt on the parent branch, if necessary.
* The parent branch is deployed.

Rebuilding the application is not necessary if the same code was already built (for any environment): in this case you will see the message ``Slug already built for this tree id, skipping``.

------------------------------------------------------------------------

![Sync](/images/icon-sync.png)

### Sync

Synchronizing means updating the child environment with the code and/or data of its parent and redeploying the child environment.

Note that `sync` is only available if your branch has no unmerged commits, and can be fast-forwarded. On `sync`, your code branch will be fast-forwarded to its parent's tip, and the data (e.g. databases) of the services on the branch will be overwritten with an exact copy of the parent's. Syncing of data and code can be done individually, if desired, so you can benefit from having only code changes applied.

![image](/images/icon-backup.png)

### Snapshot & Restore

Creating a snapshot for an environment means saving a copy of the database so that it can be restored (in other words, create a backup). You will see the snapshot in the activity feed of you environment in the Platform.sh Web Interface where you can trigger the restore by
clicking on the `restore` link.

You can also use the CLI with:

```bash
$ platform environment:backup
```

to create a snapshot, and

```bash
$ platform environment:restore
```

to restore an existing snapshot.
