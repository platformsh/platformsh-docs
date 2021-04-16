---
title: "Dedicated Generation 3"
weight: 1
sidebarTitle: "Overview"
layout: single
description: |
    Dedicated Generation 3 provides a scalable solution as an additional option on top of your existing Grid applications.
    It provides redundant configuration with a minimum of three Virtual Machine instances. 
---

{{< description >}}

Every service is replicated across all three virtual machines in a failover configuration (as opposed to sharding), allowing a site to remain up even if one of the VMs is lost entirely.
Dedicated Generation 3 works nearly identically to Grid environments, and does not require additional configuration on your part. The only difference is that of service availability.

## Why a Generation 3?

Our existing [dedicated infrastructure](/dedicated/overview) ensures increased uptime and availability for your applications and services, but configuration or application topology changes have to go through our Customer Success team, as the VMs are provisioned by us. Generation 3 gives you both the high availability from our Dedicated offer combined with the self-service flexibility and features of the Grid. 

This means that you are able to edit your configuration yourself the same as you would on the grid - in your `services.yaml`, `routes.yaml`, and `.platform.app.yaml` files - and then see those changes reflected in your Dedicated Generation 3 environments every push without opening a ticket. 

## Features

* A three virtual machine cluster is associated with your default (production) environment, and also optionally with a staging environment. 
* Configuration changes on development environments (through your `services.yaml`, `routes.yaml`, and `.platform.app.yaml` files) are reflected on these Dedicated Gen 3 clusters when you merge them. It is not necessary to open a support ticket to change production infrastructure like it is on Dedicated. 
* You can deploy your application in any of our [supported cloud providers](/development/faq.md#which-geographic-zones-does-platformsh-cover).

## Differences from the Grid

Although Dedication Generation 3 adds plenty of features to your existing Grid applications, there are a few differences and limitations to be aware of when considering an upgrade. 

### Available services

In our [services documentation](/configuration/services) you will notice that not every service is available on Dedicated Generation 3 that is available on the Grid, nor is every version. The table below shows the currently available services and their versions for Dedicated Generation 3. 

{{< gen-3-services >}}

### Local mounts

Because you get a redundant infrastructure, note that local mounts will be local to each Virtual Machine. Since you can't know which VM is going to handle a specific request, you also don't have a guarantee regarding which local mount is going to be used. Whether you actually want to use a local mount or in fact need to set up a network storage mount depends on your specific use-case.

## Setting up

### Migrating from the Grid

Open a Support ticket with the suggested title “Upgrade to Dedicated Generation 3". In the ticket, request to have your project upgraded. We will review the infrastructure and settings, create user and environment variables for Staging and Production environments, and update the ticket with those changes.

Once started the process usually takes less than an hour.  There should be no downtime on your production site, although you should not push any code to Git while the upgrade is in progress. When done, you can review the changes to your project through the management console.

### Migrating from Dedicated

Please [contact us](https://platform.sh/contact/) if you are interested in migrating to Dedicated Generation 3. 
