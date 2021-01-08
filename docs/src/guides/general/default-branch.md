---
title: "Renaming a project's root environment"
sidebarTitle: "Rename the root environment"
description: |
    By default, Platform.sh considers `master` to be the root branch for all projects, making Master the root and production environment. With this guide, you can change a `default_branch` property on your projects to match an externally integrated repository on GitHub, GitLab, or Bitbucket.
---

{{< description >}}

Soon you will be able to select your root branch during the project creation steps, but until that time this guide will show you how to manually make the switch yourself. You can complete some of these steps through the management console, but since all can be completed with the CLI those commands alone are listed. Be sure to [install the CLI](http://localhost:1313/development/cli.html#installation) if you have not already done so. It's assumed you are changing the default branch of your project on Platform.sh from `master` to `main`. If using another name for the default branch, update the commands accordingly. 

## New projects

The steps below assume:

- You have an external repository on GitHub, GitLab, or BitBucket you are trying to integrate with Platform.sh.
- That repository's default branch is not `master`.

### 1. Create a new project

First, create an empty project with the Platform.sh CLI command `platform create`:

```bash
$ platform create --title='Main Project' --region=us-3.platform.sh --plan=development --environments=3 --storage=5 --no-set-remote
```

This will create a new project with Master as the root environment by default. Modify the flags to fit your use case, or skip them and the CLI will ask you to set them individually during creation. Copy the `Project ID` provided when the command completes, and substitute the value in the steps below. You can also visit the provided management console URL for the project (i.e. `https://console.platform.sh/<USER>/<Project ID>`) to verify the steps as you go along.

The project you just created is empty, that is, there is no code initialized on it's Master environment. You will need to have something on that environment to begin with in order to create the `main` branch, so you can initialize it with a template for now:

```bash
$ platform environment:init -p <Project ID> -e master https://github.com/platformsh-templates/hugo.git
```

Then, create the "Main" environment:

```bash
$ platform environment:branch main --title=Main -p <Project ID> --force
```

{{< note >}}
The CLI assume that you are running this command within a local copy of your repository, so the `--force` flag is included above to bypass that.
{{< /note >}}

### 2. Deactivate the Master environment

Since Master is currently the root environment, it is protected, and so the normal `platform environment:delete` command will not work at this stage. To get around this, place an authenticated cURL request on the project's API with the CLI command to deactivate it:

```bash
$ platform project:curl -X POST -p <Project ID> environments/master/deactivate 
```

### 3. Make "Main" the parent environment

First, update the project's `default_branch` property with another authenticated request:

```bash
$ platform project:curl -X PATCH -p <Project ID> -d '{"default_branch": "main"}'
```

Then, update the "Main" environment's `parent` property to `null`. It's currently set to master, and the command below will update the project to - at this point - contain two parent environments: Master and Main.

```bash
$ platform environment:info -p <Project ID> -e main parent -
```

You have already deactivated Master, so all that's left now is to delete the `master` branch from the remote repository with one final authenticated request. It's still considered a parent environment and protected, so temporarily update its parent to `main` and then place the request to delete it.

```bash
$ platform environment:info -p <Project ID> -e master parent main
$ platform project:curl -X DEL -p <Project ID> environments/master
```

You will then be left with a single parent environment: Main. 

![Default environment main](/images/management-console/defaultbranch-main.png "0.75")

### 4. Setup the integration 

Place the command to integrate Platform.sh with your external [GitHub](/integrations/source/github.md), [GitLab](/integrations/source/gitlab.md), or [BitBucket](/integrations/source/bitbucket.md) repository. Select the settings you would like for the integration, but in most cases the default settings are best. The last stage will provide a warning: 

```bash
Warning: adding a 'github' integration will automatically synchronize code from the external Git repository.
This means it can overwrite all the code in your project.

Are you sure you want to continue? [y/N] y
```

which will override the code on the "Main" environment - the template you started with - with the contents of the `main` branch of your external repository. You can now consult the rest of the [migration steps](/tutorials/migrating.md) to finish migrating your site to Platform.sh.

## Updating existing projects

The steps below assume:

- You have already integrated an external repository GitHub, GitLab, or BitBucket.
- You are trying to safely change the name of your default branch from `master` to `main` on both your external repository and on Platform.sh.

### 1. Create the `main` branch

Within your local copy of the external repository, create the main branch and push:

```bash
$ git checkout master && git pull origin master
$ git checkout -b main
$ git push origin main
```

Then activate it on Platform.sh

```bash
platform environment:activate main -p <Project ID>
```

### 2. Clean up repository around the new parent

Most external services do not yet automatically remap to a new default branch, and in order to preserve your data on Platform.sh, it's best to take a moment to prepare all of your work in progress around `master` to instead compare to `main`. 

First, close any open pull requests and resubmit them against `main`. Be sure to rebase your local brances with `git rebase --onto main master` if you still plan on continuing to work on them after the default branch switch. Once you resubmit them, they will appear under the "main" environment on Platform.sh. 

![Resubmitted PRs](/images/management-console/resubmit-prs.png "0.75")

### 3. Change the default branch on the external Git service

Platform.sh supports external Git integrations to a number of services, so follow the linked instructions below for changing the default branch to `main` for your provider:

- [GitHub](https://github.com/github/renaming)
- [GitLab](https://docs.gitlab.com/ee/user/project/repository/branches/#default-branch)
- [BitBucket](https://community.atlassian.com/t5/Bitbucket-questions/How-to-change-MAIN-branch-in-BitBucket/qaq-p/977418#:~:text=In%20Bitbucket%20Cloud%2C%20please%20go,repository%20details%20%3E%3E%20Main%20branch.)

### 4. Deactivate the Master environment

Master is currently the root environment, and you will need to deactivate it in order to make `main` into the new root. First, place an authenticated cURL request on the project's API with the CLI command to deactivate it:

```bash
$ platform project:curl -X POST -p <Project ID> environments/master/deactivate 
```

### 5. Make "Main" the parent environment

First, update the project's `default_branch` property with another authenticated request:

```bash
$ platform project:curl -X PATCH -p <Project ID> -d '{"default_branch": "main"}'
```

Then, update the "Main" environment's `parent` property to `null`. It's currently set to master, and the command below will update the project to - at this point - contain two parent environments: Master and Main.

```bash
$ platform environment:info -p <Project ID> -e main parent -
```

![Make main a parent](/images/management-console/existing-parentnull.png "0.75")

You can now delete the `master` branch from your external repository.
