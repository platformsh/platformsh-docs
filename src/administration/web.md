# Management Console

Platform.sh provides a responsive management console which allows you to interact with your projects and manage your environments. 

![Management Console](/images/Project.png)

Everything you can do with the management console you can also achieve with the  [CLI (Command Line Interface)](/gettingstarted/cli.md) and vice versa.

## Environment List

From your project's main page, each of the environments are available from the pull-down menu `ENVIRONMENTS` at the top of the page. 

![Environment Pull-down](/images/env_pulldown.png)

There is also a graphic view of your environments on the right hand side, where you can view your environments as a list or as a project tree. 

![Environment Activity](/images/envs.png)

The name of the environment is strikethroughed if it's been disabled. If it has an arrow next to it, this means the environment has children.

## Activity Feed

The management console displays all the activity happening on your environments. You can filter messages per type.

![Environment Activity](/images/activity.png)


## Header

Within a project`s environment, the management console exposes 4 main actions and 4 drop-down command options that you can use to interface with your environments. 

![Header](/images/header_new.png)

### Button Actions

#### Branch

![Header Branch](/images/header_branch.png)

Branching an environment means creating a new branch in the Git repository, as well as an exact copy of that environment.

The new branch includes code, all of the data that is stored on disk (database, Solr indexes, uploaded files, etc.), and also a new copy of the running services (and their configuration) that the application needs. This means that when you branch an environment, you also branch the complete infrastructure.

During a `branch`, three things happen:

* A new branch is created in Git.
* The application is rebuilt on the new branch, if necessary.
* The new branch is deployed.

After clicking `Branch` a dialog box will appear that will provide commands to execute future merges from the command line using the [Platform.sh CLI](/gettingstarted/cli.md).

![Branch confirmation cli](/images/header_branch_box.png)

#### Merge

![Header Merge](/images/header_merge.png)

Merging an environment means introducing the code changes from a branch to its parent branch and redeploying the parent.

During a `merge`:

* The code changes are merged via Git to the parent branch.
* The application is rebuilt on the parent branch, if necessary.
* The parent branch is deployed.

Rebuilding the application is not necessary if the same code was already built (for any environment): in this case you will see the message ``Slug already built for this tree id, skipping``.

After clicking `Merge` a dialog box will appear that will provide commands to execute future merges from the command line using the [Platform.sh CLI](/gettingstarted/cli.md).

![Merge confirmation cli](/images/header_merge_box.png)

#### Sync

![Header Sync](/images/header_sync.png)

Synchronizing means updating the child environment with the code and/or data of its parent and redeploying the child environment.

After clicking `Sync` a dialog box will appear that will provide commands to execute future merges from the command line using the [Platform.sh CLI](/gettingstarted/cli.md).

![sync confirmation cli](/images/header_sync_box.png)

Note that `Sync` is only available if your branch has no unmerged commits, and can be fast-forwarded. On `Sync`, your code branch will be fast-forwarded to its parent's tip, and the data (e.g. databases) of the services on the branch will be overwritten with an exact copy of the parent's. Syncing of data and code can be done individually, if desired, so you can benefit from having only code changes applied.

#### Backup

![Header Backup](/images/header_backup.png)

Creating a snapshot for an environment means saving a copy of the database so that it can be restored (in other words, create a backup). You will see the snapshot in the activity feed of you environment in the Platform.sh management console where you can trigger the restore by
clicking on the `restore` link.

After clicking `Backup` a dialog box will appear that will provide commands to execute future merges from the command line using the [Platform.sh CLI](/gettingstarted/cli.md).

![Backup confirmation cli](/images/header_backup_box.png)

You can also use the CLI with:

```bash
$ platform environment:backup
```

to create a snapshot, and

```bash
$ platform environment:restore
```

to restore an existing snapshot.

### Command Pull-downs

#### URLs

![Header URL](/images/header_url.png)

The URLs pull-down exposes the domains that can be used to access application environments from the web.

#### GIT

![Header Git](/images/header_git.png)

The Git pull-down displays the commands to use to clone the codebase via Git.

#### CLI

![Header CLI](/images/header_cli.png)

The CLI pull-down displays the commands to get your project set up locally with the Platform.sh CLI.

#### SSH

![Header SSH](/images/header_ssh.png)

The SSH pull-down display the commands to access your project over SSH.
