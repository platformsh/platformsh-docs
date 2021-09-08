---
title: "Management console"
weight: 4
layout: single
description: |
  Platform.sh provides a responsive management console which allows you to interact with your projects and manage your environments.
---

{{< description >}}

![Management Console](/images/management-console/project.png "0.5")

Everything you can do with the management console you can also achieve with the [CLI (Command Line Interface)](/development/cli/_index.md).

## Environment List

From your project's main page, each of the environments are available from the pull-down menu `ENVIRONMENT` at the top of the page.

![Environment Pull-down](/images/management-console/env-pulldown.png "0.4")

There is also a graphic view of your environments on the right hand side, where you can view your environments as a list or as a project tree.

![Environment Activity](/images/management-console/environments.png "0.5")

The name of the environment is struck out if it's been disabled. If it has an arrow next to it, this means the environment has children.

## Environments

Once you select an environment, the management console can give you a great deal of information about it.

### Activity Feed

The management console displays all the activity happening on your environments. You can filter messages per type.

![Environment Activity](/images/management-console/activity.png "0.5")

### Header

Within a project's environment, the management console exposes 4 main actions and 4 drop-down command options that you can use to interface with your environments.

![Header](/images/management-console/header-new.png "0.5")

#### Branch

Branching an environment means creating a new branch in the Git repository, as well as an exact copy of that environment.

The new branch includes code, all of the data that is stored on disk (database, Solr indexes, uploaded files, etc.), and also a new copy of the running services (and their configuration) that the application needs. This means that when you branch an environment, you also branch the complete infrastructure.

During a `branch`, three things happen:

* A new branch is created in Git.
* The application is rebuilt on the new branch, if necessary.
* The new branch is deployed.

After clicking `Branch` a dialog box will appear that will provide commands to execute future merges from the command line using the Platform.sh CLI.

![Branch confirmation cli](/images/management-console/header-branch-box.png "0.4")

#### Merge

Merging an environment means introducing the code changes from a branch to its parent branch and redeploying the parent.

During a `merge`:

* The code changes are merged via Git to the parent branch.
* The application is rebuilt on the parent branch, if necessary.
* The parent branch is deployed.

Rebuilding the application is not necessary if the same code was already built (for any environment): in this case you will see the message `Slug already built for this tree id, skipping`.

After clicking `Merge` a dialog box will appear that will provide commands to execute future merges from the command line using the Platform.sh CLI.

![Merge confirmation cli](/images/management-console/header-merge-box.png "0.4")

#### Sync

Synchronization performs a merge from a parent into a child environment, and then redeploys that environment.
You have the option of performing a Sync on only the code, replacing the data (i.e. databases) of that environment from its parent, or both.
These options are provided in a separate dialog box that will appear when you click the `Sync` button, along with the Platform.sh CLI commands that perform the same action.

![sync confirmation cli](/images/management-console/header-sync-box.png "0.4")

Be aware that sync uses the [Backup](/administration/backup-and-restore.md#backups-and-downtime) mechanism and will have the same caveats.

Note that `Sync` is only available if your branch has no unmerged commits, and can be fast-forwarded.

It is good practice to take a backup of your environment before performing a synchronization.

#### Backup

Creating a backup for an environment means saving a copy of the environment so that it can be restored. You will see the backup in the activity feed of your environment in the Platform.sh management console where you can trigger the restore by clicking on the `restore` link. For more information please refer [here](/administration/backup-and-restore.md).

After clicking `Backup` a dialog box will appear that will provide commands to execute future merges from the command line using the Platform.sh CLI.

![Backup confirmation cli](/images/management-console/header-backup-box.png "0.4")

You can also use the CLI with:

```bash
$ platform environment:backup
```

to create a backup, and

```bash
$ platform environment:restore
```

to restore an existing backup.

#### URLs

The URLs pull-down exposes the domains that can be used to access application environments from the web.

#### GIT

The "Git" pull-down displays the commands to use to clone the codebase via Git. If you are using Platform.sh as your primary remote repository, the command shown will clone from the project. Otherwise if you have set up an [external integration](/integrations/source/_index.md), the command will clone directly from the integrated remote repository.

If the project uses an external integration to a repository that you have not been given access to, you will not be able to clone until your access has been updated. See [User access and integrations](/administration/users.md#user-access-and-integrations) for more information.

#### CLI

The CLI pull-down displays the commands to get your project set up locally with the Platform.sh CLI.

#### SSH

The SSH pull-down displays the commands to access your project using SSH.

### Configuration settings

From the management console you can also view information about how your routes, services, and applications are currently configured for the environment.

At the top of the page, click the "Services" tab.

#### Applications

Select the application container on the left to show more detailed information for it on the right.

![Service tab - App Overview](/images/management-console/service-tab/app-overview.png "0.7")

The "Overview" tab gives you metadata information regarding the application. It tells you what size container it has been configured for, the amount of persistent disk, the number of active workers and cron jobs, and the command to SSH into that container.

![Service tab - App Crons](/images/management-console/service-tab/app-crons.png "0.7")

Each cron job associated with the application is listed with its frequency, the last time it was run, it's status, and its command.

![Service tab - App Configuration](/images/management-console/service-tab/app-configuration.png "0.7")

The "Configuration" tab provides an overview of the application's configuration pulled from its `.platform.app.yaml` file.

#### Services

Each service has a tab on the left, so select the one you are interested in.

![Service tab - Service Overview](/images/management-console/service-tab/service-overview.png "0.7")

The overview tab gives you metadata information regarding the service. It tells you what size container it has been configured for and the amount of persistent disk given to it in your `services.yaml` file.

![Service tab - Service Configuration](/images/management-console/service-tab/service-configuration.png "0.7")

The "Configuration" tab provides an overview of the service configuration that has been pulled from the `services.yaml` file.

#### Routes

![Service tab - Routes](/images/management-console/service-tab/routes.png "0.7")

Each route will appear when you select the Routes tab on the left and describe its type and whether caching and SSI have been enabled for it.

## Display settings

You are able to personalize the accessibility display settings for the management console, which can be updated on the first page of your account settings. Your account can be presented in one of three ways:

* Light mode (default)
* High contrast mode
* Dark mode

To meet our [commitment to accessibility](/security/wcag.md), all three options are compliant with level AA of the Web Content Accessibility Guidelines 2.0.
