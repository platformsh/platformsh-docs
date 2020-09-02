---
title: "Upgrading to the Integrated UI"
weight: 6
sidebarTitle: "Upgrading"
description: |
  Platform.sh Dedicated projects used a separate Git repository for Production and Staging.  That also necessitated running most configuration changes through a ticket, and maintaining separate SSH credentials for each environment.
---

{{< description >}}

These older projects can be upgraded to the new Integrated UI, which eliminates the extra Git repositories, many "must be a ticket" configuration changes, and makes the Production and Staging environments available in the UI.

To add these environments to the Project Web Interface, review this entire document, complete a few preparatory steps, and submit a ticket. Your ticket is added to a queue for updating existing Dedicated projects.  The process may take time to complete, so check your ticket for details, timing, and other important information.

We recommend this upgrade for all users.

## New Features

The new Project Web Interface provides the following features for the Pro plan Staging and Production environments:

* Backup on Production does not freeze in the process.
* Support to Data sync


You cannot perform the following:

* Use PostgreSQL or Kafka.

## Enter a ticket for updating the Project

Enter a Support ticket with the suggested title “Upgrade to Dedication”. In the ticket, request to have your project Upgrade.

We will review the infrastructure and settings, create user and environment variables for Staging and Production environments, and update the ticket with results.

Once started the process usually takes less than an hour.  There should be no downtime on your production site, although you should not push any code to Git while the upgrade is in progress.

When done, you can access review your project through the Project Web Interface.