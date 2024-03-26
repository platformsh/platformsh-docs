---
title: Get started with Laravel on Upsun
weight: -255
layout: single
description: |
    See how to get started deploying Laravel on {{% vendor/name %}}.
---

This guide provides instructions for deploying, and working with, Laravel on {{% vendor/name %}}.

{{% guides/requirements name="Laravel" %}}

## 1. Create your Laravel app

To get familiar with {{% vendor/name %}}, create a new Laravel project from scratch.

```bash
composer create-project laravel/laravel:^11.0 {{< variable "PROJECT_NAME" >}}
cd {{< variable "PROJECT_NAME" >}}
git init .
```

Alternatively, you can deploy an **existing Laravel project**. Just `cd` into your Laravel repository root folder.

{{% vendor/name %}} manages the entire infrastructure of your project,
from code to services (such as databases, queues, or search engines),
all the way to email sending, [cron jobs](./crons), and [workers](./laravel-horizon).
This infrastructure is described through configuration files stored alongside your code.

1. To generate a sensible default {{% vendor/name %}} configuration,
   run the following command from within the project's directory:

   ```bash
   {{% vendor/cli %}} project:init
   ```

   The {{% vendor/name %}} CLI will detect a PHP & Laravel stack. Follow the prompts to specify a name for your project and select the needed services. While optional, it is recommended to add `redis` to your project to handle Laravel cache, queues & sessions.

   This generates the following set of configuration files: `{{< vendor/configfile "app" >}}`, and `.environment`.

2. Based on the services you selected, review `{{< vendor/configfile "app" >}}`. You should enable the PHP extensions required by the services you selected.
   Head to the [PHP available extensions page](/languages/php/extensions.html) to review them.

   While `pdo_mysql` is enabled by default, you may need to enable others like `redis` or `pdo_pgsql`:

   ```yaml {configFile="app"}
   applications:
        myapp:
            ...
            runtime:
                extensions:
                    - redis
                    - pdo_pgsql
   ```

3. Laravel requires an [Encryption Key](https://laravel.com/docs/master/encryption#gracefully-rotating-encryption-keys) to be set to run.
   Generate the key locally with `php artisan key:generate` and copy it from your local `.env` file into `.environment` like this:

   ```bash  {configFile="env"}
   export APP_KEY="base64:{{< variable "APP_KEY" >}}"
   ```

4. Commit these new files to your repository:

   ```bash
   git add {{< vendor/configfile "app" >}} .environment
   git commit -m "Add {{% vendor/name %}} configuration"
   ```



## 2. Create the project

To create the project on {{% vendor/name %}}, run the following command from within the project's directory:

```bash
{{% vendor/cli %}} project:create --title PROJECT_TITLE --set-remote
```

The `--set-remote` flag sets the new project as the remote for this repository.

{{< note title="Tip" >}}

You can link any repository to an existing {{% vendor/name %}} project using the following command:

```bash
{{% vendor/cli %}} project:set-remote {{< variable "PROJECT_ID" >}}
```

{{< /note >}}

## 3. Deploy your project

To deploy your project, run the following command:

```bash
{{% vendor/cli %}} push
```

{{< note title="Tip" theme="info" >}}

During deployment, the logs from the {{% vendor/name %}} API are displayed in your terminal so you can monitor progress.
To stop the display of the logs **without interrupting the deployment**,
use `CTRL+C` in your terminal.
To go back to displaying the logs, run `{{% vendor/cli %}} activity:log`.

{{< /note >}}

Congratulations, your first Laravel app has been deployed on {{% vendor/name %}}!

Now that your app is deployed in production mode,
you can define a custom domain for your live website.
To do so, see how to [set up a custom domain on {{% vendor/name %}}](/administration/web/configure-project.html#domains),
or run the following command:

```bash
{{% vendor/cli %}} domain:add {{< variable "YOUR_DOMAIN" >}}
```

## 4. Configure write access

The {{% vendor/name %}} default configuration stipulates three writable folders in `{{< vendor/configfile "app" >}}`.

- `"/.config"`
- `"bootstrap/cache"`
- `"storage"`

If your application writes content outside of these default ones, please refer to our [documentation on mounts](/create-apps/app-reference.html#mounts) to add new ones.

## 5. Make changes to your project

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the main branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash
   {{% vendor/cli %}} branch feat-a
   ```

   This command creates a new local `feat-a` Git branch based on the main Git branch
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

3. Commit your changes:

   ```bash
   git commit -a -m "Update title"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash
   {{% vendor/cli %}} deploy
   ```

   Note that each environment has its own domain name.
   To view the domain name of your new environment, run the following command:

   ```bash
   {{% vendor/cli %}} url --primary
   ```

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch, deploy,
   and remove the feature branch:

   ```bash
   git checkout main
   git merge feat-a
   {{% vendor/cli %}} environment:delete feat-a
   git branch -d feat-a
   {{% vendor/cli %}} deploy
   ```

   {{< note >}}

   Deploying to production was fast because the image built for the `feat-a` environment was reused.

   {{< /note >}}

   For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
   Also keep the data in sync with the production environment by using `{{% vendor/cli %}} env:sync`.


## Next steps

### Use a third-party Git provider

When you choose to use a third-party Git hosting service,
the {{% vendor/name %}} Git repository becomes a read-only mirror of the third-party repository.
All your changes take place in the third-party repository.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

### Environment variables

Review and manage the available [environment variables](./environment-variables) for your project.

### Configure Redis and queues

- [Store cache, sessions and handle queues with Redis](./setup-redis.md)

### Set up additional packages

- [Add Laravel Telescope to help debugging](./laravel-telescope.md)
- [Add Laravel Horizon to manage queues](./laravel-horizon.md)

### {{% vendor/name %}} CLI tips

You might find the following commands useful when using the {{% vendor/name %}} CLI.

-   Open the web administration console:

    ```bash
    {{% vendor/cli %}} web
    ```

-   Open the URL of the current environment:

    ```bash
    {{% vendor/cli %}} url
    ```

-   Open an SSH connection to your environment:

    ```bash
    {{% vendor/cli %}} ssh
    ```

-   Configure a project for {{% vendor/name %}}:

    ```bash
    {{% vendor/cli %}} project:init
    ```

-   Get a list of all the domains:

    ```bash
    {{% vendor/cli %}} domains
    ```

-   Create a new environment:

    ```bash
    {{% vendor/cli %}} branch new-branch
    ```

-   Get a list of all the environments:

    ```bash
    {{% vendor/cli %}} environments
    ```

-   Push code to the current environment:

    ```bash
    {{% vendor/cli %}} push
    ```

-   Get a list of all the active projects:

    ```bash
    {{% vendor/cli %}} projects
    ```

-   Add a user to the project:

    ```bash
    {{% vendor/cli %}} user:add
    ```

-   List variables:

    ```bash
    {{% vendor/cli %}} variables
    ```

You might find the following commands useful when using the {{% vendor/name %}} CLI with a database.

-   Create a local dump of the remote database:

    ```bash
    {{% vendor/cli %}} db:dump --relationship database
    ```

-   Run an SQL query on the remote database:

    ```bash
    {{% vendor/cli %}} sql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    {{% vendor/cli %}} sql < my_database_backup.sql
    ```
