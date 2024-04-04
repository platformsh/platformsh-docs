---
title: Get started
weight: -255
layout: single
description: |
    See how to get started deploying Symfony on {{% vendor/name %}}.
---

{{% vendor/name %}} is the official [Symfony](https://symfony.com/) PaaS.
This guide provides instructions for deploying, and working with, Symfony on {{% vendor/name %}}.

{{% guides/requirements name="Symfony" %}}

{{< note >}}

The Symfony CLI wraps the [{{% vendor/name %}} CLI](/administration/cli/_index.md) with added features related to Symfony.
So when using Symfony, you can replace `{{% vendor/cli %}} <command>` by `symfony {{% vendor/cli %}}:<command>` in all of your commands.

{{< /note >}}

## 1. Create your Symfony app

To get familiar with {{% vendor/name %}}, create a new Symfony project from scratch.
The present tutorial uses the [Symfony Demo](https://symfony.com/doc/current/setup.html#the-symfony-demo-application) app as an example :

```bash {location="Terminal"}
symfony new {{< variable "PROJECT_NAME" >}} --demo --{{% vendor/cli %}}
cd {{< variable "PROJECT_NAME" >}}
```

The `--demo` flag pulls the [Symfony Demo skeleton](https://github.com/symfony/demo).</br>
The `--{{% vendor/cli %}}` flag automatically generates the {{% vendor/name %}} configuration file.

{{< note >}}

Alternatively, you can deploy an **existing Symfony project**.
To do so, follow these steps:

1. To generate a sensible default {{% vendor/name %}} configuration,
   run the following command from within the project's directory:

   ```bash {location="Terminal"}
   symfony project:init --{{% vendor/cli %}}
   ```

   This generates the `{{< vendor/configfile "app" >}}` and `php.ini` configuration files.

2. Add and commit your changes:

   ```bash {location="Terminal"}
   git add {{< vendor/configfile "app" >}} php.ini
   git commit -m "Add {{% vendor/name %}} configuration"
   ```

{{< /note >}}

## 2. Create your {{% vendor/name %}} project

To create a project on {{% vendor/name %}}, run the following command from within the project's directory:

```bash {location="Terminal"}
symfony {{% vendor/cli %}}:create --title PROJECT_TITLE --set-remote
```

The `--set-remote` flag sets the new project as the remote for this repository.

{{< note title="Tip" >}}

You can link any repository to an existing {{% vendor/name %}} project using the following command:

```bash {location="Terminal"}
symfony {{% vendor/cli %}}:set-remote {{< variable "PROJECT_ID" >}}
```

{{< /note >}}

## 3. Deploy your project

To deploy your project, run the following command:

```bash {location="Terminal"}
symfony {{% vendor/cli %}}:deploy
```

During deployment, the logs from the {{% vendor/name %}} API are displayed in your terminal so you can monitor progress.
To stop the display of the logs **without interrupting the deployment**,
use `CTRL+C` in your terminal.
To go back to displaying the logs, run `symfony {{% vendor/cli %}}:activity:log`.

Congratulations, your first Symfony app has been deployed on {{% vendor/name %}}!

{{< note title="Tip" theme="info" >}}

Now that your app is deployed in production mode,
you can define a custom domain for your live website.
To do so, see how to [set up a custom domain on {{% vendor/name %}}](/administration/web/configure-project.html#domains),
or run the following command:

```bash {location="Terminal"}
symfony {{% vendor/cli %}}:domain:add {{< variable "YOUR_DOMAIN" >}}
```

{{< /note >}}

## 4. Make changes to your project

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the main branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash {location="Terminal"}
   symfony {{% vendor/cli %}}:branch feat-a
   ```

   This command creates a new local `feat-a` Git branch based on the main Git branch,
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

3. Add and commit your changes:

   ```bash {location="Terminal"}
   git commit -a -m "Update text"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash {location="Terminal"}
   symfony {{% vendor/cli %}}:deploy
   ```
   
   Note that each environment has its own domain name.
   To view the domain name of your new environment, run the following command:

   ```bash {location="Terminal"}
   symfony {{% vendor/cli %}}:url --primary
   ```

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch, deploy,
   and remove the feature branch:

   ```bash {location="Terminal"}
   git checkout main
   git merge feat-a
   symfony environment:delete feat-a
   git branch -d feat-a
   symfony {{% vendor/cli %}}:deploy
   ```

   Note that deploying to production is fast because the image built for the `feat-a` environment is reused.

   For a long running branch, keep the code up-to-date with the main branch by using `git merge main` or `git rebase main`.
   Also, keep the data in sync with the production environment by using `symfony {{% vendor/cli %}}:env:sync`.

## 5. Optional: Use a third-party Git provider

When you choose to use a third-party Git hosting service,
the {{% vendor/name %}} Git repository becomes a read-only mirror of the third-party repository.
All your changes take place in the third-party repository.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

{{< guide-buttons previous="Back" next="Symfony integration" nextLink="/get-started/stacks/symfony/integration.md" type="*" >}}