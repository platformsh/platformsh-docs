---
title: How to create a new project
sidebarTitle: Create a new project
weight: 10
description: All you need to know about creating a new project with {{% vendor/name %}}
---

## Create a new project

To create a new project on {{% vendor/name %}}, you can either use the {{% vendor/name %}} CLI or the {{% vendor/name %}} Console.

{{< codetabs >}}
+++
title=Using the CLI
+++
You will first need to install the CLI by using following command:

```bash {location="Terminal"}
brew install platformsh/tap/upsun-cli
```

Then, to create a new project with the {{% vendor/name %}} CLI, use the following command and follow the prompt:
```bash {location="Terminal"}
{{% vendor/cli %}} project:create
```

{{< note >}}
When creating a new project using the {{% vendor/name %}} CLI command `project:create`, default production branch is set to ``main``, please change it if your default branch is not the same (ex: `master`)

Then, you will be asked if you want to set the local remote to your new project. Enter **Yes (y)**.
Your local source code will be automatically linked to your newly created {{% vendor/name %}} project by creating a `.{{% vendor/cli %}}/local/project.yaml` file that will contain the corresponding `<projectId>` and set a Git remote to `{{% vendor/cli %}}`.

```bash {location="Terminal"}
git remote
{{% vendor/cli %}}
```

If not, please refer to [Set project remote](#set-project-remote) section.
{{< /note >}}

<--->
+++
title=Using the Console
+++

[Create a new project from scratch]({{% create-project-link scratch=true %}}).

If you do not already have an organization created to put the project in, you'll first be instructed to create one.

Once you have done so, select that organization from the dropdown, and select **Create from scratch**.

In the form, fill in details like the project name and [region](/development/regions.md), submit the form and then follow instructions displayed in your setup interface.

[//]: # (You'll be able to define resources for the project after your first push.)

[//]: # (After creating a project with the Console, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.)

{{< /codetabs >}}


## Set your project remote

{{< note >}}
If you used the {{% vendor/name %}} CLI command `{{% vendor/cli %}} project:create` to create your project and your local Git repository has already been initialized, your local source code should already contain a ``.{{% vendor/cli %}}/local/project.yaml`` file. This file contains your `projectId`, and you already have a Git remote repository set to `{{% vendor/cli %}}`.
You can jump to [deploying your project](/get-started/quick-start/deploy.md).
{{< /note >}}

There are slightly different ways to link your local project to your {{% vendor/name %}} project based on the Git workflow you chose for your project, as discussed earlier in this guide.

{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
If you host your source code on an {{% vendor/name %}} Git repository, and you failed to answer `y` (yes) to the question `Set the new project <projectName> as the remote for this repository? [Y/n]` during the ``project:create`` command, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.

To do so, use the {{% vendor/name %}} CLI to set a remote project:
```bash {location="Terminal"}
{{% vendor/cli %}} project:set-remote <projectId>
```

This command will add a new remote called `{{% vendor/cli %}}` to your local Git repo as you can see below:
```bash {location="Terminal"}
git remote
{{% vendor/cli %}}
...
```

It will also create a new `.{{% vendor/cli %}}/local/project.yaml` file that will contain the given `<projectId>`, to store this information for the {{% vendor/name %}} CLI interaction.

{{< note >}}
If you don’t remember your `<projectId>` from the previous steps, you can get it back using this command line and select the one you created:
```bash {location="Terminal"}
{{% vendor/cli %}} project:list
```
{{< /note >}}

<--->
+++
title=GitHub repository
+++
{{% guides/whitelabel/git_integration git="GitHub" stack="" %}}
<--->

[//]: # (TODO uncomment this tab when Gitlab or Bitbucket integration would be available)
[//]: # (+++)

[//]: # (title=Gitlab repository)

[//]: # (+++)

[//]: # ({{% guides/whitelabel/git_integration git="Gitlab" stack="Express" %}})

[//]: # (<--->)

[//]: # (+++)

[//]: # (title=Bitbucket repository)

[//]: # (+++)

[//]: # ({{% guides/whitelabel/git_integration git="Bitbucket" stack="Express" %}})

{{< /codetabs >}}

{{< guide-buttons type="*" >}}
