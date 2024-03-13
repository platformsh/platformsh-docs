---
title: Monitor your billing information
weight: 2
description: Manage your costs efficiently by viewing monthly spend estimates and setting spend alerts.
keywords:
  - "resources"
  - "flexible resources"
  - "CPU"
  - "RAM"
  - "disk storage"
  - "costs"
  - "invoice"
  - "monthly spending"
  - "billing"
---

To help you manage the costs pertaining to your organization,
Upsun provides estimates for the current month and the following month.

You can also set billing alerts to make sure you don't overspend,
and track resource usage on each of your projects.

## Access your billing information

To access billing information pertaining to your organization in the [Console](/administration/web/_index.md), follow these steps:

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   The **Overview** tab is displayed.
   You can view your current month and next month estimates.

![Overview tab in the Console](/images/billing/billing-overview-tab-console.png)

### Current month estimate

Your current month estimate gives you an idea of what you may be charged at the end of the month.
It is based on the following elements:

- Your organization settings (user management settings, number of projects, potential add-ons, support SLA, etc.)
- Your resource allocation on each project

You current month estimate takes into account the history of changes you may have made since the beginning of the month.
However, it is only an estimate and cannot be completely accurate, as it is impossible to determine what your exact usage will be.

#### User management estimate

To provide an estimate of how much user management may cost you,
{{% vendor/name %}} uses the following calculation:

`unit price x current x prorated quantity`

Where:

- The unit price is fixed
- `current` is your current user settings (number of user licenses, user management sellable subscription, etc.)
- The prorated quantity is based on an average of past changes and the current settings, applied for all the remaining days in the month

#### Accumulated resource usage estimate

To provide an estimate of how much accumulated resource usage (of build resources, bandwidth, log forwarding, etc.) may cost you,
{{% vendor/name %}} uses the following calculation: 

`unit price x current accumulation x daily average x number of days in the month`

Where:

- The unit price is fixed
- The current accumulation is what you have effectively used so far this month
- The daily average is based on the usage you've had over the last 30 days

#### Allocated resource usage estimate

To provide an estimate of how much allocated resource usage (of application resources, service resources, storage, etc.) may cost you,
{{% vendor/name %}} uses the following calculation:

`unit price x current allocation x prorated quantity`

Where:

- The unit price is fixed
- `current allocation` is your current resource allocation across projects
- The prorated quantity is based on an average of past changes and the current settings, applied for all the remaining days in the month

### Next month estimate

{{% vendor/name %}} also provides you with an estimate for the following month. 
Like your [current month estimate](#current-month-estimate), it is based on your organization settings and resource allocation on each project.

However, contrary to your current month estimate, 
your next month estimate **does not take into account any history of changes**.

It is solely based on your current organization settings and resource allocation,
and provides insight into what you may be charged if you don't make any changes until the end of the following month.

### Invoice

Your invoice provides definitive information about what you will be charged.
It is calculated at the end of the month and is based on your `(current accumulation x unit price) + (current allocation x unit price)`.

To access your current invoice and a history of past invoices, open the **Invoices** tab.

## Set a billing alert

{{% note %}}

Billing alerts can only be set and received by the organization owner,
users with the [**Manage Billing** permission](/administration/users.md#organization-permissions),
and identified billing contacts.

{{% /note %}}

You can set billing alerts to get notified through email when your [invoice estimate](#invoice-estimates-and-cost-projections) reaches a defined threshold.

{{% note theme="warning" title="Warning"%}}
Invoice estimates are computed once a day only.
Therefore, email notifications can only be triggered once a day as well.

You may want to increase your billing alert threshold after receiving an email notification.
However, if the new threshold is reached later on the same day,
you won't get notified until the following day, when the invoice estimate is computed again.
{{% /note %}}

To set a billing alert on your organization:

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
4. In the **Overview** tab, click **Set alert**.
5. Enter a threshold.
6. Click **Create alert**.

To edit or delete a billing alert, click the billing alert button in the **Overview** tab:
![Billing alert button in the Console](/images/billing/billing-alert-button.png "0.1") 

## Track resource usage

If you have the [**Manage Billing** permission](/administration/users.md#organization-permissions) on your organization,
you can track costs related to resource usage.</br>
To do so, after you've set or updated resources on your project, follow these steps in the [Console](/administration/web/_index.md):

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   A monthly estimate of how much each project is expected to cost is displayed.
4. You can also view the costs related to every project you've been added to.</br>
   To do so, click **{{< icon more >}} More** next to the project,
   and select **Project Billing**.</br>
   A monthly estimate of all the expected costs related to resource allocation on the project is displayed.

{{< note >}}

These estimates reflect the expected costs **for a full month** based on the way resources are allocated **at the time of viewing**.
They don't take into account the history of changes you may have made throughout the current month.</br>
Therefore, if you make changes to resource allocation during the month, your monthly invoice will differ from these estimates.

{{< /note >}}

For information on resource-related costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).


