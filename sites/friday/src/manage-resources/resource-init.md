---
title: Resource initialization
description: Learn how resources are allocated by default upon first deployment, and how you can define a resource initialization strategy that better fits your needs.
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

When you first deploy your {{% vendor/name %}} project, and whenever you add a new app or service,
{{% vendor/name %}} allocates the following default resources to every container:

| Resource type               | Amount |
| --------------------------- | ----------- |
| CPU                         | 0.5 |
| RAM                         | Depends on the [container profile](#advanced-container-profiles). |
| Disk size (only applicable if the app or service requires a disk)                   | 512 MB |

If you don't want to use those default resources, you can define a different [resource initialization strategy](#resource-initialization-strategies).
You can also [adjust those resources](#configure-resources) after your project or new container has been deployed.

For information on resource-related costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).
Note that you can [keep an eye on those costs](/manage-resources/resource-billing.md) in the Console.

## Define a resource initialization strategy

### Without a source integration

If you're not using a [source integration](/integrations/_index.md),
you can use a [Git push option](/environments/_index.md#push-options) to define which strategy {{% vendor/name %}} uses to allocate resources
when you first deploy your project or add a new container.

The following strategies are available:

| Strategy | Description | Command |
| ---------| ----------- | ---------- |
| `Default`  | Initializes the new containers using the [{{% vendor/name %}} default resources](/manage-resources/resource-init.md).</br>This strategy automatically applies if you don't explicitly use a Git push option when deploying your project or new container.  | `git push upsun -o resources.init=default` |
| `Manual`   | With this strategy, the first deployment fails and you need to configure resources manually through [the Console](#adjust-your-project-resources), or using `resources:set` in the CLI. | `git push upsun -o resources.init=manual` |
| `Minimum`  | Initializes the new containers using the [{{% vendor/name %}} minimum resources](#minimum-resources). | `git push upsun -o resources.init=minimum` |
| `Parent`   | Initializes the new containers using the same resources as the parent environment.</br>If there is no parent, or if the container doesn't already exist on the parent environment, the default strategy applies instead. | `git push upsun -o resources.init=parent` |

If you're using a source integration, you can't use Git push options.
However, you can still define a resource initialization strategy by [adjusting your source integration setup](#with-a-source-integration).

### With a source integration 

WAITING FOR PROPERTY TO BE TESTABLE

### Minimum resources

The following table shows the resources {{% vendor/name %}} allocates to your containers when you opt for the `Minimum` [resource initialization strategy](#define-a-resource-initialization-strategy).

| Container               | CPU  | RAM    | Disk*   |
|-------------------------|------|--------|---------|
| .NET                    | 0.1  | 64 MB  | 0 MB    |
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
| NodeJS                  | 0.1  | 64 MB  | 0 MB    |
| OpenSearch              | 0.1  | 448 MB | 256 MB  | 
| Oracle Java             | 0.1  | 448 MB | 0 MB    |
| Oracle MySQL            | 0.1  | 448 MB | 256 MB  | 
| PHP                     | 0.1  | 64 MB  | 0 MB    |
| PostgreSQL              | 0.1  | 448 MB | 256 MB  | 
| Python                  | 0.1  | 64 MB  | 0 MB    |
| Rabbitmq                | 0.1  | 448 MB | 256 MB  | 
| Redis ephemeral         | 0.1  | 352 MB | None    |
| Redis persistent        | 0.1  | 352 MB | 256 MB  | 
| Ruby                    | 0.1  | 64 MB  | 0 MB    |
| Rust                    | 0.1  | 64 MB  | 0 MB    |
| Solr                    | 0.1  | 448 MB | 256 MB  | 
| Varnish                 | 0.1  | 448 MB | None    |
| Vault KMS               | 0.1  | 448 MB | 256 MB  |

\* The disk size is set to `None` when the container never uses a disk, and to `0 MB` when the container doesn't require a disk but can use one.

## Actions on environments

Here is how resource allocation works on {{% vendor/name %}} when you perform the following actions on an environment:

### Environment creation

When you [branch an environment](/glossary.md#branch) to create a new child environment,
the child environment inherits all the resources from its parent.

### Environment merge

When you [merge](/glossary.md#merge) a child environment into a parent environment,
any app or service on the child environment is merged into the parent.
For the merge and deployment to be complete,
you need to [allocate resources](/manage-resources/adjust-resources.md) to each of these newly added instances.

### Environment sync

When you [sync an environment](/glossary.md#sync),
the target environment's disk size may be smaller that the source environment's disk size.

In this case, {{% vendor/name %}} automatically allocates the source environment's disk size to the target environment.
This ensures that there's enough disk space on the target environment for the synchronization to succeed.