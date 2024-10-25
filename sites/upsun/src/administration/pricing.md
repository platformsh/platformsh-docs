---
title: Pricing
weight: 1
description: Understand how {{% vendor/name %}} pricing works.
---

{{% vendor/name %}} offers flexible, usage-based [pricing](https://upsun.com/pricing/) for organizations and projects.

{{< note theme="info" >}}

This page is meant to provide some context for how the pricing model relates to technical work on {{% vendor/name %}}.
It is _not_ meant to be your primary resource for the exact costs of certain features.

The official {{% vendor/name %}} [Pricing page](https://upsun.com/pricing/) should always be considered the primary source of pricing details.

{{< /note >}}

In general, there are four main dimensions that determine the cost of work on {{% vendor/name %}}.

|  Pricing dimension  |  Details  |
|---|---|
|  Project fees |  An individual project on {{% vendor/name %}} comes with a consistent monthly cost. The cost includes all of the orchestration and provisioning characteristics that define the {{% vendor/name %}} PaaS.<br/><br/>It comes with some baseline features and feature limits, such as infrastructure metrics and a certain number of build minutes. Individual preview environments do not come with their own associated creation cost - you are charged only for the resources those preview environments use during their lifespan (see next row).  |
|  [Project resources](/manage-resources.md) | Deploying on {{% vendor/name %}} allows you fine-grained control over the amount of resources allocated for your application and service containers. CPU, memory, and disk (including backup disk) are calculated across each organization, project, and environment to determine your overall usage for a billing period.   |
|  [User licenses](/administration/users.md) | Each organization user comes with a license fee. Users can be given different levels of access to singular projects within an organization, or to multiple projects, without changing that license fee. There are two exceptions which are not charged the license fee: Viewers and Viewers who Manage Billing. There are no limits to the number of users you can have in an organization.|
|  Feature add-ons |  There are additional features that can be added to the organization that come with their own cost. Few of these are available immediately during the Beta phase, but more will be added.  |

A given organization's monthly billing is then made up of the sum of each of these dimensions. 

You can monitor your spend from the Console via a [current month estimate](/administration/billing/monitor-billing.html#current-month-estimate) and a [next month estimate](/administration/billing/monitor-billing.html#next-month-estimate).
You can also [set billing alerts](/administration/billing/monitor-billing.html#manage-billing-alerts) to receive an email when your current month estimate reaches a defined threshold.

## Dunning process

In instances where a payment has failed, your organization will be immediately restricted. Upsun will proceed to make three separate attempts to take the outstanding balance from your account. These attempts will be made on the 4th, 6th and 11th of the month. If your payment fails after the third attempt on the 11th, your organization will be suspended the following day.

If you are a new Upsun customer and your first payment has failed, your projects will be deleted on the 13th - two days after the final payment attempt.

For all other customers, projects will be deleted 30 days after your organization is suspended on the 11th. You will be notified 10 days before this deletion occurs and a payment will be attempted for the last time. If unsuccessful, all projects on the billing subscription will be deleted.

Be sure to visit the [Pricing page](https://upsun.com/pricing/) for exact details related to {{% vendor/name %}} pricing.
