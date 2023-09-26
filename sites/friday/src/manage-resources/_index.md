---
title: Manage resources
description: Configure CPU, RAM and disk storage on a per-environment basis so your apps and services can run smoothly.
weight: -100
keywords:
  - "resources"
  - "flexible resources"
  - "CPU"
  - "RAM"
  - "disk storage"
  - "horizontal scaling"
  - "vertical scaling"
  - "scaling"
---

{{% vendor/name %}} allows you to configure project resources and adjust them at any time.
On each of your environments, you can perform vertical scaling by defining how much CPU, RAM,
and disk storage you want to allocate to each app and service.

For example, you might want to allocate more resources to your production and staging environments
than to your development environments.
This flexibility in resource allocation allows you to optimize performance and costs.

If your app shows signs of struggling with high load, or if you're expecting a traffic spike,
you can also add instances to your application and worker containers.
Such horizontal scaling allows your app to keep running smoothly,
and shields your users from performance issues and downtime.

{{< note >}}

When you first deploy your project on {{% vendor/name %}},
you get notified that you need to configure resources for your project.

This is because {{% vendor/name %}} doesn't know the exact amount of resources your project needs to run smoothly.
Therefore, your app can only be successfully deployed once you've [configured those resources](#configure-individual-container-resources) through the {{% vendor/name %}} Console or [CLI](/administration/cli/_index.md).

For the same reasons, when you add an app or service to your project after it's initially deployed,
you also get prompted to configure adequate resources for each instance.

For better guidance on how to configure resources when you first deploy a project,
make sure you use `{{% vendor/cli %}} push` instead of `git push`.

{{< /note >}}

## Vertical and horizontal scaling

Perform vertical scaling by defining how much CPU, RAM, and disk storage you want on each individual container.
For apps and workers, you can also perform horizontal scaling by defining how many instances you want to deploy.

{{< note >}}

When you perform horizontal scaling without any other change, no downtime is involved.
However, vertical scaling always entails a short downtime, as any deployment does.

{{< /note >}}

To configure those resources, follow these steps:

{{< codetabs >}}

+++
title= Using the CLI
+++

Run the `{{% vendor/cli %}} resources:set` command, and follow the prompts to set resources for each of your apps and services.

{{< note title= "Tip" >}}

For further guidance on how to set resources using the CLI, run the `{{% vendor/cli %}} resources:set --help` command.

{{< /note >}}

After you've set resources, your environment is redeployed.

<--->

+++
title= From the Console
+++

1. Navigate to your environment.
2. Select an app or service in the tree on the left-hand side:
   ![Apps and services tree](/images/flexible-resources/apps-services-tree.png "0.2")
   A window pops up.
