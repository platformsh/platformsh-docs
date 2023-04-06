---
title: Get Started
sidebarTitle: "Get started"
weight: -255
layout: single
description: |
    See how to get started deploying Symfony on Platform.sh.
---

Symfony is a PHP framework that you can use to create web applications. Platform.sh is the official Symfony PaaS.

This guide provides instructions for deploying, and working with, Symfony on Platform.sh.

{{% guides/requirements name="Symfony" %}}

{{< note >}}
When using Symfony, all commands using Platform CLI `platform <command>` can be replaced by `symfony cloud:<command>` as Symfony CLI wraps the [Platform.sh CLI](/administration/cli/_index.md) with added features related to Symfony.
{{< /note >}}

## Creating your Symfony Application

To get familiar with Platform.sh, create a new Symfony project from scratch (we will use the [Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application)):

```bash
symfony new {{< variable "PROJECT_NAME" >}} --demo --cloud
cd {{< variable "PROJECT_NAME" >}}
```

The `--demo` flag pulls the [Symfony demo skeleton](https://github.com/symfony/demo).</br>
The `--cloud` flag automatically generates the Platform.sh configuration files.

{{< note >}}
If you want to deploy an **existing project**, generate a sensible default Platform.sh configuration from within the project's directory:

```bash
symfony project:init
```

The command generates a default set of configuration files: `.platform.app.yaml`, `.platform/services.yaml`, `.platform/routes.yaml`, and `php.ini`.

Commit the new files in your repository:

```bash
git add .platform.app.yaml .platform/services.yaml .platform/routes.yaml php.ini
git commit -m "Add Platform.sh configuration"
```
{{< /note >}}

Platform.sh manages the entire infrastructure of your project, from code to
services (databases, queues, search, ...), from email sending to
[cron-jobs](./crons) and [workers](./workers). This infrastructure is
described through configuration files, stored along side your code.

## Creating the Project on Platform.sh

Create the project on Platform.sh by running the following command from within the project's directory:
```bash
symfony cloud:create --title PROJECT_TITLE --set-remote
```

The `--set-remote` flag will set this new project as the remote for this repository.

{{< note title="Tip" >}}
You can link any repository to an existing Platform.sh project using the following command:

```bash
symfony project:set-remote {{< variable "PROJECT_ID" >}}
```
{{< /note >}}

## Deploy your project

To deploy your project, run the following command:

```bash
symfony cloud:deploy
```

{{< note title="Tip" >}}
During deploy, within your terminal, it displays logs of the deployment process from the Platform.sh API.
You can kill the process using `CTRL+C` command line without interrupting the deployment process.</BR>
If you want to get your eyes back on the logs, use `symfony activity:log`.
{{< /note >}}

**Congrats!**</BR>
**Your first Symfony application has been deployed on Platform.sh.**

Now that your application is deployed in a production mode, you can define a custom domain for your live website by following this [link](/administration/web/configure-project.html#domains) or use the following command:

```bash
symfony cloud:domain:add {{< variable "YOUR_DOMAIN" >}}
```

Go forth and Deploy (even on Friday)!

## Make changes to your project 

Now that the project is deployed, let's describe a typical scenario where you want to fix a bug or add a new feature.

In your project, the main branch always represents the production environment. Other branches are for developing new features, fixing bugs, or updating the infrastructure.

Let's create a new environment (a Git branch) to make some changes, without impacting production:

```bash
symfony cloud:branch feat-a
```

This command creates a new local `feat-a` Git branch based on the main Git branch and activate a related environment on Platform.sh.
The new environment inherits the data (service data and assets) of the parent environment (the production one here).

Let's make some visual changes.
If you created a Symfony demo application, edit the `templates/default/homepage.html.twig` template and make the following change:

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

Notice that the domain name is different now (each environment has its own domain name):

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
Note that deploying production was fast as it reused the image built for the `feat-a` environment.
{{< /note >}}

For a long running branch, you can keep the code up-to-date with main via `git merge main` or `git rebase main`. And you can also keep the data in sync with the production environment via `symfony env:sync`.

## Next Steps

### Symfony Integration

Learn more about the [Symfony integration](./integration), a set of tools and
auto-configurations that makes it easier to use Platform.sh for Symfony
projects.

### Environment Variables

When using the Symfony integration, more [environment
variables](./environment-variables) related to Symfony are defined.

### Use more Services

Platform.sh supports a wide range of services. For more information about how to use them with a Symfony project, consult the [Services for Symfony projects](./services).

### Local development

Once Symfony has been deployed on Platform.sh, you might want to set up a local development environment.
For more information, consult the [Symfony local development guides](./local).

### External resources

The community also provides a number of Open-Source starting points you can consult:

### Symfony CLI Tips

FIXME: Some commands should be explained differently on Symfony CLI like tunnel

{{% tips-and-tricks/cli framework="Symfony" %}}
{{% tips-and-tricks/symfony/cli-common %}}
{{% tips-and-tricks/cli-database framework="Symfony" %}}

{{< guide-buttons type="last" >}}
