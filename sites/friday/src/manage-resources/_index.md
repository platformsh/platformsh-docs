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
  - "scaling"
---

{{% vendor/name %}} allows you to configure project resources and adjust them at any time.
On each of your environments, you can define which amount of CPU, RAM,
and disk storage you want to allocate to each app and service.

For example, you might want to allocate more resources to your production and staging environments
than to your development environments.
This flexibility in resource allocation allows you to optimize performance and costs.

If your app shows signs of struggling with high load, or if you're expecting a traffic spike,
you can also add instances to your application container.
Such horizontal scaling allows your app to keep running smoothly,
and shields your users from performance issues and downtime.

{{< note >}}

When you first deploy your project on {{% vendor/name %}},
you get notified that you need to configure resources for your project.

This is because {{% vendor/name %}} doesn't know the exact amount of resources your project needs to run smoothly.
Therefore, your app can only be successfully deployed once you've [configured those resources](#configure-individual-container-resources) through the {{% vendor/name %}} Console or [CLI](/administration/cli/_index.md).

For better guidance on how to configure resources when you first deploy a project,
make sure you use `{{% vendor/cli %}} push` instead of `git push`.

{{< /note >}}

## Configure individual container resources

{{< codetabs >}}

+++
title= Using the CLI
+++

Run the `resources: set` command, and follow the prompts to set resources for each of your apps and services.

<--->

+++
title= From the Console
+++

1. Navigate to your environment.
2. Select an app or service in the tree on the left-hand side:
   ![Apps and services tree](/images/flexible-resources/apps-services-tree.png "0.2")
   A window pops up for you to configure resources on the current environment:
   ![Configure your resources on the current environment window](/images/flexible-resources/configure-flexible-resources.png "0.5")
   The values available in this window depend on the [container profile](#1-configure-your-container-profiles) of each instance.
3. For each app and service displayed, select a CPU & RAM combination and enter the amount of disk/storage you want to allocate to each container.
4. For each of your apps, select the number of instances you want to deploy.
5. Click **Save**.</br>
   You environment is redeployed.

{{< /codetabs >}}

{{< note title="Tip" >}}

You can keep an eye on your costs in the {{% vendor/name %}} Console:

- To view a monthly estimate of how much each of your projects is expected to cost,
navigate to your organization and open the **Overview** tab.

- To view a monthly estimate detailing the resources allocated to each instance in a project and the related costs,
navigate to your project and open the **Overview** tab.

Note that this estimate reflects the expected costs **for a full month** based on the way resources are allocated **at the time of viewing**.
It doesn't take into account the history of changes you may have made throughout the current month.</br>
Therefore, if you make changes to resource allocation some time during the month, your monthly invoice will differ from this estimate.

{{< /note >}}

## Advanced: container profiles

By default, {{% vendor/name %}} allocates a container profile to each app and service depending on the range of resources it's expected to need.

Each container profile gives you access to a specific list of CPU and RAM combinations.
Using the {{% vendor/name %}} CLI or Console, you can then pick a CPU and RAM combination for each of your apps and services.

There are four container profiles available: `high_cpu`, `balanced`, `high_memory`, and `higher_memory`.
The following table displays the different CPU and RAM combinations each container profile provides:

| CPU  | `high_cpu`   | `balanced` | `high_memory` | `higher_memory` |
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

You can check which container profile is set for an app or service in your `{{% vendor/configfile "app" %}}` file.

In most cases, it's best not to adjust container profiles.
As a best practice, {{% vendor/name %}} recommends adjusting the profile of a container **only if the CPU/RAM ratio doesn’t match how the container scales**, taking into account both production and preview (staging and development) environments.

{{< note theme="warning" title="Warning" >}}

Do not change the profile of a container to bump the memory of a single environment.
Changing a container profile updates the resources of **all** your environments, which is likely to be more expensive than just increasing the size of a single environment.

{{< /note >}}