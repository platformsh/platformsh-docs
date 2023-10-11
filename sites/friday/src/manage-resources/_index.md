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

{{% vendor/name %}} allows you to configure resources (CPU, RAM, disk) per environment for each of your applications and services.
You can also add instances for each of your applications depending on your needs.

For example, you can scale vertically and allocate more resources to your production and staging environments
than to your development environments.
This flexibility allows you to optimize performance and costs.

You can even scale horizontally if your applications are struggling with high load, or if you're expecting a traffic spike,
by adding more instances for your applications and workers.

{{< note >}}

When you first deploy your {{% vendor/name %}} project, and whenever you add a new application or service,
you get notified that you need to configure the resources on your environment:

```bash
The push completed but resources must be configured before deployment can succeed.
```

This is because {{% vendor/name %}} doesn't know the exact amount of resources your project needs to run smoothly.
Therefore, your app can only be successfully deployed after you've configured those resources
through the {{% vendor/name %}} Console or CLI.

For better guidance on how to configure resources,
use `{{% vendor/cli %}} push` instead of `git push`.

{{< /note >}}

## Configure resources

### Vertical scaling

You can define how much CPU, RAM, and disk storage you want to allocate to each individual container.
To do so, follow these steps:

{{< codetabs >}}

+++
title= Using the CLI
+++

Run the `{{% vendor/cli %}} resources:set` command, and follow the prompts to set resources for each of your apps and services.

{{< note title= "Tip" >}}

For further guidance on how to set resources using the CLI, run the `{{% vendor/cli %}} resources:set --help` command.

{{< /note >}}

After you've set resources, your environment is redeployed,
which causes a short downtime.

<--->

+++
title= From the Console
+++

1. Navigate to your environment.
2. Select an app or service in the tree on the left-hand side:
   ![Apps and services tree](/images/flexible-resources/apps-services-tree.png "0.2")
   A window pops up.
3. Click **Configure**.
4. For each app and service, select a CPU & RAM combination, and enter the amount of disk/storage you want to allocate.
   ![Configure your resources on the current environment window](/images/flexible-resources/configure-flexible-resources.png)
   Note that the values available in the **CPU & RAM** menus depend on the [container profile](#advanced-container-profiles) of each instance.
5. Click **Save**.</br>
   You environment is redeployed, which causes a short downtime.

{{< /codetabs >}}

### Horizontal scaling

For apps and workers, you can also define how many instances you want to deploy.
To do so, follow these steps:

{{< codetabs >}}

+++
title= Using the CLI
+++

To define how many instances of an app or worker you want to deploy,
you can use the {{% vendor/name %}} CLI's interactive prompts,
or run commands manually.

- **Interactive prompts:**

  Run the `{{% vendor/cli %}} resources:set` command, and follow the prompts to set resources for each of your apps and services.

  For further guidance on how to set resources using the CLI, run the `{{% vendor/cli %}} resources:set --help` command.

- **Manual commands:**

  To scale an app or worker, run the following command:

  ```bash
  {{% vendor/cli %}} resources:set --count {{< variable "APP_NAME" >}}:{{< variable "NUMBER_OF_INSTANCES" >}}
  ```
  
  For example, to scale your `myapp` app to 3 instances, run the following command:

  ```bash
  {{% vendor/cli %}} resources:set --count myapp:3
  ```

  You can also set the same instance count for all your apps using a wildcard.
  To do so, run the following command:
  
  ```bash
  {{% vendor/cli %}} resources:set --count '*:{{< variable "NUMBER_OF_INSTANCES" >}}'
  ```

  For example, to scale all your apps to 3 instances, run the following command:

  ```bash
  {{% vendor/cli %}} resources:set --count '*:3'
  ```

  For further guidance on how to set resources using the CLI, run the `{{% vendor/cli %}} resources:set --help` command.

  After you've set the number of instances for your apps and workers, your environment is redeployed.
  If you've made no other changes, this redeployment causes no downtime.

<--->

+++
title= From the Console
+++

1. Navigate to your environment.
2. Select an app or service in the tree on the left-hand side:
   ![Apps and services tree](/images/flexible-resources/apps-services-tree.png "0.2")
   A window pops up.
3. Click **Configure**.
4. For each of your apps and workers, select the number of instances you want to deploy.
   ![Configure your resources on the current environment window](/images/flexible-resources/configure-flexible-resources.png)
5. Click **Save**.</br>
   Your environment is redeployed.
   If you've only made changes to the number of instances for your apps and workers,
   this redeployment causes no downtime.

{{< /codetabs >}}

## Actions on environments

### Environment creation

When you [branch an environment](/glossary.md#branch) to create a new child environment,
the child environment inherits all the resources from its parent.

### Environment merge

When you [merge](/glossary.md#merge) a child environment into a parent environment,
any app or service on the child environment is merged into the parent.
For the merge and deployment to be complete,
you need to allocate resources to each of these newly added instances.

### Environment sync

When you [sync an environment](/glossary.md#sync),
the source environment's disk size is automatically allocated to the target environment.
This is to ensure that there's enough disk space on the target environment for the synchronization to succeed.

## Resource billing

If you have the [**Manage Billing** permission](/administration/users.md#organization-permissions) on your organization,
you can keep an eye on your costs.</br>
To do so, after you've set or updated resources on your project,
follow these steps in the {{% vendor/name %}} Console:

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   A monthly estimate of how much each project is expected to cost is displayed.
4. You can also view the costs related to every project you've been added to.</br>
   To do so, click **{{< icon more >}} More** next to the project,
   and select **Project Billing**.</br>
   A monthly estimate of all the expected costs related to resource allocation on the project is displayed.

{{< note >}}

These estimates reflect the expected costs **for a full month** based on the way resources are allocated **at the time of viewing**.
They don't take into account the history of changes you may have made throughout the current month.</br>
Therefore, if you make changes to resource allocation during the month, your monthly invoice will differ from these estimates.

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
