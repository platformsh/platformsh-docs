---
title: Resource initialization
description: Learn how resources are allocated by default upon first deployment, and how you can define a resource initialization strategy that better fits your needs.
weight: -300
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

When you first deploy your project or add a new container to it,
{{% vendor/name %}} uses [default resources](#default-resources)
unless you specify a [resource initialization strategy](#specify-a-resource-initialization-strategy).

You can also use a specific resource initialization strategy when performing certain actions,
such as [branching](#environment-branch), [merging](#environment-merge),
and [activating](#environment-activation) an environment, or [restoring a backup](#backup-restoration).

## Default resources

{{% vendor/name %}} allocates the following default resources to every container when deployed for the first time:

| Resource type               | Amount |
| --------------------------- | ----------- |
| CPU                         | 0.5 |
| RAM                         | Depends on the [container profile](/manage-resources/adjust-resources.md#advanced-container-profiles). |
| Disk size (only applicable if the app or service requires a disk)                   | 512 MB |

If you don't want to use these default resources, you can specify a [resource initialization strategy](/manage-resources/resource-init.md#specify-a-resource-initialization-strategy).
You can also [adjust resources](/manage-resources/adjust-resources.md) after your project or new container has been deployed.

{{% note %}}

For information on costs related to resource usage, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).
You can [monitor these costs](/administration/billing/monitor-billing.md) in the Console.

{{% /note %}}

## Specify a resource initialization strategy

{{% vendor/name %}} provides the following resource initialization strategies:

| Strategy | Description |
| ---------| ----------- |
| `default`  | Initializes new containers using the [{{% vendor/name %}} default resources](#default-resources).</br>This strategy applies when you first deploy your project (or new container) unless you explicitly specify a different strategy, or allocate resources manually via the `resources:set` CLI command.  |
| `manual`   | With this strategy, the first deployment fails and you need to configure resources manually through [the Console](https://console.upsun.com/), or using `resources:set` in the CLI.</br></br> This strategy allows you to set the exact resources you want, with a single deployment. Other strategies may require fine-tuning, and therefore generate a second deployment. In this case, your environment would run for a short time with unwanted resources, and both deployments would generate downtime.|
| `minimum`  | Initializes new containers using the {{% vendor/name %}} minimum resources (see below). |
| `parent`   | Initializes new containers using the same resources as on the parent environment.</br>If there is no parent environment, or if the container doesn't already exist on the parent, the `default` strategy applies instead. |
| `child`    | Initializes new containers using the same resources as on the child environment. Only relevant during merge activities. |
| `backup`   | When restoring a backup, initializes new containers using the same resources as when the backup was taken. |

{{% note theme="info" title="More information on..."%}} 
<details>
  <summary><b>{{% vendor/name %}} minimum resources</b></summary>

The following table shows the resources {{% vendor/name %}} allocates to your containers when you opt for the `minimum` [resource initialization strategy](#specify-a-resource-initialization-strategy).

| Container               | CPU  | RAM    | Disk*   |
|-------------------------|------|--------|---------|
| .NET core                   | 0.1  | 64 MB  | 0 MB    |
| Chrome Headless         | 0.1  | 64 MB  | None    |
| Elasticsearch           | 0.1  | 448 MB | 256 MB  |
| Elasticsearch Premium   | 0.1  | 448 MB | 256 MB  |
| Elixir                  | 0.1  | 64 MB  | 0 MB    | 
| Go                      | 0.1  | 64 MB  | 0 MB    |
| InfluxDB                | 0.1  | 448 MB | 256 MB  |
| Java                    | 0.1  | 448 MB | 0 MB    |
| Kafka                   | 0.1  | 448 MB | 512 MB  |
| Lisp                    | 0.1  | 64 MB  | 0 MB    |
| MariaDB                 | 0.1  | 448 MB | 256 MB  |
| Memcached               | 0.1  | 352 MB | None    |
| MongoDB                 | 0.1  | 448 MB | 256 MB  | 
| MongoDB Premium         | 0.1  | 448 MB | 256 MB  |
| Network Storage         | 0.1  | 448 MB | 256 MB  | 
| Node.js                 | 0.1  | 64 MB  | 0 MB    |
| OpenSearch              | 0.1  | 448 MB | 256 MB  |
| Oracle MySQL            | 0.1  | 448 MB | 256 MB  | 
| PHP                     | 0.1  | 64 MB  | 0 MB    |
| PostgreSQL              | 0.1  | 448 MB | 256 MB  | 
| Python                  | 0.1  | 64 MB  | 0 MB    |
| RabbitMQ                | 0.1  | 448 MB | 256 MB  | 
| Redis ephemeral         | 0.1  | 352 MB | None    |
| Redis persistent        | 0.1  | 352 MB | 256 MB  | 
| Ruby                    | 0.1  | 64 MB  | 0 MB    |
| Rust                    | 0.1  | 64 MB  | 0 MB    |
| Solr                    | 0.1  | 448 MB | 256 MB  | 
| Varnish                 | 0.1  | 448 MB | None    |
| Vault KMS               | 0.1  | 448 MB | 256 MB  |

\* The disk size is set to `None` when the container never uses disk, and to `0 MB` when the container doesn't require disk but _can_ use it.
</details>
{{% /note %}} 

You can specify a resource initialization strategy when performing the following actions:

| Action                                                                | Available strategies                     | Default  |
|-----------------------------------------------------------------------|------------------------------------------|----------|
| [First deployment](#first-deployment) | `parent`, `default`, `minimum`, `manual` | `parent` |
| [Environment branch](#environment-branch) | `parent`, `default`, `minimum` | `parent` |
| [Environment merge](#environment-merge) | `child`, `default`, `minimum`, `manual` | `child` |
| [Environment activation](#environment-activation) | `parent`, `default`, `minimum` | `parent` | 
| [Backup restoration](#backup-restoration) | `backup`, `parent`, `default`, `minimum` | `backup` |

### First deployment

{{% note theme="info" title="Resource initialization strategies" %}} 

Available: `parent`, `default`, `minimum`, `manual` </br>
Default: `parent`

{{% /note %}} 

You can define [which resource initialization strategy](#specify-a-resource-initialization-strategy) {{% vendor/name %}} uses to allocate resources
when you first deploy your project or add a new container.

{{< codetabs >}}

+++
title= Without a source integration
+++

If you're not using a [source integration](/integrations/_index.md),
you can use a [Git push option](/environments/_index.md#push-options) to specify a resource initialization strategy.
To do so, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} push --resources-init={{< variable "INITIALIZATION_STRATEGY" >}}
```

For example, to use the `minimum` strategy for your deployment, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} push --resources-init=minimum
```

{{< note >}}

Alternatively, you can use the official Git syntax for [push options](/environments/_index.md#push-options):

```bash {location="Terminal"}
git push {{% vendor/cli %}} -o resources.init=minimum
```

{{< /note >}}

Note that you can specify a different resource initialization strategy for each of your deployments.

<--->

+++
title= With a source integration
+++

If you're using a [source integration](/integrations/_index.md),
you can use the `--resources-init` flag to specify a resource initialization strategy.

{{< note >}}

Once a resource initialization strategy is specified for your source integration,
it applies to **all** the deployments you launch through that source integration.

{{< /note >}}

To specify a resource initialization strategy when [creating your source integration](/integrations/source/_index.md),
include the `--resources-init` flag in your source integration options.</br>
For example, if you [set up a GitHub integration](/integrations/source/github), use the following options:

```bash {location="Terminal"}
platform integration:add \
  --project {{< variable "PROJECT_ID" >}} \
  --type github \
  --repository {{< variable "OWNER/REPOSITORY" >}} \
  --token {{< variable "GITHUB_ACCESS_TOKEN" >}} \
  --base-url {{< variable "GITHUB_URL" >}}
  --resources-init {{< variable "INITIALIZATION_STRATEGY" >}}
```

To specify a resource initialization strategy for an existing source integration,
run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} integration:update --resources-init={{< variable "INITIALIZATION_STRATEGY" >}}
```

For example, to use the `minimum` strategy for your deployment, run the the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} integration:update --resources-init=minimum
```

{{< /codetabs >}}

### Environment branch

{{% note theme="info" title="Resource initialization strategies" %}} 

Available: `parent`, `default`, `minimum` </br>
Default: `parent`

{{% /note %}} 

By default, when you [branch an environment](/glossary.md#branch) to create a new child environment,
the child environment inherits all the resources from its parent.
However, you can specify a different [resource initialization strategy](#specify-a-resource-initialization-strategy).

{{% note %}}

When you branch an environment, regardless of the strategy you specified,
{{% vendor/name %}} checks if the child environment's disk size is at least equivalent to the parent's.</br>
If not, the parent environment's disk size is automatically applied to the child environment.
This ensures the branching can succeed.

{{% /note %}}

{{< codetabs >}}

+++
title=Using the CLI
+++

Run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:branch --resources-init={{< variable "INITIALIZATION_STRATEGY" >}}
```

For example, to use the `minimum` resource initialization strategy, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:branch --resources-init=minimum
```

<--->

+++
title=In the Console
+++

1. Navigate to the environment you want to branch from.
2. Click {{< icon branch >}} **Branch**.
3. Enter a name and a type for the new environment.
4. Select an initialization strategy from the proposed list.
5. Click **Branch**.

{{< /codetabs >}}

### Environment merge

{{% note theme="info" title="Resource initialization strategies" %}} 

Available: `child`, `default`, `minimum`, `manual` </br>
Default: `child`

{{% /note %}} 

When you [merge](/glossary.md#merge) a child environment into its parent environment,
any apps and services you created on the child are merged and therefore created on the parent.

When this happens, any new app or service container created on the parent environment is granted the same resources as on the child environment.
However, you can specify a different resource initialization strategy.

{{% note %}}

Any other container already running on the parent environment keeps its resources.

{{% /note %}}

{{< codetabs >}}

+++
title=Using the CLI
+++

Run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:merge --resources-init={{< variable "INITIALIZATION_STRATEGY" >}}
```

For example, to use the `manual` resource initialization strategy, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:merge --resources-init=manual
```

<--->

+++
title=In the Console
+++

1. Navigate to the environment you want to merge into its parent.
2. Click {{< icon merge >}} **Merge**.
3. Select an initialization strategy from the proposed list.
   {{% note %}}
   The list of strategies is only displayed if a new app or service is included in the merge.
   {{% /note %}}
4. Click **Merge**.

{{< /codetabs >}}

### Environment activation

{{% note theme="info" title="Resource initialization strategies" %}} 

Available: `parent`, `default`, `minimum` </br>
Default: `parent`

{{% /note %}} 

When you activate an environment, {{% vendor/name %}} uses the same resource allocation as on the parent environment.
If there is no parent environment, the [`default` resource initialization strategy](#default-resources) applies.

You can also specify a different resource initialization strategy using the CLI.
To do so, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:activate --resources-init={{< variable "INITIALIZATION_STRATEGY" >}}
```

For example, to use the `minimum` resource initialization strategy, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:activate --resources-init=minimum
```

{{% note %}}
[Setting resources](/manage-resources/adjust-resources.md) on a inactive environment using the Console or the CLI automatically activates it. 
{{% /note %}}

### Backup restoration

{{% note theme="info" title="Resource initialization strategies" %}} 

Available: `backup`, `parent`, `default`, `minimum` </br>
Default: `backup`

{{% /note %}} 

{{< codetabs >}}

+++
title=Using the CLI
+++

When you [restore a backup](/environments/restore.md) using the CLI,
you can restore it to your current environment or a different environment.

## Backup restoration to your current environment

By default, when you [restore a backup](/environments/restore.md) using the CLI, it is restored to your current environment.
The resources of every container already running on the environment are reverted to their original state when the backup was taken.

{{% note %}}
If you don't want to restore the resources from when the backup was taken,
opt out of restoring the resources.
To do so, when you restore your backup, use the `--no-resources` option.
{{% /note %}}

If you deleted containers after backing up but before restoring, they are recreated using the `backup` strategy.
Meaning, they are granted the same resources as in the backup.

{{% note %}}
If you don't want to restore previously deleted containers,
opt out of restoring the code.
To do so, when you restore your backup, use the `--no-code` option.
{{% /note %}}

When you restore previously deleted containers,
you can specify a different resource initialization strategy for them.

## Backup restoration to a different environment

The `backup` strategy also applies by default.
All apps and services are initialized as new containers on the environment,
and granted the same resources as in the backup.
Note that you can specify a different resource initialization strategy for all of them.

## Specify a resource initialization strategy when restoring a backup via the CLI

Run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} backup:restore --resources-init={{< variable "INITIALIZATION_STRATEGY" >}}
```

For example, to use the `minimum` resource initialization strategy, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} backup:restore --resources-init=minimum
```

<--->

+++
title=In the Console
+++

When you [restore a backup](/environments/restore.md) using the Console, it is restored to your current environment.
The resources of every container already running on the environment are reverted to their original state when the backup was taken.

{{% note %}}
If you don't want to restore the resources from when the backup was taken,
opt out of restoring the resources.
To do so, when you restore your backup, use the `--no-resources` option.
{{% /note %}}

If you deleted containers after backing up but before restoring, they are recreated using the `backup` strategy.
Meaning, they are granted the same resources as in the backup.

{{% note %}}
If you don't want to restore previously deleted containers,
opt out of restoring the code.
To do so, restore the backup using the CLI, and use the `--no-code` option.
{{% /note %}}

{{< /codetabs >}}

## Environment sync

[Syncing an environment](/glossary.md#sync) means merging changes from a parent environment into a child environment.
You can sync:

- Only the code
- Only the data (databases, files)
- Only the resources (CPU and RAM, instances, and disk space)
- Any combination of the three (code and data, data and resources, etc.)

{{% note %}}

When you sync the data, {{% vendor/name %}} checks if the child environment's disk size is at least equivalent to the parent's.</br>
If not, the parent environment's disk size is automatically applied to the child environment.
This ensures the sync can succeed.

{{% /note %}}

{{< codetabs >}}

+++
title=Using the CLI
+++

Run the following commands depending on your needs:

- Sync only resources:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} sync resources
  ```

- Sync only code:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} sync code
  ```

- Sync only data:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} sync data
  ```

- Sync everything:

  ```bash {location="Terminal"}
  {{% vendor/cli %}} sync code data resources
  ```
 
  You can adjust the command depending on the exact combination of elements you want to sync.

<--->

+++
title=In the Console
+++

1. Navigate to your Production environment.
2. Click {{< icon sync >}} **Sync**.
3. Select the sync options you want from the proposed list.
4. Select **Sync resources from Production into Staging**.
5. Click **Sync**.

{{< /codetabs >}}
