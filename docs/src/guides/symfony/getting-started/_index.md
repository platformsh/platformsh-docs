---
title: Getting Started
sidebarTitle: "Getting started"
weight: -110
layout: single
description: |
    See how to get started deploying Symfony on Platform.sh.
---

Symfony is a web application framework written in PHP. Platform.sh is the official Symfony PaaS.

This guide provides instructions for deploying, and working with, Symfony on Platform.sh.
It includes examples for working with Symfony on [composer](https://getcomposer.org/).

{{% guides/requirements name="Symfony" %}}

{{< note >}}
All sample commands in this doc using Platform CLI `platform <command>` can be replaced by `symfony cloud:<command>` as Symfony CLI wraps the [Platform.sh CLI](/administration/cli/_index.md) with added features related to Symfony.
{{< /note >}}

## Create your Symfony Demo application
If you don't have code, create a new Symfony project from scratch.
The following commands create a brand new [Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application) project.

```bash
symfony new {{< variable "PROJECT_NAME" >}} --demo --cloud
cd {{< variable "PROJECT_NAME" >}}
```

Platform.sh manages the entire infrastructure of your project, from code to services (databases, queues, search, ...), from email sending to [cron-jobs](../customize/configuration.md#cron-jobs) and [workers](../customize/configuration.md#workers).
This infrastructure is described through configuration files, stored along side your code.</br>
The `--demo` flag pulls the [Symfony demo skeleton](https://github.com/symfony/demo).</br>
The `--cloud` flag automatically generates the Platform.sh configuration files.

{{< note >}}
If you want to deploy an **existing project**, generate a sensible default Platform.sh configuration from within the project's directory:

```bash
symfony project:init
```

The command generates a default set of configuration files: `.platform.app.yaml`, `.platform/services.yaml`, `.platform/routes.yaml`, and `php.ini`.

Don't forget to commit the new files in your repository:
````bash
git add .platform.app.yaml .platform/services.yaml .platform/routes.yaml php.ini
git commit -m "Add Platform.sh configuration"
````
{{< /note >}}
## Create a Project in the Cloud

Create your first project by running the following command:
```bash
symfony cloud:create --title PROJECT_TITLE
```

## Link your local Symfony application with your Platform.sh project


You can use Platform.sh as your Git repository or connect to a third-party provider such as GitHub, GitLab, or BitBucket:

{{< codetabs >}}
+++
title=Using Symfony CLI
+++

Add a Git remote for the Platform.sh project you just created
by running the following command from your repository:

```bash
symfony project:set-remote {{< variable "PROJECT_ID" >}}
```

That creates an upstream called `platform` for your Git repository.

<--->
+++
title=Using a third-party provider
+++

When you choose to use a third-party Git hosting service
the Platform.sh Git repository becomes a read-only mirror of the third-party repository.
All your changes take place in the third-party repository.

Add an integration to your existing third party repository.

The process varies a bit for each supported service, so check the specific pages for each one.

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

Accept the default options or modify to fit your needs.

All of your existing branches are automatically synchronized to Platform.sh.
You get a deploy failure message because you haven't provided configuration files yet.
You add them in the next step.

If you're integrating a repository to Platform.sh that contains a number of open pull requests,
don't use the default integration options.
Projects are limited to three\* development environments (active and deployed branches or pull requests)
and you would need to deactivate them individually to test this guide's migration changes.
Instead, each service integration should be made with the following flag:

```bash
symfony cloud:integration:add --type=service ... --build-pull-requests=false
```

You can then go through this guide and activate the environment when you're ready to deploy

\* You can purchase additional development environments at any time in the [Web Console](/administration/web/_index.md).
Open your project and select **Edit plan**.
Add additional **Environments**, view a cost estimate, and confirm your changes.
{{< /codetabs >}}

{{< note >}}
During step [Create of your project in the cloud](#create-a-project-in-the-cloud), if you answer `yes` to the question ``Set the new project Test SF link as the remote for this repository? [y/N] y``,
you can skip this section as your Platform.sh project is already linked to your source code via automatic generated ``.platform/local/project.yaml`` file.
{{< /note >}}

## Deploy your Project

There are 2 ways to deploy your source code on your Platform.sh project, depending on the way you linked your Symfony application with your Platform.sh project.

{{< codetabs >}}
+++
title=Using Symfony CLI
+++
You can either use Symfony CLI
```bash
symfony cloud:deploy
```
or Git command
```bash
git push platform
```

<--->
+++
title=Using a third-party provider
+++
Use common way to push your code to your Git repository, and the integration will automatically deploy your Git branch to corresponding Platform.sh environment.
```bash
git push origin
```

{{< note title="Warning" >}}
If you set an integration with your remote Git repository (Github, Gitlab or Bitbucket), don't push your code to your Platform.sh project
as the integration will override your modification next time the integration process is running.
{{< /note >}}

{{< /codetabs >}}

{{% guides/deployment Symfony=true %}}

Go forth and Deploy (even on Friday)!

## Working on a Project

Now that the project is deployed, let's describe a typical scenario where you want to fix a bug or add a new feature.

First, you need to know that the main branch always represents the production environment. Any other branch is for developing new features, fixing bugs, or updating the infrastructure.

Let's create a new environment (a Git branch) to make some changes, without impacting production:


{{< codetabs >}}
+++
title=Using Symfony CLI
+++

```bash
git checkout main
symfony cloud:branch feat-a
```

This command creates a new local `feat-a` Git branch based on the main Git branch and activate a related environment on Platform.sh.
If you have some services enabled, the new environment inherits the data of the parent environment (the production one here).

Let's make some visual changes.
If you have created a Symfony demo application, edit the `templates/default/homepage.html.twig` template and make the following change:

```html {location="templates/default/homepage.html.twig"}
{% block body %}
    <div class="page-header">
-        <h1>{{ 'title.homepage'|trans|raw }}</h1>
+        <h1>Welcome to the Platform.sh Demo</h1>
    </div>

    <div class="row">
```

Commit the change:
```bash
git commit -a -m "Update text"
```

And deploy the change to the `feat-a` environment:

```bash
symfony cloud:deploy
```

Browse the new version and notice that the domain name is different now (each environment has its own domain name):

```bash
symfony cloud:url --primary
```

Iterate by changing the code, committing, and deploying. When satisfied with the changes, merge it to main, deploy, and remove the feature branch:

```bash
git checkout main
git merge feat-a
symfony environment:delete feat-a
git branch -d feat-a
symfony cloud:deploy
```

{{< note >}}
Note that deploying production was fast as it reused the image built for the feat-a environment.
{{< /note >}}

For a long running branch, you can keep the code up-to-date with main via `git merge main` or `git rebase main`. And you can also keep the data in sync with the production environment via `symfony env:sync`.

<--->
+++
title=Using a third-party provider
+++

```bash
git checkout main
git checkout -b feat-a
```

This command creates a new local feat-a Git branch based on the main Git branch

[comment]: <> (and activate a related environment on Platform.sh.)

[comment]: <> (If you have some services enabled, the new environment inherits the data of the parent environment &#40;the production one here&#41;.)

Let's make some simple visual changes.
If you have created a Symfony demo application, edit the `templates/default/homepage.html.twig` template and make the following change:

```html {location="templates/default/homepage.html.twig"}
{% block body %}
    <div class="page-header">
-        <h1>{{ 'title.homepage'|trans|raw }}</h1>
+        <h1>Welcome to the Platform.sh Demo</h1>
    </div>

    <div class="row">
```

Commit the change:
```bash
git commit -a -m "Update text"
```

And deploy the change to the `feat-a` environment:

```bash
git push --set-upstream origin feat-a
```
Through the integration process, this will activate a related environment on Platform.sh.
If you have some services enabled, the new environment inherits the data of the parent environment (the production one here).

Browse the new version and notice that the domain name is different now (each environment has its own domain name):

```bash
symfony cloud:url --primary
```

Iterate by changing the code, committing, and deploying. When satisfied with the changes, merge it to main, deploy, and remove the feature branch:

```bash
git checkout main
git merge feat-a
git push origin main
git branch -d feat-a
git push origin --delete feat-a
symfony environment:delete feat-a
```

{{< note >}}
Note that deploying production was fast as it reused the image built for the feat-a environment.
{{< /note >}}

For a long running branch, you can keep the code up-to-date with main via `git merge main` or `git rebase main`. And you can also keep the data in sync with the production environment via `symfony env:sync`.

{{< /codetabs >}}


## Load Symfony Demo fixtures in the Cloud
Symfony Demo comes with fixtures.
To initialize your Platform.sh project database with fixtures, run the following:
```bash
symfony ssh -- php bin/console doctrine:schema:update --force
symfony ssh -- php bin/console doctrine:fixture:load -e dev
```

{{< note >}}
Note that Doctrine fixture commands are only available in Symfony development environments,
which is why `-e dev` is needed.
{{< /note >}}


{{< guide-buttons next="More resources" type="first" >}}
