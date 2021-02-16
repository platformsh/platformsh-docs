---
title: "Renaming the default branch"
sidebarTitle: "Rename the default branch"
description: |
    Platform.sh considers `master` to be the default branch for all projects, making Master the default production environment. Soon you will be able to select your default branch during the project creation steps, but until that time this guide will show you how to manually make the switch yourself. 
---

{{< description >}}

You can complete some of these steps through the management console, but since all can be completed with the CLI those commands alone are listed. Be sure to [install the CLI](/development/cli/_index.md#installation) if you have not already done so. It's assumed you are changing the default branch of your project on Platform.sh from `master` to `main`. If using another name for the default branch, update the commands accordingly. 

## Projects without external integrations

The steps below assume:

- You already have a project on Platform.sh containing your code.
- No external [source integrations](/integrations/source/_index.md) have been set up for the project. That is, the Platform.sh project contains your primary remote repository for the site. 

### 1. Create the Main environment

To start, create a new environment off `master` called `main`:

```bash
$ platform environment:branch main master --title=Main -p <Project ID> --force
```

{{< note >}}
The CLI assumes that you are running this command within a local copy of your repository, so the `--force` flag is included above to bypass that.
{{< /note >}}

`main` is currently the child of `master`, so use the below command to remove its parent and make it a top-level branch:

```bash
$ platform environment:info -p <Project ID> -e main parent -
```

At this point, all of your environments, active and inactive, are still children of `master`. In the next step, you will deactivate `master`, which will not work if it still has child environments associated with it. Before going any further, take the time to update each environment's parent to `main`:

```bash
$ platform environment:info -p <Project ID> -e <BRANCH> parent main
```

![Update the parent environment](/images/management-console/main-newparent.png "0.75")

### 2. Reconfigure the default branch

First, you will need to deactivate the `master` environment with the following CLI command:

```bash
$ platform environment:delete master --no-delete-branch -p <Project ID>
```

Once `master` has been deactivated, you can then set the project's `default_branch` property to `main`:

```bash
$ platform project:info default_branch main -p <Project ID>
```

Finally, delete the `master` enviroment completely. 

```bash
$ platform environment:delete master --delete-branch -p <Project ID>
```

## Setting up an external integration on a new project

The steps below assume:

- You have an external repository on GitHub, GitLab, or BitBucket you are trying to integrate with Platform.sh.
- That repository's default branch is not `master`.

### 1. Create a new project

First, create an empty project with the Platform.sh CLI command `platform create`:

```bash
$ platform create --title='Main Project' --region=us-3.platform.sh --plan=development --environments=3 --storage=5 --no-set-remote
```

This will create a new project with `master` as the default branch by default. Modify the flags to fit your use case, or skip them and the CLI will ask you to set them individually during creation. Copy the `Project ID` provided when the command completes, and substitute the value in the steps below. You can also visit the provided management console URL for the project (i.e. `https://console.platform.sh/<USER>/<Project ID>`) to verify the steps as you go along.

The project you just created is empty, that is, there is no code initialized on it's Master environment. You will need to have something on that environment to begin with in order to create the `main` branch, so you can initialize it with a template for now:

```bash
$ platform environment:init -p <Project ID> -e master https://github.com/platformsh-templates/hugo.git
```

Then, create the "Main" environment:

```bash
$ platform environment:branch main master --title=Main -p <Project ID> --force
```

{{< note >}}
The CLI assumes that you are running this command within a local copy of your repository, so the `--force` flag is included above to bypass that.
{{< /note >}}

### 2. Deactivate the Master environment

You will need to deactivate the `master` environment with the following CLI command:

```bash
$ platform environment:delete master --no-delete-branch -p <Project ID>
```

{{< note >}}
Deactivating any environment is a [destructive operation](/administration/web/configure-environment.md#status), and can result in data loss. Since you are deactivating what was once the production branch for your site, it's recommended that you perform the switch to a new default branch during non-peak hours for your site. As always, be sure to take a [backup](/administration/backup-and-restore.md#backups) of `master` beforehand; you can always [restore this backup](/administration/backup-and-restore.md#restore) to `main` afterwards. 
{{< /note >}}

### 3. Make "Main" the default branch

First, update the project's `default_branch` property to `main`:

```bash
$ platform project:info default_branch main -p <Project ID>
```

At this point, while the repository considers `main` to be the default branch for the project, `master` is still considered to be the parent branch of `main`. You can change this by updating `main` to have a parent of `null` with the command:

```bash
$ platform environment:info -p <Project ID> -e main parent -
```

You have already deactivated Master, so all that's left now is to delete the `master` branch from the remote repository with one final authenticated request.

```bash
$ platform environment:delete master --delete-branch -p <Project ID>
```

You will then be left with "Main" as your top-level parent environment for the project.

![Default environment main](/images/management-console/defaultbranch-main.png "0.75")

### 4. Setup the integration 

Place the command to integrate Platform.sh with your external [GitHub](/integrations/source/github.md), [GitLab](/integrations/source/gitlab.md), or [BitBucket](/integrations/source/bitbucket.md) repository that has already been set up with `main` as the default branch. Select the settings you would like for the integration, but in most cases the default settings are best. The last stage will provide a warning: 

```bash
Warning: adding a 'github' integration will automatically synchronize code from the external Git repository.
This means it can overwrite all the code in your project.

Are you sure you want to continue? [y/N] y
```

which will override the code on the "Main" environment - the template you started with - with the contents of the `main` branch of your external repository. You can now consult the rest of the [migration steps](/tutorials/migrating.md) to finish migrating your site to Platform.sh.

## Updating externally integrated projects

The steps below assume:

- You have already integrated an external repository GitHub, GitLab, or BitBucket.
- You are trying to safely change the name of your default branch from `master` to `main` on both your external repository and on a Platform.sh project.

### 1. Create the `main` branch

Within your local copy of the external repository, create the main branch and push:

```bash
$ git checkout master && git pull origin master
$ git checkout -b main
$ git push origin main
```

Then activate it on Platform.sh

```bash
$ platform environment:activate main -p <Project ID>
```

### 2. Clean up repository

Most external services do not yet automatically remap to a new default branch, and in order to preserve your data on Platform.sh, it's best to take a moment to prepare all of your work in progress around `master` to instead compare to `main`. 

First, close any open pull requests and resubmit them against `main`. Be sure to rebase your local brances with `git rebase --onto main master` if you still plan on continuing to work on them after the default branch switch. Once you resubmit them, they will appear under the "main" environment on Platform.sh. 

![Resubmitted PRs](/images/management-console/resubmit-prs.png "0.75")

### 3. Change the default branch on the external Git service

Platform.sh supports external Git integrations to a number of services, so follow the linked instructions below for changing the default branch to `main` for your provider:

- [GitHub](https://github.com/github/renaming)
- [GitLab](https://docs.gitlab.com/ee/user/project/repository/branches/#default-branch)
- [BitBucket](https://community.atlassian.com/t5/Bitbucket-questions/How-to-change-MAIN-branch-in-BitBucket/qaq-p/977418#:~:text=In%20Bitbucket%20Cloud%2C%20please%20go,repository%20details%20%3E%3E%20Main%20branch.)

### 4. Deactivate the Master environment

You will need to deactivate the `master` environment. Since it is currently the default branch, it is protected, and so the normal `platform environment:delete` CLI command will not work at this stage. This restriction will soon be removed, but for now you can get around this by placing an authenticated cURL request on the project's API with the following CLI command to deactivate it:

```bash
$ platform project:curl -X POST -p <Project ID> environments/master/deactivate 
```

{{< note >}}
Deactivating any environment is a [destructive operation](/administration/web/configure-environment.md#status), and can result in data loss. Since you are deactivating what was once the production branch for your site, it's recommended that you perform the switch to a new default branch during non-peak hours for your site. As always, be sure to take a [backup](/administration/backup-and-restore.md#backups) of `master` beforehand; you can always [restore this backup](/administration/backup-and-restore.md#restore) to `main` afterwards. 
{{< /note >}}

### 5. Make "Main" the default branch

Update the project's `default_branch` property with another authenticated request:

```bash
$ platform project:info default_branch main -p <Project ID>
```

At this point, while the repository considers `main` to be the default branch for the project, `master` is still considered to be the parent branch of `main`. You can change this by updating `main` to have a parent of `null` with the command:

```bash
$ platform environment:info -p <Project ID> -e main parent -
```

![Make main a parent](/images/management-console/existing-parentnull.png "0.75")

You can now delete the `master` branch from your external repository.
