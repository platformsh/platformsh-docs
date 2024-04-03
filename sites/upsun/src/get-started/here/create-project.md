---
title: Create a project
weight: 10
toc: false
description: All you need to know about creating a new project with {{% vendor/name %}}
---

To create a new project on {{% vendor/name %}}, you can take one of two paths:

<details>
  <summary>Using the Console (recommended)</summary>

Open the [{{% vendor/name %}} management console](https://console.upsun.com/-/create-project) to create your project.

{{% note %}}
If you haven't done so already, you are prompted to create your first organization where your project will reside.
{{% /note %}}

![Create project options](/images/console/create-project.png "0.4")

From the Console, what you do next entirely depends on where the "source of truth" of your codebase is located.
In this guide, you will push your local repository to {{% vendor/name %}}.
That is, the only copy of your codebase you'd like to deploy is on your local computer.

Click **Start from scratch** from the **Deploy with Git** option.

{{< note theme="info" title="Git integrations">}}
This guide does not specifically address integrating an {{% vendor/name %}} project with a third party repository such as one on GitHub, even though the **Connect repository** option is available at this stage.

For now, continue to work locally.
Third party integrations will be addressed at the end of this guide.
{{< /note >}}

Add details about your project, such as:

- The name of your project.
- The default branch of your local repository.
- Select the region where you want your project to be hosted.

As suggested in the Console, connect the local copy of your repository to your project:

```bash
{{% vendor/cli %}} project:set-remote {{< variable "PROJECT_ID" >}}
```

Your local source code is automatically linked to your newly created {{% vendor/name %}} project through the creation of a `.{{% vendor/cli %}}/local/project.yaml` file.  This file contains the corresponding `<projectId>` and sets a Git remote to `{{% vendor/cli %}}`.

</details>

<details>
  <summary>Using the CLI</summary>

To create a new project with the {{% vendor/name %}} CLI, use the following command and follow the prompts:

```bash {location="Terminal"}
{{% vendor/cli %}} project:create
```

{{< note theme="info" title="Default branches" >}}
When creating a new project using the {{% vendor/name %}} CLI command `project:create`, the default production branch is set to `main`. Change it if your default branch is different (_e.g._: `master`).
{{< /note >}}

Then, you are asked if you want to set the local remote to your new project. Enter **Yes (y)**.

Your local source code is automatically linked to your newly created {{% vendor/name %}} project through the creation of a `.{{% vendor/cli %}}/local/project.yaml` file.  This file contains the corresponding `<projectId>` and sets a Git remote to `{{% vendor/cli %}}`.

In this guide, you will push your local repository to {{% vendor/name %}}.
That is, the only copy of your codebase you'd like to deploy is on your local computer.

{{< note theme="info" title="Git integrations">}}
This guide does not specifically address integrating an {{% vendor/name %}} project with a third party repository such as one on GitHub, even though you will notice the **Connect repository** option available at this stage.

For now, continue to work locally.
Third party integrations will be addressed at the end of this guide.
{{< /note >}}

So long as you chose `y` (yes) to the question `Set the new project <projectName> as the remote for this repository?` during the `project:create` command, your local project is already integrated to the {{% vendor/name %}} project.

</details>

{{< guide-buttons previous="Back" next="Configure your project" nextLink="/get-started/here/configure/_index.md" type="*" >}}