3. Click **Configure**.
4. Select values in the dropdown menus depending on your needs:
   ![Configure your resources on the current environment window](/images/flexible-resources/configure-flexible-resources.png)
   Note that the values available in the **CPU & RAM** menus depend on the [container profile](#advanced-container-profiles) of each instance.
   - For each app and service displayed, select a CPU & RAM combination and enter the amount of disk/storage you want to allocate to each container.
   - For each of your apps and workers, select the number of instances you want to deploy.
5. Click **Save**.</br>
   You environment is redeployed.

{{< /codetabs >}}

## Environment sync

When you [sync an environment](/glossary.md#sync),
the source environment's disk size is automatically allocated to the target environment.
This is to ensure that there's enough disk space on the target environment for the synchronization to succeed.

## Keep an eye on your costs

If you have the [**Manage Billing** permission](/administration/users.md#organization-permissions) on your organization,
you can keep an eye on your costs.</br>
To do so, after you've set or updated resources on your project,
follow these steps in the {{% vendor/name %}} Console:

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   A monthly estimate of how much each project is expected to cost is displayed.
4. To view the costs related to a specific project, click **{{< icon more >}} More** next to the project.
5. Select **Project Billing**.</br>
   A monthly estimate of all the expected costs related to resource allocation on your project is displayed.

{{< note >}}

This estimate reflects the expected costs **for a full month** based on the way resources are allocated **at the time of viewing**.
It doesn't take into account the history of changes you may have made throughout the current month.</br>
Therefore, if you make changes to resource allocation some time during the month, your monthly invoice will differ from this estimate.

{{< /note >}}

## Advanced: Container profiles

By default, {{% vendor/name %}} allocates a container profile to each app and service depending on the range of resources it's expected to need.

Each container profile gives you access to a specific list of CPU and RAM combinations.
Using the {{% vendor/name %}} CLI or Console, you can then pick a CPU and RAM combination for each of your apps and services.

There are four container profiles available: `HIGH_CPU`, `BALANCED`, `HIGH_MEMORY`, and `HIGHER_MEMORY`.
The following table displays the different CPU and RAM combinations each container profile provides:

| CPU  | `HIGH_CPU`   | `BALANCED` | `HIGH_MEMORY` | `HIGHER_MEMORY` |
| ---- | ------------ | ---------- | ------------- | --------------- |
| 0.1  | 64           | 352        | 448           | 864             |
| 0.25 | 128          | 640        | 832           | 1472            |
| 0.5  | 224          | 1088       | 1408          | 2368            |
| 1    | 384          | 1920       | 2432          | 3840            |
| 2    | 704          | 2800       | 4032          | 6336            |
| 4    | 1216         | 4800       | 6720          | 10496           |
| 6    | 1728         | 6080       | 9024          | 14080           |
| 8    | 2240         | 7296       | 11200         | 17408           |
| 10   | 2688         | 8448       | 13184         | 20544           |

You can check which container profile is set for an app or service in your project from the Console.
To do so, navigate to your environment and select the app or service in the tree on the left-hand side:
![Apps and services tree](/images/flexible-resources/check-container-profile.png "0.25")

### Default container profiles

The following table shows the default container profiles {{% vendor/name %}} applies when first deploying your project.

| Container               | Default profile  |
|-------------------------|------------------|
| .NET                    | HIGH_CPU         |  
| Elasticsearch           | HIGH_MEMORY      |
| Elasticsearch Premium   | HIGH_MEMORY      |
| Galera cluster          | HIGH_MEMORY      |
| Go                      | HIGH_CPU         |  
| Java                    | HIGH_MEMORY      |
| MariaDB                 | HIGH_MEMORY      |
| Memcached               | BALANCED         |
| MongoDB                 | HIGH_MEMORY      |
| MongoDB Premium         | HIGH_MEMORY      |
| MySQL                   | HIGH_MEMORY      |
| Network Storage         | HIGH_MEMORY      |
| NodeJS                  | HIGH_CPU         |  
| OpenSearch              | HIGH_MEMORY      |
| Oracle Java             | HIGH_CPU         |  
| Oracle MySQL            | HIGH_MEMORY      |
| PHP                     | HIGH_CPU         | 
| PostgreSQL              | HIGH_MEMORY      |
| Python                  | HIGH_CPU         | 
| Rabbitmq                | HIGH_MEMORY      |
| Redis ephemeral         | BALANCED         |
| Redis persistent        | BALANCED         |
| Ruby                    | HIGH_CPU         | 
| Solr                    | HIGH_MEMORY      |
| Varnish                 | HIGH_MEMORY      |

### Adjust a container profile

In most cases, it's best not to adjust container profiles.
As a best practice, {{% vendor/name %}} recommends adjusting the profile of a container **only if the CPU/RAM ratio doesn’t match how the container scales**,
taking into account both production and preview (staging and development) environments.

To adjust a container profile, amend the value of the `container_profile` key in your configuration:

```yaml {configFile="app"}
applications:
    {{< variable "APP_NAME" >}}:
        container_profile: HIGH_MEMORY

services:
    {{< variable "SERVICE_NAME" >}}:
        type: {{< variable "SERVICE_TYPE" >}}:{{< variable "VERSION" >}}
        container_profile: HIGHER_MEMORY
```