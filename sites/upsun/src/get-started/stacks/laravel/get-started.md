---
title: Get started
weight: -255
description: |
    See how to get started deploying Laravel on {{% vendor/name %}}.
---

This guide provides instructions for deploying and working with Laravel on {{% vendor/name %}}.

{{% guides/requirements name="Laravel" %}}

## 1. Create your Laravel app

1. To create a new Laravel project, run the following commands:

   ```bash {location="Terminal"}
   composer create-project laravel/laravel:^11.0 {{< variable "PROJECT_NAME" >}}
   cd {{< variable "PROJECT_NAME" >}}
   git init .
   ```

   Alternatively, you can deploy an **existing Laravel project**. To do so, `cd` into your Laravel repository root folder.

2. To generate a sensible default {{% vendor/name %}} configuration,
   run the following command from within the project's directory:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} project:init
   ```

   The {{% vendor/name %}} CLI detects a PHP & Laravel stack.
   Follow the prompts to specify a name for your project and select the needed services.
   While optional, it is recommended to add [Redis](/add-services/redis.md) to your project to handle Laravel cache, queues & sessions.

   The `{{< vendor/configfile "app" >}}` and `.environment` configuration files are generated.

3. Enable the PHP extensions required by the services you selected.</br>
   For example, `pdo_mysql` is enabled by default, but you may need to enable others like `redis` or `pdo_pgsql`:

   ```yaml {configFile="app"}
   applications:
     myapp:
       [...]
       runtime:
         extensions:
           - redis
           - pdo_pgsql
   ```
   See all the [available PHP extensions](/languages/php/extensions.html).

3. Laravel requires an [encryption key](https://laravel.com/docs/master/encryption#gracefully-rotating-encryption-keys).</br>
   To generate the key locally, run `php artisan key:generate`.
   Copy the key from your local `.env` file into `.environment` as follows:

   ```bash  {configFile="env"}
   export APP_KEY="base64:{{< variable "APP_KEY" >}}"
   ```

4. Add and commit your changes:

   ```bash {location="Terminal"}
   git add {{< vendor/configfile "app" >}} .environment
   git commit -m "Add {{% vendor/name %}} configuration"
   ```

## 2. Create your {{% vendor/name %}} project

To create a project on {{% vendor/name %}}, run the following command from within the project's directory:

```bash {location="Terminal"}
{{% vendor/cli %}} project:create --title {{< variable "PROJECT_TITLE" >}} --set-remote
```

The `--set-remote` flag sets the new project as the remote for this repository.

{{< note title="Tip" >}}

You can link any repository to an existing {{% vendor/name %}} project using the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} project:set-remote {{< variable "PROJECT_ID" >}}
```

{{< /note >}}

## 3. Deploy your project

To deploy your project, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} push
```

During deployment, the logs from the {{% vendor/name %}} API are displayed in your terminal so you can monitor progress.
To stop the display of the logs **without interrupting the deployment**,
use `CTRL+C` in your terminal.
To go back to displaying the logs, run `{{% vendor/cli %}} activity:log`.

Congratulations, your first Laravel app has been deployed on {{% vendor/name %}}!

{{< note title="Tip" theme="info" >}}

Now that your app is deployed in production mode,
you can [set up a custom domain](/domains/steps).
{{< /note >}}

## 4. Configure write access

The {{% vendor/name %}} default configuration stipulates three writable folders in `{{< vendor/configfile "app" >}}`:

- `"/.config"`
- `"bootstrap/cache"`
- `"storage"`

If your application writes content outside of these default ones,
you can [set up mounts](/create-apps/app-reference/single-runtime-image#mounts).

## 5. Make changes to your project

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the main branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} branch feat-a
   ```

   This command creates a new local `feat-a` Git branch based on the main Git branch,
   and activates a related environment on {{% vendor/name %}}.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

2. Make changes to your project.

   For example, edit the `resources/views/welcome.blade.php` template and make the following visual changes:

   ```html {location="resources/views/welcome.blade.php"}
   <meta name="viewport" content="width=device-width, initial-scale=1">
   -    <title>Laravel</title>
   +    <title>Laravel On {{% vendor/name %}}</title>
   <!-- Fonts -->
   ```

3. Add and commit your changes:

   ```bash {location="Terminal"}
   add .
   git commit -a -m "Update title"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} deploy
   ```

   Note that each environment has its own domain name.
   To view the domain name of your new environment, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} url --primary
   ```

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch, deploy,
   and remove the feature branch:

   ```bash {location="Terminal"}
   git checkout main
   git merge feat-a
   {{% vendor/cli %}} environment:delete feat-a
   git branch -d feat-a
   {{% vendor/cli %}} deploy
   ```

   Note that deploying to production is fast because the image built for the `feat-a` environment is reused.

   For a long running branch, keep the code up-to-date with the main branch by using `git merge main` or `git rebase main`.
   Also, keep the data in sync with the production environment by using `{{% vendor/cli %}} env:sync`.

## 6. Optional: Use a third-party Git provider

When you choose to use a third-party Git hosting service,
the {{% vendor/name %}} Git repository becomes a read-only mirror of the third-party repository.
All your changes take place in the third-party repository.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

{{< guide-buttons previous="Back" next="Configure environment variables" nextLink="/get-started/stacks/laravel/environment-variables.md" type="*" >}}
