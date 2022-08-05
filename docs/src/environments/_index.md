---
title: "Manage Platform.sh environments"
weight: -75
sidebarTitle: Manage environments
description: Learn what environments on Platform.sh are and how to take advantage of them.
aliases: 
  - /administration/web/environments.html
---

On Platform.sh, an environment is a logically separate instance of an app or group of apps
with all of the services needed to run the app.

You can think of an environment as a complete working website
that's related to but safely isolated from others in the project.
So you can run tests and review a complete working copy without worrying about damaging anything in production.

Each project includes multiple environments,
often divided into [environment types](../administration/users.md#environment-types).
If you have a live site, you have at least a production environment.
You may also have additional environments for development, testing, staging, review, and so on.

New environments can be created by branching existing environments using the [command line interface (CLI)](/administration/cli/_index.md),
or in the [Console](../administration/web/_index.md).
Each created environment is an exact replica of its parent environment.
This means new environments have all of the data and services from the parent
(like databases, network storage, queues, routing).

To organize your environments, you can create [hierarchical relationships](#hierarchy).

An environment is tied to a Git branch and can be created on demand.
With Bitbucket and GitHub integrations you can even get a "development server" automatically for each and every pull request.

You can have branches that aren't tied to a running instance of your application.
These are called [inactive environments](../other/glossary.md#inactive-environment).

## Default environment

Your default environment comes from your default branch and is a [Production environment](../administration/users.md#environment-types).

If you subscribed to a production plan, this environment is your **live site**
and you can give it a [custom domain name](../domains/steps/_index.md) and a custom SSL certificate.

{{< note >}}

Your project must have a default environment, but you can give it any name.
See how to [rename the default environment](./default-environment.md).

{{< /note >}}

## Hierarchy

![Environment hierarchy](/images/management-console/environments.png "0.5")

In Platform.sh, your environments are organized in a hierarchy.
Each new environment you create is considered a **child** of the **parent** environment from which it was created.

Each child environment can [sync](../other/glossary.md#sync) code and/or data down from its parent
and [merge](../other/glossary.md#merge) code up to its parent.
The child environments are used for development, staging, and testing.

When you [branch](../other/glossary.md#branch) an environment to create a new child environment,
its parent is the environment it was created from.
If you push a branch through Git or a [source integration](../integrations/source/_index.md),
the parent defaults to the default environment.

You can always [change an environment's parent](./change-parent.md).

## Workflows

Since you can organize your environments as you want, you can create your own workflows.
There are no rules you must follow when branching environments.

You can choose a structure that might best fit your workflow.
Some possible approaches:

* **Agile**: A child environment per sprint.
  Each story in the sprint can have its own environment as a child of the sprint environment.
* **Developer-centric**: One QA environment and a few development environments
  (*per developer*, *per task*, or similar).
* **Testing**: An operational test environment, a user test environment, and a few unit test environments.
* **Hotfix**: One environment for every bug, security, or hotfix that needs deployment.

Here is an example of a possible Agile workflow.

The administrator started by [branching](../other/glossary.md#branch) the Live environment to create a Sprint environment.
They then give each developer permission to branch the Sprint environment to create new feature environments.

![Agile branches with Live as the top parent, Sprint as a child, and Feature 1 and Feature 2 as children of Sprint](/images/workflow/branches.svg "0.2")

As Feature 1 is developed, work is reviewed by accessing the deployed Feature 1 environment.
When the review is done, Feature 1 is [merged](../other/glossary.md#merge) into the Sprint environment.

Once the Sprint environment has Feature 1,
the remaining features [sync](../other/glossary.md#sync) with the Sprint environment.
This ensures their working environment is up-to-date with the latest code.

![Features from the Sprint environment are synced with the Feature 2 environment](/images/workflow/sync.svg "0.2")

When the sprint is complete and all features merged into the Sprint environment,
the administrator can make a backup of the live site.
Then they can merge the Sprint environment into the Live environment.

![Features from the Sprint environment are merged into the Live environment](/images/workflow/merge-live.svg "0.2")

The administrator can then sync the next sprint's environment with the Live environment
to repeat and continue the development process.

## Naming conventions

You can organize and work with your development environments in many different ways.
It can help to introduce a convention for how you name and structure your environments.

The name should represent the environment's purpose.
Is it a Staging site to show to your client? Is it an implementation of a new feature?
Is it a hotfix?

If you use Agile, for example, you could create hierarchical environments and name them like this:

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
you could use something like this:

```text
Staging
  Developer1
    Ticket-526
    Ticket-593
  Developer2
    Ticket-395
```

## Environment status

Your environments can have one of two statuses:

* [Active](../other/glossary.md#active-environment):
  A deployed environment with services and data.
* [Inactive](../other/glossary.md#inactive-environment):
  An environment that isn't deployed and has no services or data, only code.

You can see an environment's status in multiple ways:

* [In the Console](../administration/web/configure-environment.md):
  * Inactive environments are lighter in the environment list and don't appear in the environment selector.
  * Open an environment to see its status in the information panel.
* Using the CLI:
  * Run `platform environments --project <PROJECT_ID` or just `platform` within a project directory.

See how to [change an environment's status](./deactivate-environment.md)
