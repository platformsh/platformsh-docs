---
title: Create a project
weight: 10
description: All you need to know about creating a new project with {{% vendor/name %}}
---

To create a new project on {{% vendor/name %}}, you can use either:
 - [Console (recommended)](#using-the-console-recommended)
 - [CLI](#using-the-cli)

## Using the Console (recommended)

Open the [Upsun management console](https://console.upsun.com/-/create-project) to create your project.

{{% note %}}
If you haven't done so already, you are prompted to create your first organization where your project will reside.
{{% /note %}}

![Create project options](/images/console/create-project.png "0.4")

From the Console, what you do next entirely depends on where the "source of truth" of your codebase is located:

| Codebase  |  Select |
|---|---|
| **Local:** The only copy of your codebase you'd like to deploy is on your local computer  | Click **Start from scratch** from the **Deploy with Git** option  |
| **GitHub:** While you have a local copy, the primary/shared copy of your codebase you'd like to deploy is on a Git hosting service like GitHub  | Click **Connect repository** from the **Deploy with GitHub** option  |

{{< codetabs >}}
+++
title=Local
+++

Add details about your project, such as:

- The name of your project.
- The default branch of your local repository.
- Select the region where you want your project to be hosted.

<--->
+++
title=Remote
+++

The Console flow will take you through a series of steps:

1. Connect with the Git service. For GitHub this will authorize the **Upsun PaaS** app on your account.
1. Once authenticated, select the repository and organization you've just granted permissions to for the current project.
1. If desired, update the project name (which is the repository name by default). Select a region your environments will be deployed to from the list of options.

{{< /codetabs >}}

As suggested in the Console, connect the local copy of your repository to your project:

```bash
upsun project:set-remote {{< variable "PROJECT_ID" >}}
```

For the "Local" path, push your code to Upsun with the command `upsun push`.

Whichever path you've taken ("Local" or "Remote" above), the following error is usually triggered:

![Create project options](/images/console/first-fail.png "0.4")

This error is triggered because you have not yet added Upsun configuration to your project to setup deployments, which is the next step of this guide.

{{< guide-buttons previous="Back" next="Configure your project" nextLink="/get-started/here/configure/_index.md" type="*" >}}

## Using the CLI

To create a new project with the {{% vendor/name %}} CLI, use the following command and follow the prompts:

```bash {location="Terminal"}
{{% vendor/cli %}} project:create
```

{{< note theme="info" title="Default branches" >}}
When creating a new project using the {{% vendor/name %}} CLI command `project:create`, default production branch is set to `main`. Change it if your default branch is different (_e.g._: `master`).

Then, you are asked if you want to set the local remote to your new project. Enter **Yes (y)**.

Your local source code is automatically linked to your newly created {{% vendor/name %}} project by creating a `.{{% vendor/cli %}}/local/project.yaml` file.  This file contains the corresponding `<projectId>` and sets a Git remote to `{{% vendor/cli %}}`.

{{< /note >}}

From the CLI, what you do next entirely depends on where the "source of truth" of your codebase is located:

| Codebase  |  Select |
|---|---|
| **Local:** The only copy of your codebase you'd like to deploy is on your local computer  | Click **Start from scratch** from the **Deploy with Git** option  |
| **Remote:** While you have a local copy, the primary/shared copy of your codebase you'd like to deploy is on a Git hosting service like GitHub  | Click **Connect repository** from the **Deploy with GitHub** option  |

{{< codetabs >}}
+++
title=Local
+++

So long as you chose `y` (yes) to the question `Set the new project <projectName> as the remote for this repository?` during the `project:create` command, your local project is already integrated to the Upsun project.

Push your commits to the project:

```bash
upsun push
```

<--->
+++
title=Remote
+++

While the Upsun project is associated with the `upsun` remote, it's assumed that there is another remote repository (i.e. `origin`) associated with some Git hosting service.
You need to set up an additional integration to that remote repository so that Upsun becomes a read-only mirror, and all development/review continues from the Git service.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

Once the integration is added, the commits are mirrored on Upsun.

{{< /codetabs >}}

Whichever path you've taken ("Local" or "Remote" above), the following error is usually triggered:

```bash
Found 749 commits

E: Error parsing configuration files:
- : Configuration directory '.upsun' not found.

E: Error: Invalid configuration files, aborting build
```

This error is triggered because you have not yet added Upsun configuration to your project to setup deployments, which is the next step of this guide.

{{< guide-buttons previous="Back" next="Configure your project" nextLink="/get-started/here/configure" type="*" >}}
