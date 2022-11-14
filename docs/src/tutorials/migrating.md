---
title: Migrating to Platform.sh
description: See how to migrate your app to Platform.sh so it's ready to be deployed.
---

If you already have an app running somewhere else, you want to migrate it to Platform.sh and deploy it.
To do so, follow these steps.

## Before you begin

You need:

- An app that works and is ready to be built
- Code in Git
- A Platform.sh account -- if you don't already have one, [start a trial](https://auth.api.platform.sh/register?trial_type=general)
- Optional: the [Platform.sh CLI](../administration/cli/_index.md)

## 1. Export from previous system

Start by exporting everything you might need from your current app.
This includes data in databases, files on a file system,
and for some apps, such as Drupal, configuration that you need to export from the system into files.

## 2. Create a Platform.sh project

{{< codetabs >}}
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform project:create
```

When prompted, fill in details like the project name, [region](../development/regions.md), and [plan](../administration/pricing/_index.md).

<--->

---
title=In the Console
file=none
highlight=false
---

[Create a new project from scratch]({{% create-project-link scratch=true %}}).

In the form, fill in details like the project name and [region](../development/regions.md).
The project is automatically created with a [Development plan](../administration/pricing/_index.md),
which you can then upgrade.

{{< /codetabs >}}

## 3. Add Platform.sh configuration

The exact configuration you want depends on your app.
You likely want to configure three areas:

- [The app itself](../create-apps/_index.md) -- this is the only required configuration
- [Services](../add-services/_index.md)
- [Routes](../define-routes/_index.md)

You can also take guidance from the [project templates](../development/templates.md),
which are starting points for various technology stacks with working configuration examples.

When you've added your configuration, make sure to commit it to Git.

## 4. Push your code

The way to push your code to Platform.sh depends on
whether you're hosting your code with a third-party service using a [source integration](../integrations/source/_index.md).
If you aren't, your repository is hosted in Platform.sh
and you can use the CLI or just Git itself.

{{< codetabs >}}
---
title=Using a source integration
file=none
highlight=false
---

Set up the integration for your selected service:

- [Bitbucket](../integrations/source/bitbucket.md)
- [GitHub](../integrations/source/github.md)
- [GitLab](../integrations/source/gitlab.md)

Then push code to that service as you do normally.
Pushing to a branch creates an environment from that branch.

Note that the source integration doesn't report any errors in configuration directly.
You have to monitor those in your project activities.

<--->

---
title=Using the CLI
file=none
highlight=false
---

1. Get your project ID by running the following command:

   ```bash
   platform projects
   ```

2. Add Platform.sh as a remote repository by running the following command:

   ```bash
   platform project:set-remote {{< variable "PROJECT_ID" >}}
   ```

3. Push to the Platform.sh repository by running the following command:

   ```bash
   git push -u platform {{< variable "DEFAULT_BRANCH_NAME" >}}
   ```

When you try to push, any detected errors in your configuration are reported and block the push.
After any errors are fixed, a push creates a new environment.

<--->

---
title=Using Git
file=none
highlight=false
---

1. Add an [SSH key](../development/ssh/ssh-keys.md).
2. In the [Console], open your project and click **Code {{< icon chevron >}}**.
3. Click **Git**.
4. From the displayed command, copy the location of your repository.
   It should have a format similar to the following:

   ```text
   abcdefgh1234567@git.eu.platform.sh:abcdefgh1234567.git
   ```

5. Add Platform.sh as a remote repository by running the following command:

   ```bash
   git remote add platform {{< variable "REPOSITORY_LOCATION" >}}
   ```

6. Push to the Platform.sh repository by running the following command:

   ```bash
   git push -u platform {{< variable "DEFAULT_BRANCH_NAME" >}}
   ```

When you try to push, any detected errors in your configuration are reported and block the push.
After any errors are fixed, a push creates a new environment.

{{< /codetabs >}}

## 5. Import data

Once you have an environment, you can import the data you backed up in step 1.
The exact process may depend on the service you use.

For SQL databases, for example, you can use a version of this command:

```bash
platform sql < {{< variable "BACKUP_FILE_NAME" >}}
```

For any potential more details, see the [specific service](../add-services/_index.md).

## 6. Import files

Your app may include content files, meaning files that aren't intended to be part of your codebase so aren't in Git.
You can upload such files to [mounts you created](../create-apps/app-reference.md#mounts).
Upload to each mount separately.

Suppose for instance you have the following file mounts defined:

```yaml
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
platform mount:upload --mount web/uploads --source ./uploads
platform mount:upload --mount private --source ./private
```

You can adjust these commands for your own case.
Or upload to your mounts using a different [SSH method](../development/file-transfer.md#transfer-files-using-an-ssh-client).

## Optional: Add variables

If your app requires environment variables to build properly, [add them to your environment](../development/variables/set-variables.md).

## What's next

Now that your app is ready to be deployed, you can do more:

- Upgrade from a Development plan.
- [Add a domain](../domains/steps/_index.md).
- Set up for [local development](../development/local/_index.md).
- Configure [health notifications](../integrations/notifications.md).
- For monitoring and profiling, [integrate Blackfire](../increase-observability/integrate-observability/blackfire.md).
