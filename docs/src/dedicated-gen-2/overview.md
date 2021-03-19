---
title: "Dedicated Generation 2"
weight: 1
sidebarTitle: "Overview"
layout: single
---

Dedicated Generation 2 provides a scalable solution as an additional option on top of your existing Grid applications.
It provides redundant configuration with a minimum of three Virtual Machine instances. Every service is replicated across all three virtual machines in a failover configuration (as opposed to sharding), allowing a site to remain up even if one of the VMs is lost entirely.
Dedicated Generation 2 works nearly identically to Grid environments, and does not require additional configuration on your part. The only difference is that of service availability.

## Why a Generation 2?

Our existing [dedicated infrastructure](/dedicated/overview) ensures increased uptime and availability for your applications and services, configuration or application topology changes have to go through our Customer Success team, as the VMs are provisioned by us. Generation 2 gives you both the high availability from our Dedicated offer and the self-service flexibility and features of the Grid. This means that you will now be able to edit your configuration yourself – as you would do on the Grid in your `.platform/services.yaml` and `.platform.app.yaml` files – and see those changes in your Dedicated Generation 2 environments when pushed without having to open a ticket.

## Features

* Domains can be added to your development environments, such as to a dedicated staging environment.
* Three-Virtual Machine for your master branch.
* Backups on Production do not freeze in the process.
* You can deploy your application in any of our [supported cloud providers](/development/faq.md#which-geographic-zones-does-platformsh-cover).

## Discrepancies with the Grid

### Available services

As of today, the following services are available on Dedicated Generation 2:
- [Mariadb/Mysql](/configuration/services/mysql)
- [Redis](/configuration/services/redis)
- [Elasticsearch](/configuration/services/elasticsearch)
- [RabbitMQ](/configuration/services/rabbitmq)
- [Solr (6 and 8.6 only)](/configuration/services/solr)
- [Network storage (2.0 only)](/configuration/services/network-storage)

### Local mounts

Because you get a redundant infrastrcture, note that local mounts will be local to each Virtual Machine. Since you can't know what VM is going to handle a specific request, you don't have a guarantee regarding which local mount is going to be used. Whether you actually want to use a local mount or in fact need to set up a network storage mount depends on your specific use-cases.

## Setting up

### Migrating from the Grid

Open a Support ticket with the suggested title “Upgrade to Dedicated Generation 2". In the ticket, request to have your project upgraded.

We will review the infrastructure and settings, create user and environment variables for Staging and Production environments, and update the ticket with those changes.

Once started the process usually takes less than an hour.  There should be no downtime on your production site, although you should not push any code to Git while the upgrade is in progress.

When done, you can review the changes to your project through the management console.

### Migrating from Dedicated

Migrating from Dedicated to Dedicated Generation 2 is not possible for now but feel free to reach out so we're aware of the demand.
