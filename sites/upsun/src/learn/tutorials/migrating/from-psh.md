---
title: Converting from Platform.sh 
description: See how to configure your Platform.sh app to {{% vendor/name %}} so it's ready to be deployed.
keywords:
  - "set remote"
---

There are two ways to change the configuration files of your Platform.sh projects to make them {{% vendor/name %}} compatible. 

1. [Convert projects with the CLI](#convert-with-the-cli)
2. [Convert projects manually](#convert-manually)

## Before you begin

You need:

- A Platform.sh application that works and is ready to be built
- The code in Git
- A {{< vendor/name >}} account - if you don't already have one, [register](https://upsun.com/register/).
- The [{{< vendor/name >}} CLI](/administration/cli/_index.md) installed locally

## Convert with the CLI

To assist with converting applications from Platform.sh to {{% vendor/name %}}, the {{< vendor/name >}} converting tool is available as part of the {{% vendor/name %}} CLI. This feature automates the conversion of Platform.sh config files into a format required by {{% vendor/name %}}, significantly reducing manual effort.

### Key functions
The converting tool performs the following transformations:

1. Generation of Upsun `config.yaml`
- Creates a new `config.yaml` file - the primary configuration file for {{% vendor/name %}} projects.
- Extracts relevant information from `.platform.app.yaml`, `services.yaml`, and `routes.yaml`.

2. Refactoring of obsolete or incompatible fields
Removes resource-related fields that are not applicable in {{% vendor/name %}}. This includes:

- Disk values
- Size settings (e.g., S, M, L)
- Legacy resources blocks
- Any deprecated or unsupported container options in the source configuration

3. Mount and storage adjustments
- Converts mounts of type local into {{% vendor/name %}}'s storage format to support horizontal scaling and infrastructure consistency.
- Ensures that volumes and file persistence are aligned with how {{% vendor/name %}} manages data across containers.

4. Reorganization of custom service configuration
- Moves custom configuration for services such as `Solr` into the `.upsun/ directory`, which is used to hold project-specific overrides and custom assets.

5. Support for cron jobs
- Identifies cron jobs defined in Platform.sh and provides guidance on how to replicate similar functionality in {{% vendor/name %}}.
- Flags any cron schedules requiring special support and prepares the `config.yaml` accordingly.

### Example usage

```bash
uspun project:convert
```
You will be prompted to enter the path to the Platform.sh project you would like to convert. 

The conversion then takes place within the {{% vendor/name %}} CLI and outputs the updated `config.yaml` file to the specified destination directory.

## Convert manually

The [CLI tool described above](#convert-with-the-cli) allows you to easily convert projects from Platform.sh to {{% vendor/name %}}, however, if your project has custom requirements that require a more hands-on approach, you can manually update your Platform.sh configuration to be compatible with {{% vendor/name %}}.

Manual conversion gives you full control over the transition process and can be useful for projects with non-standard setups or advanced customizations.

Follow the steps below to begin a manual migration.

## 1. Export your source Platform.sh project

Start by exporting everything you might need from your current app.
This includes data in databases, files on a file system,
and for some apps, such as Drupal, configuration that you need to export from the system into files.

## 2. Create a new {{% vendor/name %}} project

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

## 3. Convert your configuration files

The exact configuration you want depends on your app.
You likely want to configure three areas:

- [The app itself](/create-apps/_index.md) -- this is the only required configuration
- [Services](/add-services/_index.md)
- [Routes](/define-routes/_index.md)

{{< note theme="tip" >}}

If you'd rather not do this manually, you can use [the converting tool](#convert-with-the-cli) via the {{% vendor/name %}} CLI to make all the necessary changes to your configuration files.

{{< /note >}}

When you've added your configuration, make sure to commit it to Git.

## 4. Optional: Define a resource initialization strategy

By default, when you first deploy your project,
{{% vendor/name %}} allocates [default resources](/manage-resources/resource-init.md) to each of your containers.
If you don't want to use those default resources,
define your own [resource initialization strategy](/manage-resources/resource-init.md#specify-a-resource-initialization-strategy) before pushing your code.

Alternatively, you can [amend those default container resources](/manage-resources/adjust-resources.md) after your project is deployed.

## 5. Push your changes

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
To ensure continuity when converting from {{% vendor/psh_ref %}} to {{% vendor/name %}},
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
