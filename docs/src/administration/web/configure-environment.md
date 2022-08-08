---
title: Configure environments
weight: 3
sidebarTitle: Configure environments
description: Configure your environments including their name, status, and visibility.
---

From your project's main page, each environment is available from the **Environment** menu.

![Environment menu in context](/images/management-console/env-pulldown.png "0.4")

There is also a graphic view of your environments where you can view your environments as a list or a project tree.
The names of [inactive environments](../../other/glossary.md#inactive-environment) are lighter.

![List of all environments as a tree](/images/management-console/environments.png "0.5")

Once you select an environment, you can see details about it.

## Activity Feed

You can see all the [activity happening on your environments](../../increase-observability/logs.md#activity-logs).
You can filter activities by type.

![Environment activity list](/images/management-console/activity.png "0.5")

## Actions

Each environment offers ways to keep environments up to date with one another:

* [{{< icon branch >}} **Branch**](../../other/glossary.md#branch) to create a new child environment.
* [{{< icon merge >}} **Merge**](../../other/glossary.md#merge) to copy the current environment into its parent.
* [{{< icon sync >}} **Sync**](../../other/glossary.md#sync)
  to copy changes from its parent environment into the current environment.

There are also additional options:

* {{< icon settings >}} **Settings** to [configure the environment](#environment-settings).
* {{< icon more >}} **More** to get more options.
* **URLs** to access the deployed environment from the web.
* **SSH** to access your project using SSH.
* **Code**
  * **CLI** for the command to get your project set up locally with the [Platform.sh CLI](../cli/_index.md).
  * **Git** for the command to clone the codebase via Git.
  
    If you're using Platform.sh as your primary remote repository, the command clones from the project.
    If you have set up an [external integration](../../integrations/source/_index.md),
    the command clones directly from the integrated remote repository.

    If the project uses an external integration to a repository that you haven't been given access to,
    you can't clone until your access has been updated.
    See how to [troubleshoot source integrations](../../integrations/source/troubleshoot.md).

## Service information

You can also view information about how your routes, services, and apps are currently configured for the environment.

To do so, click **Services**.
By default, you see configured routes.

### Routes

![Services: routes](/images/management-console/service-tab/routes.png "0.5")

The **Router** section shows a list of all configured routes.
For each, you can see its type and whether caching and server side includes have been enabled for it.

To see your `.platform/routes.yaml` file that led to these routes, click **Configuration**.

### Applications

To see more detailed information about an app container, click it in the tree or list.

The **Overview** gives you information about your app.
You can see the language version, the container size, the amount of persistent disk,
the number of active workers and cron jobs, and the command to SSH into the container.

You can also see all cron jobs with their name, frequency, and command.

![Services: app overview](/images/management-console/service-tab/app-overview.png "0.5")

To see the YAML file that led to this configuration, click **Configuration**.

### Services

To see more detailed information about a running service, click it in the tree or list.

The **Overview** gives you information about the given service.
You can see the service version, the container size, and the disk size, if you've configured a persistent disk.

![Services: service overview](/images/management-console/service-tab/service-overview.png "0.5")

To see your `.platform/services.yaml` file that led to these routes, click **Configuration**.

## Environment settings

To see settings for a given environment, click {{< icon settings >}} **Settings** within that environment.

![Settings for an environment](/images/management-console/env-settings.png "0.75")

### Environment name

The first setting allows you to modify the name of the environment and view its parent environment.

### Status

The **Status** setting shows whether or not your environment is [active](../../other/glossary.md#active-environment).
For non-Production environment, you can [change their status](../../environments/deactivate-environment.md).

![Environment status](/images/management-console/env-status.png "0.5")

### Outgoing emails

You can allow your environment to [send outgoing emails](../../development/email.md).

![Environment email](/images/management-console/env-email.png "0.75")

### Search engine visibility

This setting enables you to tell [search engines to ignore the site](../../environments/search-engine-visibility.md).

![Environment search](/images/management-console/env-search.png "0.5")

### HTTP access control

This setting enables you to [control access using HTTP methods](../../environments/http-access-control.md).

![Settings control access with password and by IP](/images/management-console/settings-basics-access-control.png "0.5")

### Variables

Under **Variables**, you can define the [environment variables](../../development/variables/_index.md).

![Configure Platform.sh environment variables](/images/management-console/settings-variables-environment.png "0.6")
