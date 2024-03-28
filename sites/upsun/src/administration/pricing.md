---
title: Pricing
weight: 1
description: Understand how {{% vendor/name %}} pricing works.
---

{{% vendor/name %}} offers flexible, usage-based [pricing](https://upsun.com/pricing/) for organizations and projects.

{{< note theme="info" >}}

This page is meant to provide some context for how the pricing model relates to technical work on {{% vendor/name %}}.
It is _not_ meant to be your primary resource for the exact costs of certain features.

The [Pricing page](https://upsun.com/pricing/) should always be considered the primary source of pricing details.

During the {{% vendor/name %}} Beta phase, certain features are reduced in cost or even free, that will change after the Beta has finished. 
Features may be included during the Beta phase that will become paid features outside of Beta.

Make sure to consult the [Pricing page](https://upsun.com/pricing/) for exact details related to the Beta feature availability and pricing.

{{< /note >}}

In general, there are four main dimensions that determine the cost of work on {{% vendor/name %}}.

|  Pricing dimension  |  Details  |
|---|---|
|  Project fees |  An individual project on {{% vendor/name %}} comes with a consistent monthly cost. The cost includes all of the orchestration and provisioning characteristics that define the {{% vendor/name %}} PaaS.<br/><br/>It comes with some baseline features and feature limits, such as infrastructure metrics and a certain number of build minutes. Individual preview environments do not come with their own associated creation cost - you are charged only for the resources those preview environments use during their lifespan (see next row).  |
|  [Project resources](/manage-resources.md) | Deploying on {{% vendor/name %}} allows you fine-grained control over the amount of resources allocated for your application and service containers. CPU, memory, and disk (including backup disk) are calculated across each organization, project, and environment to determine your overall usage for a billing period.   |
|  [User licenses](/administration/users.md) | Each organization user comes with a license fee. Users can be given different levels of access to singular projects within an organization, or to multiple projects, without changing that license fee. There are two exceptions which are not charged the license fee: Viewers and Viewers who Manage Billing. There are no limits to the number of users you can have in an organization.|
|  Feature add-ons |  There are additional features that can be added to the organization that come with their own cost. Few of these are available immediately during the Beta phase, but more will be added.  |


A given organization's monthly billing is then made up of the sum of each of these dimensions. 

You can estimate the monthly cost of an organization by visiting the **Billing** link under your organization's name in the top right hand corner of the management console. 

Be sure to visit the [Pricing page](https://upsun.com/pricing/) for exact details related to {{% vendor/name %}} pricing.