---
title: Converting from Upsun Fixed (formerly Platform.sh) 
description: Learn how to configure your Upsun Fixed app to work on an Upsun Flex project so that it's deployment-ready.
keywords:
  - "set remote"
---

{{< note theme="note" title="Important" >}}

{{< vendor/name >}} Fixed and Flex are [**separate products**](/administration/organizations.html#fixed-and-flex-organizations) with different configuration formats and organizations. You **cannot** mix these configurations in the same project.

- {{< vendor/name >}} Fixed continues to use `.platform/` configuration files.
- {{< vendor/name >}} Flex uses `.upsun/` configuration files.

{{< /note >}}


## Before you begin

You need:

- An Upsun Fixed (formerly Platform.sh) application that works and is ready to be built
- The [{{< vendor/name >}} CLI](/administration/cli/_index.md) installed locally

Follow the steps below to begin the conversion of your project.

## 1. Export your source Upsun Fixed project

Start by [exporting everything](/learn/tutorials/exporting.html) you might need from your current app.
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

There are two ways to change the configuration files of your Upsun Fixed (formerly Platform.sh) projects to make them {{% vendor/name %}} compatible.

1. [Convert projects with the CLI](#convert-with-the-cli)
2. [Convert projects manually](#convert-manually)

  **Tip:** Regardless of which method you choose, tools are available to make it easier to edit and validate `.upsun/config.yaml` files - check out [this article](https://devcenter.upsun.com/posts/validate-yaml-config/) in the Upsun DevCenter. 

{{< note theme="info" title="Only one format should exist in your repository" >}}

Upsun Fixed projects only read configuration files in the `.platform/` folder, while {{% vendor/name %}} Flex projects only read configuration files in the `.upsun/` folder. You **cannot mix or combine** these formats. **Only one** should exist in your repository.

If both `.platform/` and `.upsun/` directories are present, deployment will fail with an error such as:

```yaml

 E: Error parsing configuration files: No .platform.app.yaml file found anywhere in the repo
 
 ``` 

{{< /note >}}

### Convert with the CLI

To assist with converting applications from Upsun Fixed (formerly Platform.sh) to {{% vendor/name %}}, the {{< vendor/name >}} converting tool is available as part of the {{% vendor/name %}} CLI. 

This feature helps you prepare your existing Upsun Fixed (formerly Platform.sh) configuration for {{% vendor/name %}} Flex. This tool should only be used when migrating to an {{% vendor/name %}} Flex project. After conversion, remove the `.platform/` folder and files from your repository as {{% vendor/name %}} Flex will only read `.upsun/` configuration files.

{{< note theme="info" title="Important" >}}

If you plan to stay on Upsun Fixed, **do not** run this conversion. Fixed projects continue to use `.platform/` files.

{{< /note >}}

#### Key functions
The converting tool performs the following transformations:

1. Generation of `.upsun/config.yaml`, which is the primary configuration file for {{% vendor/name %}} projects
   - Extracts relevant information from `.platform.app.yaml`, `.platform/applications.yaml`, `.platform/services.yaml`, and `.platform/routes.yaml`.

2. Refactoring of obsolete or incompatible fields
   - Includes the removal of resource-related fields that are not applicable in {{% vendor/name %}}, such as:
     - Disk values
     - Size settings (for example, S, M, L)
     - Legacy resources blocks
     - Any deprecated or unsupported container options in the source configuration

3. Adjustments to mounts and storage
   - Converts mounts of type local into {{% vendor/name %}}'s storage format to support horizontal scaling and infrastructure consistency. 
   - Ensures that volumes and file persistence are aligned with how {{% vendor/name %}} manages data across containers.

        To learn more, refer to these topics: mounts in [single-runtime](/create-apps/app-reference/single-runtime-image.md#mounts) and [composable](/create-apps/app-reference/composable-image.md#mounts) images, and [network storage](add-services/network-storage.md). 

4. Reorganization of custom service configuration
   - Moves custom configuration for [services](/add-services.md) such as `Solr` into the `.upsun/` directory, which is used to hold project-specific overrides and custom assets.

5. Support for cron jobs
   - Identifies cron jobs defined in Upsun Fixed and provides guidance on how to replicate similar functionality in {{% vendor/name %}}.
   - Flags any cron schedules requiring special support and prepares the `.upsun/config.yaml` accordingly.

#### Usage

```bash
upsun convert
```
You will be prompted to enter the path to the Upsun Fixed project you would like to convert.

The conversion then takes place within the {{% vendor/name %}} CLI and outputs the updated `config.yaml` file to the specified destination directory.

{{< note theme="warning" title="Check your organization" >}}

When converting from Upsun Fixed (formerly Platform.sh) to {{% vendor/name %}} Flex, ensure your new {{% vendor/name %}} Flex project **belongs to the correct Upsun organization.**

The conversion **does not** update your organization or hosting plan automatically.

{{< /note >}}

### Convert manually

The [CLI tool described above](#convert-with-the-cli) allows you to convert projects from Upsun Fixed to {{% vendor/name %}}, however, if your project has custom requirements that require a more hands-on approach, you can manually update your Upsun Fixed configuration to be compatible with {{% vendor/name %}}.

Manual conversion gives you full control over the transition process and can be useful for projects with non-standard setups or advanced customizations.

The exact configuration you want depends on your app. You likely want to configure three areas:

- [The app itself](/create-apps/_index.md) -- this is the only required configuration
- [Services](/add-services/_index.md)
- [Routes](/define-routes/_index.md)

When you've added your `.upsun/config.yaml` configuration, make sure to commit it to Git.

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


