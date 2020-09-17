---
title: "Dedication Production Clusters"
weight: 1
---

Platform.sh Dedication Production Clusters provide a scalable solution as an additional option on top of your existing Grid applications.
It provides redundant configuration, a minimum of three Virtual Machine instances, provisioned by Platform.sh for each customer. Every service is replicated across all three virtual machines in a failover configuration (as opposed to sharding), allowing a site to remain up even if one of the VMs is lost entirely.
Dedicated Production Clusters work nearly identically to Grid environments, and does not require additional  configuration on your part. The only difference is that of service availability - the services PostgreSQL or Kafka are not available on Dedication.


## Features

* Domains can be added to your development environments, such as to a dedicated staging environment.
* The master branch with three-Virtual Machine
* Support to Data sync
* Backup on Production does not freeze in the process.
* You can deploy your application in any of our [supported cloud providers](development/faq.md#which-geographic-zones-does-platformsh-cover). 


You cannot perform the following:

* Use PostgreSQL or Kafka (The support for those is upcoming).


## Setting up

Open a Support ticket with the suggested title “Upgrade to Dedication Production Clusters". In the ticket, request to have your project Upgrade.

We will review the infrastructure and settings, create user and environment variables for Staging and Production environments, and update the ticket with results.

Once started the process usually takes less than an hour.  There should be no downtime on your production site, although you should not push any code to Git while the upgrade is in progress.

When done, you can access review your project through the Project Web Interface.
