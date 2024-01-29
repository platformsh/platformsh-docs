---
title: Create a new project
weight: 10
description: All you need to know about creating a new project with {{% vendor/name %}}
---

To create a new project on {{% vendor/name %}}, you can either use the {{% vendor/name %}} CLI or the {{% vendor/name %}} Console.

## 1. Using the Console (recommended)

Visit the [Upsun management console](https://console.upsun.com/-/create-project) to create your project. 
If you have not done so already, the Console may also ask you to create your first organization the project will reside in. 

![Create project options](/images/console/create-project.png "0.4")

From the Console, what you do next entirely depends on where the "source of truth" of your codebase is located:

| Codebase  |  Select |
|---|---|
| **Local:** The only copy of your codebase you'd like to deploy is on your local computer  | Click **Start from scratch** from the **Deploy with Git** option  |
| **Remote:** While you have a local copy, the primary/shared copy of your codebase you'd like to deploy is on a Git hosting service like GitHub  | Click **Connect repository** from the **Deploy with GitHub** option  |

{{< codetabs >}}
+++
title=Local
+++

Add details about your project, such as:

- The name of your project.
- The default branch of your local repository.
- Select a region your environments will be deployed to from the list of options.

<--->
+++
title=Remote
+++

The Console flow will take you through a series of steps:

1. Connect with the Git service. For GitHub this will authorize the **Upsun PaaS** app on your account.
1. Once authenticated, select the repository and organization you've just granted permissions to for the current project.
1. If desired, update the project name (which is the repository name by default). Select a region your environments will be deployed to from the list of options.

{{< /codetabs >}}

Use the commands provided within the console to connect the local copy of your repository to your project

```bash
upsun project:set-remote {{< variable "PROJECT_ID" >}}
```

Whichever path you've taken ("Local" or "Remote" above), you'll very likely arrive at the same error:

![Create project options](/images/console/first-fail.png "0.4")

All this means is that you have not yet added Upsun configuration to your project to setup deployments, which is the next step of this guide.

{{< guide-buttons previous="Back" next="Configure your project" nextLink="/start/here/configure/_index.md" type="*" >}}

## 2. Using the CLI

Then, to create a new project with the {{% vendor/name %}} CLI, use the following command and follow the prompts:

```bash {location="Terminal"}
{{% vendor/cli %}} project:create
```

{{< note theme="info" title="Default default branches" >}}
When creating a new project using the {{% vendor/name %}} CLI command `project:create`, default production branch is set to `main`, please change it if your default branch is not the same (ex: `master`)

Then, you will be asked if you want to set the local remote to your new project. Enter **Yes (y)**.
Your local source code will be automatically linked to your newly created {{% vendor/name %}} project by creating a `.{{% vendor/cli %}}/local/project.yaml` file that will contain the corresponding `<projectId>` and set a Git remote to `{{% vendor/cli %}}`.

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

So long as you chose `y` (yes) to the question `Set the new project <projectName> as the remote for this repository? [Y/n]` during the `project:create` command, your local project is already integrated to the Upsun project. 

Push your commits to the project:

```bash
upsun push
```

<--->
+++
title=Remote
+++

While the Upsun project is associated with the `upsun` remote, it's assumed that there is another remote repository (i.e. `origin`) associated with some Git hosting service.
You will need to set up an additional integration to that remote repository so that Upsun become a read-only mirror, and all development/review continues from the Git service. 

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

Once the integration is added, the commits will be mirrored on Upsun.

{{< /codetabs >}}

Whichever path you've taken ("Local" or "Remote" above), you'll very likely arrive at the same error:

```bash
Found 749 commits

E: Error parsing configuration files:
- : Configuration directory '.upsun' not found.

E: Error: Invalid configuration files, aborting build
```

All this means is that you have not yet added Upsun configuration to your project to setup deployments, which is the next step of this guide.

{{< guide-buttons previous="Back" next="Configure your project" nextLink="/start/here/configure/_index.md" type="*" >}}
