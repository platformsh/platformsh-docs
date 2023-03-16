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
When using Symfony, all commands using Platform CLI `platform <command>` can be replaced by `symfony cloud:<command>` as Symfony CLI wraps the [Platform.sh CLI](/administration/cli/_index.md) with added features related to Symfony.
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

Create your first project by running the following command from within the project's directory:
```bash
symfony cloud:create --title PROJECT_TITLE --set-remote
```

The `--set-remote` flag will set this new project as the remote for this repository. </BR>
{{< note title="Tip" >}}
If you don't use this `--set-remote` option, you can link your repository to an existing project using following command:
```bash
symfony project:set-remote {{< variable "PROJECT_ID" >}}
```
{{< /note >}}

## Deploy your Project
Use the following command to deploy your project:
```bash
symfony cloud:deploy
```

{{< note title="Tip" >}}
During deploy, within your terminal, it displays logs of the deployment process from the Platform.sh API.
You can kill the process using ``CTRL+C`` command line without interrupting deployment process on Platform.sh side.</BR>
If you want to get your eyes back on the logs, use command `symfony activity:log`.
{{< /note >}}

**Congrats!**</BR>
**Your first Symfony application is deployed on Platform.sh in few minutes.**

Now that your application is in a production mode, you can define a custom domain for your live website by following this [link](/administration/web/configure-project.html#domains) or use the following command:

```bash
symfony cloud:domain:add {{< variable "YOUR_DOMAIN" >}}
```

Go forth and Deploy (even on Friday)!

## Working on a Project

Now that the project is deployed, let's describe a typical scenario where you want to fix a bug or add a new feature.

First, you need to know that the main branch always represents the production environment. Any other branch is for developing new features, fixing bugs, or updating the infrastructure.

Let's create a new environment (a Git branch) to make some changes, without impacting production:

```bash
symfony cloud:branch feat-a
```

This command creates a new local `feat-a` Git branch based on the main Git branch and activate a related environment on Platform.sh.
The new environment inherits the data (service data and assets) of the parent environment (the production one here).

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

{{< guide-buttons next="More resources" type="first" >}}
