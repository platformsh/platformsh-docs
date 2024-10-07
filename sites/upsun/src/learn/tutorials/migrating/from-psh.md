---
title: From Platform.sh
description: See how to migrate your app to {{% vendor/name %}} so it's ready to be deployed.
keywords:
  - "set remote"
---

If you already have an app running somewhere else, you want to migrate it to {{% vendor/name %}} and deploy it.
To do so, follow these steps.

## Before you begin

You need:

- An app that works and is ready to be built
- Code in Git
- A {{< vendor/name >}} account -- if you don't already have one, [register](https://upsun.com/register/).
- The [{{< vendor/name >}} CLI](/administration/cli/_index.md) installed locally

## 1. Export from previous system

Start by exporting everything you might need from your current app.
This includes data in databases, files on a file system,
and for some apps, such as Drupal, configuration that you need to export from the system into files.

## 2. Create a project

{{< codetabs >}}

+++
title=Using the CLI
+++

If you do not already have an organization created on {{% vendor/name %}}, create one:

```bash
{{% vendor/cli %}} org:create
```

Then run the following command to create a project:

```bash
{{% vendor/cli %}} project:create
```

When prompted, fill in details like the project name, [region](/development/regions.md), and the name of your organization.

<--->

+++
title=In the Console
+++

[Create a new project from scratch]({{% create-project-link scratch=true %}}).

If you do not already have an organization created to put the project, you'll first be instructed to create one.

Once you have done so, select that organization from the dropdown, and select **Create from scratch**.

In the form, fill in details like the project name and [region](/development/regions.md).
You'll be able to define resources for the project after your first push.

{{< /codetabs >}}

## 3. Add configuration

The exact configuration you want depends on your app.
You likely want to configure three areas:

- [The app itself](/create-apps/_index.md) -- this is the only required configuration
- [Services](/add-services/_index.md)
- [Routes](/define-routes/_index.md)

When you've added your configuration, make sure to commit it to Git.

## 4. Optional: Define a resource initialization strategy

By default, when you first deploy your project,
{{% vendor/name %}} allocates [default resources](/manage-resources/resource-init.md) to each of your containers.
If you don't want to use those default resources,
define your own [resource initialization strategy](/manage-resources/resource-init#specify-a-resource-initialization-strategy) before pushing your code.

Alternatively, you can [amend those default container resources](/manage-resources/adjust-resources.md) after your project is deployed.

## 5. Push your code

The way to push your code to {{% vendor/name %}} depends on
whether you're hosting your code with a third-party service using a [source integration](/integrations/source/_index.md).
If you aren't, your repository is hosted in {{% vendor/name %}}
and you can use the CLI or just Git itself.

{{< codetabs >}}
+++
title=Using the CLI
+++

1. Get your project ID by running the following command:

   ```bash
   {{% vendor/cli %}} projects
   ```

2. Add {{% vendor/name %}} as a remote repository by running the following command:

   ```bash
   {{% vendor/cli %}} project:set-remote {{< variable "PROJECT_ID" >}}
   ```

3. Push to the {{% vendor/name %}} repository by running the following command:

   ```bash
   {{% vendor/cli %}} push
   ```

When you try to push, any detected errors in your configuration are reported and block the push.
After any errors are fixed, a push creates a new environment.

<--->
+++
title=Using a source integration
+++

Set up the integration for your selected service:

- [Bitbucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

Then push code to that service as you do normally.
Pushing to a branch creates an environment from that branch.

Note that the source integration doesn't report any errors in configuration directly.
You have to monitor those in your project activities.

<--->
+++
title=Using Git
+++

1.  Add an [SSH key](/development/ssh/ssh-keys.md).
2.  In the Console, open your project and click **Code {{< icon chevron >}}**.
3.  Click **Git**.
4.  From the displayed command, copy the location of your repository.
   It should have a format similar to the following:

   ```text
   abcdefgh1234567@git.eu.{{< vendor/urlraw "host" >}}:abcdefgh1234567.git
   ```

5.  Add {{% vendor/name %}} as a remote repository by running the following command:

   ```bash
   git remote add {{% vendor/cli %}} {{< variable "REPOSITORY_LOCATION" >}}
   ```

6.  Push to the {{% vendor/name %}} repository by running the following command:

   ```bash
   git push -u {{% vendor/cli %}} {{< variable "DEFAULT_BRANCH_NAME" >}}
   ```

When you try to push, any detected errors in your configuration are reported and block the push.
After any errors are fixed, a push creates a new environment.

{{< /codetabs >}}

## 6. Import data

Once you have an environment, you can import the data you backed up at step 1.
The exact process may depend on the service you use.

For SQL databases, for example, you can use a version of this command:

```bash
{{% vendor/cli %}} sql < {{< variable "BACKUP_FILE_NAME" >}}
```

For any potential more details, see the [specific service](/add-services/_index.md).

## 7. Import files

Your app may include content files, meaning files that aren't intended to be part of your codebase so aren't in Git.
You can upload such files to [mounts you created](/create-apps/app-reference/single-runtime-image.md#mounts).
Upload to each mount separately.

Suppose you have the following mounts defined:

```yaml {configFile="app"}
applications:
  myapp:
    mounts:
      'web/uploads':
        source: local
        source_path: uploads
      'private':
        source: local
        source_path: private
```

`instance` mounts on {{% vendor/name %}} are the equivalent of `local` mounts on {{% vendor/psh_ref %}}.
To ensure continuity when migrating from {{% vendor/psh_ref %}} to {{% vendor/name %}},
the `local` mount type works as an alias for the `instance` mount type.

However, it is recommended to change the type of your `local` mounts to `instance` or another [supported mount type](/create-apps/app-reference/single-runtime-image.html#define-a-mount).

For example:

```yaml {configFile="app"}
applications:
  myapp:
    mounts:
      'web/uploads':
        source: instance
        source_path: uploads
      'private':
        source: instance
        source_path: private
```

Then, to upload your files, run a command similar to the following:

```bash
{{% vendor/cli %}} mount:upload --mount web/uploads --source ./uploads
{{% vendor/cli %}} mount:upload --mount private --source ./private
```

Alternatively, you can upload to your mounts using a different [SSH method](/development/file-transfer.md#transfer-files-using-an-ssh-client).

## Optional: Add variables

If your app requires environment variables to build properly, [add them to your environment](/development/variables/set-variables.md).

## What's next

Now that your app is ready to be deployed, you can do more:

- [Add a domain](/domains/steps/_index.md).
- Set up for [local development](/development/local/_index.md).
- Configure [health notifications](/integrations/notifications.md).
- For monitoring and profiling, [integrate Blackfire](/increase-observability/application-metrics/blackfire.md).
