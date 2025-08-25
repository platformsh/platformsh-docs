---
title: "`size`"
weight: 4
description: Defines the amount of resources to dedicate to the app. 
keywords:
  - resource sizing
---



{{% description %}} Defaults to `AUTO` in production environments.

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#top-level-properties) and [composable](/create-apps/app-reference/composable-image.md#top-level-properties) images.

Resources are distributed across all containers in an environment from the total available from your [plan size](/administration/pricing/_index.md).
So if you have more than just a single app, it doesn't get all of the resources available.
Each environment has its own resources and there are different [sizing rules for preview environments](#sizes-in-preview-environments).

By default, resource sizes (CPU and memory) are chosen automatically for an app
based on the plan size and the number of other containers in the cluster.
Most of the time, this automatic sizing is enough.

You can set sizing suggestions for production environments when you know a given container has specific needs.
Such as a worker that doesn't need much and can free up resources for other apps.
To do so, set `size` to one of the following values:

- `S`
- `M`
- `L`
- `XL`
- `2XL`
- `4XL`

The total resources allocated across all apps and services can't exceed what's in your plan.

### Container profiles: CPU and memory

By default, {{% vendor/name %}} allocates a container profile to each app and service depending on:

- The range of resources it’s expected to need
- Your [plan size](/administration/pricing/_index.md), as resources are distributed across containers.
  Ideally you want to give databases the biggest part of your memory, and apps the biggest part of your CPU.

The container profile and the [size of the container](#sizes) determine
how much CPU and memory (in [MB](/glossary/_index.md#mb)) the container gets.

There are three container profiles available: ``HIGH_CPU``, ``BALANCED``, and ``HIGH_MEMORY``.

#### ``HIGH_CPU`` container profile

| Size |  CPU  | MEMORY   |
| ---- | ----- | -------- |
| S    | 0.40  | 128 MB   |
| M    | 0.40  | 128 MB   |
| L    | 1.20  | 256 MB   |
| XL   | 2.50  | 384 MB   |
| 2XL  | 5.00  | 768 MB   |
| 4XL  | 10.00 | 1536 MB  |

#### `BALANCED` container profile

| Size | CPU  | MEMORY   |
| ---- | ---- | -------- |
| S    | 0.05 | 32 MB    |
| M    | 0.05 | 64 MB    |
| L    | 0.08 | 256 MB   |
| XL   | 0.10 | 512 MB   |
| 2XL  | 0.20 | 1024 MB  |
| 4XL  | 0.40 | 2048 MB  |

#### `HIGH_MEMORY` container profile

| Size | CPU  | MEMORY    |
| ---- | ---- | --------- |
| S    | 0.25 | 128 MB    |
| M    | 0.25 | 288 MB    |
| L    | 0.40 | 1280 MB   |
| XL   | 0.75 | 2624 MB   |
| 2XL  | 1.50 | 5248 MB   |
| 4XL  | 3.00 | 10496 MB  |

#### Container profile reference

The following table shows which container profiles {{% vendor/name %}} applies when deploying your project.

| Container             | Profile     |
|-----------------------|-------------|
| Chrome Headless       | HIGH_CPU    |
| .NET                  | HIGH_CPU    |
| Elasticsearch         | HIGH_MEMORY |
| Elasticsearch Premium | HIGH_MEMORY |
| Elixir                | HIGH_CPU    |
| Go                    | HIGH_CPU    |
| Gotenberg             | HIGH_MEMORY |
| InfluxDB              | HIGH_MEMORY |
| Java                  | HIGH_MEMORY |
| Kafka                 | HIGH_MEMORY |
| MariaDB               | HIGH_MEMORY |
| Memcached             | BALANCED    |
| MongoDB               | HIGH_MEMORY |
| MongoDB Premium       | HIGH_MEMORY |
| Network Storage       | HIGH_MEMORY |
| Node.js               | HIGH_CPU    |
| OpenSearch            | HIGH_MEMORY |
| Oracle MySQL          | HIGH_MEMORY |
| PHP                   | HIGH_CPU    |
| PostgreSQL            | HIGH_MEMORY |
| Python                | HIGH_CPU    |
| RabbitMQ              | HIGH_MEMORY |
| Redis ephemeral       | BALANCED    |
| Redis persistent      | BALANCED    |
| Ruby                  | HIGH_CPU    |
| Rust                  | HIGH_CPU    |
| Solr                  | HIGH_MEMORY |
| Varnish               | HIGH_MEMORY |
| Vault KMS             | HIGH_MEMORY |

### Sizes in preview environments

Containers in preview environments don't follow the `size` specification.
Application containers are set based on the plan's setting for **Environments application size**.
The default is size **S**, but you can increase it by editing your plan.
(Service containers in preview environments are always set to size **S**.)
