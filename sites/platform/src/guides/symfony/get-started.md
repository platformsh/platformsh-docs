---
title: Get started
weight: -255
layout: single
description: |
    See how to get started deploying Symfony on {{% vendor/name %}}.
---

[Symfony](https://symfony.com/) is a PHP framework that you can use to create web applications.
{{% vendor/name %}} is the official Symfony PaaS.

This guide provides instructions for deploying, and working with, Symfony on {{% vendor/name %}}.

{{% guides/requirements name="Symfony" %}}

{{< note >}}

The Symfony CLI wraps the [{{% vendor/name %}} CLI](/administration/cli/_index.md) with added features related to Symfony.
So when using Symfony, you can replace `{{% vendor/cli %}} <command>` by `symfony cloud:<command>` in all of your commands.

{{< /note >}}

## Create your Symfony app

To get familiar with {{% vendor/name %}}, create a new Symfony project from scratch.
The present tutorial uses the [Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application) app as an example :

```bash
symfony new {{< variable "PROJECT_NAME" >}} --demo --cloud
cd {{< variable "PROJECT_NAME" >}}
```

The `--demo` flag pulls the [Symfony Demo skeleton](https://github.com/symfony/demo).</br>
The `--cloud` flag automatically generates the {{% vendor/name %}} configuration files.

{{< note >}}

Alternatively, you can deploy an **existing Symfony project**.
To do so, follow these steps:

1. To generate a sensible default {{% vendor/name %}} configuration,
   run the following command from within the project's directory:

   ```bash
   symfony project:init
   ```

   This generates the following set of configuration files: `{{< vendor/configfile "app" >}}`, `{{< vendor/configfile "services" >}}`, `{{< vendor/configfile "routes" >}}`, and `php.ini`.

2. Commit these new files to your repository:

   ```bash
   git add {{< vendor/configfile "app" >}} {{< vendor/configfile "services" >}} {{< vendor/configfile "routes" >}} php.ini
   git commit -m "Add {{% vendor/name %}} configuration"
   ```

{{< /note >}}

{{% vendor/name %}} manages the entire infrastructure of your project,
from code to services (such as databases, queues, or search engines),
all the way to email sending, [cron jobs](./crons), and [workers](./workers).
This infrastructure is described through configuration files stored alongside your code.

## Create the project

To create the project on {{% vendor/name %}}, run the following command from within the project's directory:

```bash
symfony cloud:create --title PROJECT_TITLE --set-remote
```

The `--set-remote` flag sets the new project as the remote for this repository.

{{< note title="Tip" >}}

You can link any repository to an existing {{% vendor/name %}} project using the following command:

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

During deployment, the logs from the {{% vendor/name %}} API are displayed in your terminal so you can monitor progress.
To stop the display of the logs **without interrupting the deployment**,
use `CTRL+C` in your terminal.
To go back to displaying the logs, run `symfony cloud:activity:log`.

{{< /note >}}

Congratulations, your first Symfony app has been deployed on {{% vendor/name %}}!

Now that your app is deployed in production mode,
you can define a custom domain for your live website.
To do so, see how to [set up a custom domain on {{% vendor/name %}}](/administration/web/configure-project.html#domains),
or run the following command:

```bash
symfony cloud:domain:add {{< variable "YOUR_DOMAIN" >}}
```

## Make changes to your project 

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the main branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash
   symfony cloud:branch feat-a
   ```

   This command creates a new local `feat-a` Git branch based on the main Git branch
   and activates a related environment on {{% vendor/name %}}.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

2. Make changes to your project.

   For example, if you created a Symfony Demo app,
   edit the `templates/default/homepage.html.twig` template and make the following visual changes:

   ```html {location="templates/default/homepage.html.twig"}
   {% block body %}
       <div class="page-header">
   -        <h1>{{ 'title.homepage'|trans|raw }}</h1>
   +        <h1>Welcome to the {{% vendor/name %}} Demo</h1>
       </div>

       <div class="row">

   ```

3. Commit your changes:

   ```bash
   git commit -a -m "Update text"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash
   symfony cloud:deploy
   ```
   
   Note that each environment has its own domain name.
   To view the domain name of your new environment, run the following command:

   ```bash
   symfony cloud:url --primary
   ```

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch, deploy,
   and remove the feature branch:

   ```bash
   git checkout main
   git merge feat-a
   symfony environment:delete feat-a
   git branch -d feat-a
   symfony cloud:deploy
   ```

   {{< note >}}

   Deploying to production was fast because the image built for the `feat-a` environment was reused.

   {{< /note >}}

   For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
   You can also keep the data in sync with the production environment by using `symfony cloud:env:sync`.

## Use a third-party Git provider

When you choose to use a third-party Git hosting service, the {{% vendor/name %}} Git
repository becomes a read-only mirror of the third-party repository. All your
changes take place in the third-party repository.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

## Next steps

### Symfony integration

Learn more about the [Symfony integration](./integration), 
a set of tools and auto-configurations that makes it easier to use {{% vendor/name %}} for Symfony projects.

### Environment variables

When you use the Symfony integration,
more [environment variables](./environment-variables) related to Symfony are defined.

### Local development

Once Symfony has been deployed on {{% vendor/name %}},
you might want to [set up a local development environment](./local).

### Symfony CLI tips

{{% tips-and-tricks/cli framework="Symfony" %}}
{{% tips-and-tricks/symfony/cli-common %}}
{{% tips-and-tricks/cli-database framework="Symfony" %}}

{{< guide-buttons previous="Back" next="Symfony integration" >}}