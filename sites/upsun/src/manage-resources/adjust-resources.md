---
title: Resource configuration
description: Configure CPU, RAM, and disk storage on a per-environment basis so your apps and services can run smoothly.
weight: -200
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

When you first deploy your project, or add a new app or service to it,
{{% vendor/name %}} allocates [default resources](/manage-resources/resource-init.md#default-resources) to each of your containers.
If you don't want to use those default resources, define a different [resource initialization strategy](/manage-resources/resource-init#specify-a-resource-initialization-strategy).

After the initial deployment, or if you opt for the `Manual` [resource initialization strategy](/manage-resources/resource-init#specify-a-resource-initialization-strategy),
you can adjust container resources manually.
To do so, follow the instructions on this page.

{{% vendor/name %}} allows you to configure resources (CPU, RAM, and disk) per environment for each app and service.
You can also add instances for each app depending on your needs.

For example, you can scale vertically and allocate more resources to your production and staging environments
than to your development environments.
This flexibility allows you to optimize performance and costs.

You can also scale horizontally if your apps are struggling with high load, or if you're expecting a traffic spike,
by adding more instances for your apps and workers.

{{< note >}}

For information on costs related to resource usage, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).
You can [monitor these costs](/administration/billing/monitor-billing.md) in the Console.

{{< /note >}}

## Vertical scaling

To define how much CPU, RAM, and disk storage you want to allocate to each individual container,
follow these steps:

{{< codetabs >}}

+++
title= Using the CLI
+++

To set resources for each of your apps and services,
you can use the {{% vendor/name %}} CLI interactive prompts, or run commands manually.

- **Interactive prompts:**

Run the `{{% vendor/cli %}} resources:set` command, and follow the prompts to set resources for each app and service.

{{< note >}}

For further guidance on how to set resources using the CLI, run the `{{% vendor/cli %}} resources:set --help` command.
Note that if the deployment fails after you've run `{{% vendor/cli %}} resources:set`,
you may need to set the resources again.

{{< /note >}}

After you've set resources, your environment is redeployed,
which causes a short downtime.

- **Manual commands:**

Run the `resources:set` command using the following CLI options:

| CLI option        | Description                     |
| ----------------- | --------------------------------|
| `size`            | Allows you to define how much CPU you want to allocate to each app or service.</br>The amount of CPU then determines how much RAM is also allocated, based on the [container profile](#advanced-container-profiles). |
| `disk`            | Allows you to define how much disk/storage you want to allocate to each app or service. |

_Example 1:_

The following command allocates `0.1` CPU to the `frontend` app, `0.25` CPU to the `backend` app, and `1` CPU to the `database` service.
The amount of RAM these settings translate into depends on each [container profile](#advanced-container-profiles).

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set --size frontend:0.1,backend:0.25,database:1
```

_Example 2:_

The following command allocates `640 MB` of disk to the `backend` app, and `2048 MB` to the `database` service:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set --disk backend:640,database:2048
```

_Example 3:_

You can also use wildcards. For example, if you have two apps named `frontend` and `backend`,
you could allocate the same CPU and RAM combination to both by using the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set --size '*end:0.1'
```

<--->

+++
title= From the Console
+++

1. Open your project.
2. Click the **Configure resources** button in the project card or the **App & Services** panel:
   ![Project card](/images/flexible-resources/configure-button-project-card.png "0.5")
3. For each app and service, select a CPU & RAM combination, and enter the amount of disk/storage you want to allocate.
   ![Configure your resources on the current environment window](/images/flexible-resources/configure-flexible-resources.png)
   {{< note >}}
   The values from the **CPU & RAM** menu depend on the [container profile](#advanced-container-profiles) of each instance.</br>
   If you deploy several instances of your app, the selected CPU & RAM combination isn't divided between those instances.
   Each instance benefits from the full, selected CPU & RAM.
   {{< /note >}}
4. Click **Save**.</br>
   You environment is redeployed, which causes a short downtime.

{{< /codetabs >}}

## Horizontal scaling

For apps and workers, you can also define how many instances you want to deploy.
To do so, follow these steps:

{{< note >}}

When you have several instances of an app, the {{% vendor/name %}} router randomly distributes requests to available instances.

{{< /note >}}

{{< codetabs >}}

+++
title= Using the CLI
+++

To define how many instances of an app or worker you want to deploy,
you can use the {{% vendor/name %}} CLI interactive prompts,
or run commands manually.

- **Interactive prompts:**

  Run the `{{% vendor/cli %}} resources:set` command, and follow the prompts to set resources for each app and service.

  {{% note %}}
  For further guidance on how to set resources using the CLI, run the `{{% vendor/cli %}} resources:set --help` command.

  Note that if the deployment fails after you've run `{{% vendor/cli %}} resources:set`,
  you may need to set the resources again.
  {{% /note %}}

- **Manual commands:**

  To scale an app or worker, run the following command:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} resources:set --count {{< variable "APP_NAME" >}}:{{< variable "NUMBER_OF_INSTANCES" >}}
  ```

  For example, to scale your `myapp` app to 3 instances, run the following command:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} resources:set --count myapp:3
  ```

  You can also set the same instance count for all your apps using a wildcard.
  To do so, run the following command:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} resources:set --count '*:{{< variable "NUMBER_OF_INSTANCES" >}}'
  ```

  For example, to scale all your apps to 3 instances, run the following command:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} resources:set --count '*:3'
  ```
  {{% note %}}
  For further guidance on how to set resources using the CLI, run the `{{% vendor/cli %}} resources:set --help` command.

  After you've set the number of instances for your apps and workers, your environment is redeployed.
  If you've made no other changes, this redeployment causes no downtime.

  If the redeployment fails after you've run `{{% vendor/cli %}} resources:set`,
  you may need to set the resources again.
  {{% /note %}}

<--->

+++
title= From the Console
+++

1. Open your project.
1. Click the **Configure resources** button in the project card or the **App & Services** panel:
   ![Project card](/images/flexible-resources/configure-button-project-card.png "0.5")
1. For each of your apps and workers, select the number of instances you want to deploy.
   ![Configure your resources on the current environment window](/images/flexible-resources/configure-flexible-resources.png)
   {{< note >}}
   If you deploy several instances of your app, the [selected CPU & RAM combination](#vertical-scaling) isn't divided between those instances.
   Each instance benefits from the full, selected CPU & RAM.
   {{< /note >}}
1. Click **Save**.</br>
   Your environment is redeployed.
   If you've only made changes to the number of instances for your apps and workers,
   this redeployment causes no downtime.

{{< /codetabs >}}


## Advanced: Container profiles

By default, {{% vendor/name %}} allocates a container profile to each app and service depending on the range of resources it's expected to need.

Each container profile gives you access to a specific list of CPU and RAM combinations.
Using the {{% vendor/name %}} CLI or Console, you can then pick a CPU and RAM combination for each of your apps and services.

There are four container profiles available: `HIGH_CPU`, `BALANCED`, `HIGH_MEMORY`, and `HIGHER_MEMORY`.
The following table displays the different CPU and RAM combinations each container profile provides:

| CPU  | `HIGH_CPU`   | `BALANCED` | `HIGH_MEMORY` | `HIGHER_MEMORY` |
| ---- | ------------ | ---------- | ------------- | --------------- |
| 0.1  | 64 MB        | 352 MB     | 448 MB        | 864 MB          |
| 0.25 | 128 MB       | 640 MB     | 832 MB        | 1472 MB         |
| 0.5  | 224 MB       | 1088 MB    | 1408 MB       | 2368 MB         |
| 1    | 384 MB       | 1920 MB    | 2432 MB       | 3840 MB         |
| 2    | 704 MB       | 2800 MB    | 4032 MB       | 6336 MB         |
| 4    | 1216 MB      | 4800 MB    | 6720 MB       | 10496 MB        |
| 6    | 1728 MB      | 6080 MB    | 9024 MB       | 14080 MB        |
| 8    | 2240 MB      | 7296 MB    | 11200 MB      | 17408 MB        |

You can check which container profile is set for an app or service in your project from the Console.
To do so, navigate to your environment and select the app or service in the tree on the left-hand side:
![Apps and services tree](/images/flexible-resources/check-container-profile.png "0.25")

For information on resource-related costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

### Default container profiles

The following table shows the default container profiles {{% vendor/name %}} applies when first deploying your project.

| Container               | Default profile  |
|-------------------------|------------------|
| Chrome Headless         | HIGH_CPU         |
| ClickHouse              | HIGH_MEMORY      |
| .NET                    | HIGH_CPU         |
| Elasticsearch           | HIGH_MEMORY      |
| Elasticsearch Premium   | HIGH_MEMORY      |
| Elixir                  | HIGH_CPU         |
| Go                      | HIGH_CPU         |
| Gotenberg               | HIGH_MEMORY      |
| InfluxDB                | HIGH_MEMORY      |
| Java                    | HIGH_MEMORY      |
| Kafka                   | HIGH_MEMORY      |
| Lisp                    | HIGH_CPU         |
| MariaDB                 | HIGH_MEMORY      |
| Memcached               | BALANCED         |
| MongoDB                 | HIGH_MEMORY      |
| MongoDB Premium         | HIGH_MEMORY      |
| Network Storage         | HIGH_MEMORY      |
| NodeJS                  | HIGH_CPU         |
| OpenSearch              | HIGH_MEMORY      |
| Oracle Java             | HIGH_MEMORY      |
| Oracle MySQL            | HIGH_MEMORY      |
| PHP                     | HIGH_CPU         |
| PostgreSQL              | HIGH_MEMORY      |
| Python                  | HIGH_CPU         |
| RabbitMQ                | HIGH_MEMORY      |
| Redis ephemeral         | BALANCED         |
| Redis persistent        | BALANCED         |
| Ruby                    | HIGH_CPU         |
| Rust                    | HIGH_CPU         |
| Solr                    | HIGH_MEMORY      |
| Varnish                 | HIGH_MEMORY      |
| Vault KMS               | HIGH_MEMORY      |

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
