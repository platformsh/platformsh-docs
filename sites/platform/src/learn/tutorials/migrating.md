---
title: Migrating to {{% vendor/name %}}
description: See how to migrate your app to {{% vendor/name %}} so it's ready to be deployed.
keywords:
  - "set remote"
  - migration
---

If you already have an app running somewhere else, you want to migrate it to {{% vendor/name %}} and deploy it.
To do so, follow these steps.

## Before you begin

You need:

{{% version/specific %}}
- An app that works and is ready to be built
- Code in Git
- A {{< vendor/name >}} account -- if you don't already have one, [start a trial](https://auth.api.platform.sh/register?trial_type=general)
- The [{{< vendor/name >}} CLI](/administration/cli/_index.md) installed locally
<--->
- An app that works and is ready to be built
- Code in Git
- A {{< vendor/name >}} account -- if you don't already have one, [register](https://upsun.com/register/).
- The [{{< vendor/name >}} CLI](/administration/cli/_index.md) installed locally
{{% /version/specific %}}

## 1. Export from previous system

Start by exporting everything you might need from your current app.
This includes data in databases, files on a file system,
and for some apps, such as Drupal, configuration that you need to export from the system into files.

## 2. Create a project

<!-- Platform.sh -->
{{< codetabs v2hide="true" >}}

+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} project:create
```

When prompted, fill in details like the project name, [region](/development/regions.md), and [plan](/administration/pricing/_index.md).

<--->

+++
title=In the Console
+++

[Create a new project from scratch]({{% create-project-link scratch=true %}}).

In the form, fill in details like the project name and [region](/development/regions.md).
The project is automatically created with a [Development plan](/administration/pricing/_index.md),
which you can then upgrade.

{{< /codetabs >}}

<!-- Upsun -->
{{< codetabs v1hide="true" >}}

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

{{% version/only "1" %}}
<!-- Platform.sh -->
You can also take guidance from the [project templates](/development/templates.md),
which are starting points for various technology stacks with working configuration examples.
{{% /version/only %}}

When you've added your configuration, make sure to commit it to Git.

## 4. Push your code

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

{{% version/ifelse "" "## 5. Define resources" %}}

{{% version/only "2" %}}

Once you push your code to {{% vendor/name %}}, either directly or through an integration, the deployment itself is not yet complete.

{{% vendor/name %}} has only just now understood the _types_ of containers you want (like a Python app container, and a Redis and MariaDB service containers) by validating that push.
How much resources those containers get is still left for you to define.

You can do so quickly with the following CLI command:

```bash
upsun resources:set
```

Follow the prompts to set CPU, RAM, disk, and number of instances for each container,
and read [the manage resources](/manage-resources.md) documentation for more information.

{{% /version/only %}}

## {{% version/ifelse "5" "6" %}}. Import data

Once you have an environment, you can import the data you backed up in step 1.
The exact process may depend on the service you use.

For SQL databases, for example, you can use a version of this command:

```bash
{{% vendor/cli %}} sql < {{< variable "BACKUP_FILE_NAME" >}}
```

For any potential more details, see the [specific service](/add-services/_index.md).

## {{% version/ifelse "6" "7" %}}. Import files

Your app may include content files, meaning files that aren't intended to be part of your codebase so aren't in Git.
You can upload such files to [mounts you created](/create-apps/app-reference/single-runtime-image.md#mounts).
Upload to each mount separately.

Suppose for instance you have the following file mounts defined:

```yaml {configFile="app"}
mounts:
  'web/uploads':
    source: local
    source_path: uploads
  'private':
    source: local
    source_path: private
```

Upload to each of directories above by running the following commands:

```bash
{{% vendor/cli %}} mount:upload --mount web/uploads --source ./uploads
{{% vendor/cli %}} mount:upload --mount private --source ./private
```

You can adjust these commands for your own case.
Or upload to your mounts using a different [SSH method](/development/file-transfer.md#transfer-files-using-an-ssh-client).

## Optional: Add variables

If your app requires environment variables to build properly, [add them to your environment](/development/variables/set-variables.md).

## What's next

Now that your app is ready to be deployed, you can do more:
{{% version/only "1"%}}
<!-- Platform.sh -->
- Upgrade from a Development plan.
{{% /version/only %}}
- [Add a domain](/domains/steps/_index.md).
- Set up for [local development](/development/local/_index.md).
- Configure [health notifications](/integrations/notifications.md).
{{% version/specific %}}
- For monitoring and profiling, [integrate Blackfire](/increase-observability/integrate-observability/blackfire.md).
<--->
- For monitoring and profiling, [integrate Blackfire](/increase-observability/application-metrics/blackfire.md).
{{% /version/specific %}}
