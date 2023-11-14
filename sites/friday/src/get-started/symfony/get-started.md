---
title: Get Started
weight: -255
layout: single
description: |
    See how to get started deploying Symfony on {{% vendor/name %}}.
---

{{% vendor/name %}} is the official Symfony [Symfony](https://symfony.com/)
PaaS. This guide provides instructions for deploying, and working with, Symfony
on {{% vendor/name %}}.

{{% guides/requirements name="Symfony" %}}

{{< note >}}

The Symfony CLI wraps the [{{% vendor/name %}} CLI](/administration/cli/_index.md) with added features related to Symfony.
So when using Symfony, you can replace `{{% vendor/cli %}} <command>` by `symfony upsun:<command>` in all of your commands.

{{< /note >}}

## Create your Symfony app

To get familiar with {{% vendor/name %}}, create a new Symfony project from scratch.
The present tutorial uses the [Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application) app as an example :

```bash
symfony new {{< variable "PROJECT_NAME" >}} --demo --upsun
cd {{< variable "PROJECT_NAME" >}}
```

The `--demo` flag pulls the [Symfony Demo skeleton](https://github.com/symfony/demo).</br>
The `--upsun` flag automatically generates the {{% vendor/name %}} configuration file.

{{< note >}}

Alternatively, you can deploy an **existing Symfony project**.
To do so, follow these steps:

1. To generate a sensible default {{% vendor/name %}} configuration,
   run the following command from within the project's directory:

   ```bash
   symfony project:init --upsun
   ```

   This generates the following set of configuration files: `{{< vendor/configfile "app" >}}`, and `php.ini`.

2. Commit these new files to your repository:

   ```bash
   git add {{< vendor/configfile "app" >}} php.ini
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
symfony upsun:create --title PROJECT_TITLE --set-remote
```

The `--set-remote` flag sets the new project as the remote for this repository.

{{< note title="Tip" >}}

You can link any repository to an existing {{% vendor/name %}} project using the following command:

```bash
symfony upsun:set-remote {{< variable "PROJECT_ID" >}}
```

{{< /note >}}

## Deploy your project

To deploy your project, run the following command:

```bash
symfony upsun:deploy
```

{{< note title="Tip" >}}

During deployment, the logs from the {{% vendor/name %}} API are displayed in your terminal so you can monitor progress.
To stop the display of the logs **without interrupting the deployment**,
use `CTRL+C` in your terminal.
To go back to displaying the logs, run `symfony upsun:activity:log`.

{{< /note >}}

Congratulations, your first Symfony app has been deployed on {{% vendor/name %}}!

Now that your app is deployed in production mode,
you can define a custom domain for your live website.
To do so, see how to [set up a custom domain on {{% vendor/name %}}](/administration/web/configure-project.html#domains),
or run the following command:

```bash
symfony upsun:domain:add {{< variable "YOUR_DOMAIN" >}}
```

## Make changes to your project

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the main branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash
   symfony upsun:branch feat-a
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
   symfony upsun:deploy
   ```
   
   Note that each environment has its own domain name.
   To view the domain name of your new environment, run the following command:

   ```bash
   symfony upsun:url --primary
   ```

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch, deploy,
   and remove the feature branch:

   ```bash
   git checkout main
   git merge feat-a
   symfony environment:delete feat-a
   git branch -d feat-a
   symfony upsun:deploy
   ```

   {{< note >}}

   Deploying to production was fast because the image built for the `feat-a` environment was reused.

   {{< /note >}}

   For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
   You can also keep the data in sync with the production environment by using `symfony upsun:env:sync`.

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

You might find the following commands useful when using the Symfony CLI.

-   Open the web administration console:

    ```bash
    symfony upsun:web
    ```

-   Open the URL of the current environment:

    ```bash
    symfony upsun:url
    ```

-   Open an SSH connection to your environment:

    ```bash
    symfony upsun:ssh
    ```

-   Configure a project for Upsun:

    ```bash
    symfony project:init --upsun
    ```

-   Get a list of all the domains:

    ```bash
    symfony upsun:domains
    ```

-   Create a new environment:

    ```bash
    symfony upsun:branch new-branch
    ```

-   Get a list of all the environments:

    ```bash
    symfony upsun:environments
    ```

-   Push code to the current environment:

    ```bash
    symfony upsun:push
    ```

-   Get a list of all the active projects:

    ```bash
    symfony upsun:projects
    ```

-   Add a user to the project:

    ```bash
    symfony upsun:user:add
    ```

-   List variables:

    ```bash
    symfony upsun:variables
    ```

You might find the following commands useful when using the Symfony CLI with a database.

-   Create a local dump of the remote database:

    ```bash
    symfony upsun:db:dump --relationship database
    ```

-   Run an SQL query on the remote database:

    ```bash
    symfony upsun:sql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    symfony upsun:sql < my_database_backup.sql
    ```
