---
title: "Manage Platform.sh environments"
weight: -75
layout: single
sidebarTitle: Manage environments
description: Learn what environments on Platform.sh are and how to take advantage of them.
---

A Platform.sh environment contains one instance of an app (or [group of apps](../create-apps/multi-app.md))
with all the services needed for it to run.

You can think of an environment as a complete working website
that's related to but safely isolated from others in your project.
So you can run tests and review a complete working copy without worrying about damaging anything in production.

Each project includes multiple environments,
often divided into [environment types](../administration/users.md#environment-types).
If you have a live site, you have at least a production environment.
You may also have additional environments for development, testing, staging, review, and so on.
To organize your environments, you can create [hierarchical relationships](#hierarchy).

To create new environments, you can branch existing environments using the [CLI](/administration/cli/_index.md)
or the [Console](../administration/web/_index.md).
Each created environment is an exact replica of its parent environment.
This means new environments inherit all of the data and services from their parent environment.
This includes databases, network storage, queues, and routing configurations.

You can create environments on demand.
Each environment is tied to a Git branch.
With [Bitbucket](../integrations/source/bitbucket.md) and [GitHub](../integrations/source/github.md) integrations,
you can even get a "development server" automatically for every pull request.

You can also have branches that aren't tied to a running instance of your application.
These are called [inactive environments](#environment-status).

## Default environment

Your default environment comes from your default branch and is a [production environment](../administration/users.md#environment-types).
Your project must have a default environment,
but you can [name it as you want](./default-environment.md).

If you subscribed to a production plan, this environment is your **live site**.
You can give it a [custom domain name](../domains/steps/_index.md) and a [custom TLS certificate](../domains/steps/tls.md).

## Environment status

Your environments can have one of two statuses:

-   [Active](../other/glossary.md#active-environment):
    A deployed environment with services and data.

-   [Inactive](../other/glossary.md#inactive-environment):
    An environment that isn't deployed and has no services or data, only code.
    For example, when you push a local branch created with Git to your project,
    it creates an inactive environment.

You can see the status of your environments in the [Console](../administration/web/_index.md) or the [CLI](/administration/cli/_index.md).

{{< codetabs >}}
+++
title=In the Console
+++

When you open your project, inactive environments appear lighter in the environment list.
You also can't select them from the **Environment** dropdown menu.

To check the status of an environment,
you can also open it and view its information panel.

<--->
+++
title=Using the CLI
+++

To check the status of all your environments, run the `platform environments` command within your project directory.

{{< /codetabs >}}

Note that you can [change an environment's status](./deactivate-environment.md).

## Organize your environments

### Hierarchy

![Environment hierarchy](/images/management-console/environments.png "0.5")

In Platform.sh, your environments are organized in a hierarchy.
Each new environment you create is considered a **child** of the **parent** environment from which it was created.

Each child environment can [sync](../other/glossary.md#sync) code and/or data down from its parent
and [merge](../other/glossary.md#merge) code up to its parent.
You can use child environments for development, staging, and testing.

When you [branch](../other/glossary.md#branch) an environment to create a new child environment,
its parent is the environment it was created from.
If you push a branch through Git or a [source integration](../integrations/source/_index.md),
the parent environment is your [default environment](#default-environment).

You can always [change an environment's parent](./change-parent.md).

### Workflows

Since you can customize your [environment hierarchy](#hierarchy), you can create your own workflows. 
You don't have to follow any rules when branching environments.
You can decide which structure best fits your needs. 

#### Possible approaches

You may want to take one of the following approaches when creating your workflows:

-   **Agile**: A child environment per sprint.
    Each story in the sprint can have its own environment as a child of the sprint environment.

-   **Developer-centric**: One QA environment and a few development environments
    (*per developer*, *per task*, or similar).

-   **Testing**: An operational test environment, a user test environment, and a few unit test environments.

-   **Hotfix**: One environment for every bug, security, or hotfix that needs deployment.

#### Example workflow

Example of an Agile workflow :

1.  The admin [branches](../other/glossary.md#branch) the Live environment to create a Sprint environment.

2.  The admin gives each developer permission to branch the Sprint environment to create new feature environments.

    ![Agile branches with Live as the top parent, Sprint as a child, and Feature 1 and Feature 2 as children of Sprint](/images/workflow/branches.svg "0.2")

3.  Feature 1 is developed and work is reviewed by accessing the deployed Feature 1 environment.

4.  When the review is done, Feature 1 is [merged](../other/glossary.md#merge) into the Sprint environment.

5.  The remaining features [sync](../other/glossary.md#sync) with the Sprint environment.
    This ensures their working environment is up-to-date with the latest code.

    ![Features from the Sprint environment are synced with the Feature 2 environment](/images/workflow/sync.svg "0.2")

6.  When the sprint is complete and all features merged into the Sprint environment,
    the admin makes a backup of the live site.

7.  The admin merges the Sprint environment into the Live environment.

    ![Features from the Sprint environment are merged into the Live environment](/images/workflow/merge-live.svg "0.2")

8.  The admin syncs the next sprint's environment with the Live environment
    to repeat and continue the development process.

### Naming conventions

You can organize and work with your development environments in many different ways.
It can help to introduce a convention for how you name and structure your environments.

For each environment, choose a name that represents what the environment is for.
If you use Agile, for example, you can adopt a naming convention similar to the following:

```text
Live
 Sprint1
   Feature1
   Feature2
   Feature3
 Sprint2
   Feature1
   Feature2
```

If you prefer splitting your environments per developer and having a specific environment for each task or ticket,
you can adopt a naming convention similar to the following:

```text
Staging
 Developer1
   Ticket-526
   Ticket-593
 Developer2
   Ticket-395
```
