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
All sample commands in this guide using Symfony CLI `symfony <command>` can be replaced by `platform <command>` as Symfony CLI wraps the [Platform.sh CLI](/administration/cli/_index.md) with added features related to Symfony.
{{< /note >}}

## Create your Symfony Demo application
If you don't have code, create a new Symfony project from scratch.
The following commands create a brand new [Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application) project.

```bash
symfony new {{< variable "PROJECT_NAME" >}} --demo --cloud
cd {{< variable "PROJECT_NAME" >}}
```

Platform.sh manages the entire infrastructure of your project, from code to services (databases, queues, search, ...), from email sending to crons and workers. This infrastructure is described through configuration files, stored along side your code. The `--cloud` flag automatically generates the Platform.sh configuration files.


If you want to deploy an existing project, generate a sensible default Platform.sh configuration from within the project's directory:

```bash
symfony project:init
```

The command generates a default set of configuration files: .platform.app.yaml, .platform/services.yaml, .platform/routes.yaml, and php.ini.

Don't forget to commit the new files in your repository:
````bash
git add .platform.app.yaml .platform/services.yaml .platform/routes.yaml php.ini
git commit -m "Add Platform.sh configuration"
````

## Working on a Project

Now that the project is deployed, let's describe a typical scenario where you want to fix a bug or add a new feature.

First, you need to know that the main branch always represents the production environment. Any other branch is for developing new features, fixing bugs, or updating the infrastructure.

Let's create a new environment (a Git branch) to make some changes, without impacting production:

```bash
git checkout main
symfony env:branch feat-a
```

This command creates a new local feat-a branch based on the main branch and activate a related environment on Platform.sh. If you have some services enabled, the new environment inherits the data of the parent environment (the production one here).

Let's make some simple visual changes. If you have created a Symfony demo application, edit the `templates/default/homepage.html.twig` template and make the following change:

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

And deploy the change to the feat-a environment:

```bash
symfony deploy
```

Browse the new version and notice that the domain name is different now (each environment has its own domain name):

```bash
symfony cloud:url --primary
```

Iterate by changing the code, committing, and deploying. When satisfied with the changes, merge it to main, deploy, and remove the feature branch:

```bash
git checkout main
git merge feat-a
symfony env:delete feat-a
git branch -d feat-a
symfony deploy
```

{{< note >}}
Note that deploying production was fast as it reused the image built for the feat-a environment.
{{< /note >}}

For a long running branch, you can keep the code up-to-date with main via `git merge main` or `git rebase main`. And you can also keep the data in sync with the production environment via `symfony env:sync`.

{{< guide-buttons next="Deploy your project" type="first" >}}
