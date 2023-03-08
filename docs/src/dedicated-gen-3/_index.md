---
title: "{{% names/dedicated-gen-3 %}}"
weight: -19
sidebarTitle: "{{% names/dedicated-gen-3 %}}"
layout: single
description: |
    {{% names/dedicated-gen-3 %}} provides a scalable solution as an additional option on top of your existing Grid applications.
    It provides redundant configuration with a minimum of three Virtual Machine instances. 
    Every service is replicated across all three virtual machines in a failover configuration
    (as opposed to sharding, allowing a site to remain up even if one of the VMs is lost entirely).
---

{{% description %}}

Projects often require a dedicated production cluster when they require high availability
or need more resources than normally offered by Grid plans.
Another common reason is data location requirements,
such as the need to deploy to a location  without a current region
or a requirement that production data can't be kept on shared infrastructure.

{{% names/dedicated-gen-3 %}} works nearly identically to Grid environments and doesn't require additional configuration on your part. 
The only difference is that of service availability.

## Why a Generation 3?

[{{% names/dedicated-gen-2 %}} infrastructure](../../dedicated-gen-2/overview/_index.md) ensures increased uptime and availability for your applications and services,
but configuration or application topology changes have to go through the Customer Success team
as Platform.sh provisions the virtual machines.
{{% names/dedicated-gen-3 %}} gives you both the high availability of {{% names/dedicated-gen-2 %}}
and the self-service flexibility and features of Grid projects.

This means that you can edit your configuration yourself
and then see those changes reflected in your {{% names/dedicated-gen-3 %}} environments on every push without opening a ticket.

## Features

- A minimum of three virtual machine cluster is associated with your default (production) environment, and also optionally with a staging environment.
- Configuration changes on development environments (through your `services.yaml`, `routes.yaml`, and `.platform.app.yaml` files) are reflected on these {{% names/dedicated-gen-3 %}} clusters when you merge them.
  It isn't necessary to open a support ticket to change production infrastructure like it is for {{% names/dedicated-gen-2 %}}.
- You can deploy your application in any [supported cloud provider](../../development/regions.md#regions).

## Differences from the Grid

Although {{% names/dedicated-gen-3 %}} adds plenty of features to your existing Grid applications, there are a few differences and limitations to be aware of when considering an upgrade. 

### Available services

Your application can connect to each service by referencing the exact same environment variables as a Grid environment.
While the configuration of the service is performed by Platform.sh, the app configuration is the same and your code should be the same.
See the [services documentation](../../add-services/_index.md) for service-specific details.

The [services documentation](../../add-services/_index.md) states that not every service or version available on the Grid is available on {{% names/dedicated-gen-3 %}}.
The table below shows the currently available services and their versions for {{% names/dedicated-gen-3 %}}.

{{< gen-3-services >}}

### Local mounts

Because you get a redundant infrastructure, note that local mounts are local to each Virtual Machine. Since you can't know which VM is going to handle a specific request, you also don't have a guarantee regarding which local mount is going to be used. Whether you actually want to use a local mount or in fact need to set up a network storage mount depends on your specific use-case.

## Storage 

Each Dedicated cluster comes with 50GB of storage per environment by default.
This storage is intended for your data -- databases, search indexes, user uploaded files, and so on -- and can be subdivided in any way you want.
50GB is only the default amount; more storage can be added as a line item in the contract and can be added at anytime that the project requires: at contract renewal or at any point in the term.

Default storage is based on the default SSD block-storage offering for each cloud. Extra provisioned IOPS can be discussed with your sales representative.

## Setting up

If you are interested in Platform.sh's data cloning, environment control, and infrastructure-as-code philosophy across our supported runtimes and services, but you also need a large amount of resources and data isolation, [contact us](https://platform.sh/contact) to start setting up a {{% names/dedicated-gen-3 %}} project.

At this time, existing Grid projects can't be migrated to {{% names/dedicated-gen-3 %}}, but they soon will be.
Migrations will then require contacting our sales team, at which point your infrastructure is reviewed for compatibility and pricing.
After that, your existing project settings are modified to set up a production environment using {{% names/dedicated-gen-3 %}}. 

At the moment, {{% names/dedicated-gen-2 %}} projects can't be migrated to {{% names/dedicated-gen-3 %}},
but support for this type of migration will soon be available.

