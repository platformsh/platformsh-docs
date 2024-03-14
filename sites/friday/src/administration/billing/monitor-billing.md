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

To help you manage the costs related to your organization,
Upsun provides estimates for the current month and the next.

You can set billing alerts to ensure you don't overspend,
and track resource usage on each of your projects.

For details on costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

## Access your organization billing information

To access billing information related to your organization in the [Console](/administration/web/_index.md):

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   The **Overview** tab is displayed.
   You can view your current month and next month estimates.

SCREENSHOT TO INSERT

### Current month estimate

The [**Overview** tab](#access-your-billing-information) shows an estimate of how much you may be charged at the end of the current month.</br>
This estimate is based on:

- Your organization settings (user management settings, number of projects, potential add-ons, support SLA, etc.)
- Your resource allocation on each project

The estimate includes the history of changes made since the beginning of the month.
**It cannot be 100% accurate, as it is impossible to determine what your exact resource usage will be.**</br>
However, for maximum accuracy, the current month estimate includes three underlying estimates,
each with its own calculation:

- A [user management estimate](#user-management-estimate)
- An [accumulated resource usage estimate](#accumulated-resource-usage-estimate)
- An [allocated resource usage estimate](#allocated-resource-usage-estimate)

#### User management estimate

User management fees include user licenses and, when applicable, subscription to the user management sellable.</br>
Here's how {{% vendor/name %}} calculates how much user management may cost you:
`unit price x current x prorated quantity`.

| Item               | Description |
| ------------------ | ----------- |
| `unit price`       | A fixed unit price. |
| `current`          | Your current user settings (number of user licenses, user management sellable subscription). |
| `prorated quantity`| An average of past changes and current settings, applied for all the remaining days in the month. |

All items used for the calculation are displayed in the [**Overview** tab](#access-your-billing-information).

#### Accumulated resource usage estimate

The resources consumed for builds, bandwidth, and log forwarding are accumulated resources.</br>
Here's how {{% vendor/name %}} calculates how much accumulated resource usage may cost you:
`unit price x current accumulation x daily average x number of days in the month`.

| Item                   | Description |
| ---------------------- | ----------- |
| `unit price`           | A fixed unit price. |
| `current accumulation` | The amount of accumulated resources you have effectively used so far this month. |
| `prorated quantity`    | An average based on the accumulated resource usage you've had over the last 30 days. |

All items used for the calculation are displayed in the [**Overview** tab](#access-your-billing-information).

#### Allocated resource usage estimate

The resources consumed by your applications and services (CPU, RAM, and storage) are allocated resources.</br>
Here's how {{% vendor/name %}} calculates how much allocated resource usage may cost you: `unit price x current allocation x prorated quantity`.

| Item                 | Description |
| -------------------- | ----------- |
| `unit price`         | A fixed unit price. |
| `current allocation` | The current resource allocation across your projects. |
| `prorated quantity`  | An average of past changes and current settings, applied for all the remaining days in the month. |

All items used for the calculation are displayed in the [**Overview** tab](#access-your-billing-information).

### Next month estimate

From the [**Overview** tab](#access-your-billing-information), you can also access an estimate for next month.

Like your [current month estimate](#current-month-estimate), it includes your organization settings and resource allocation on each project.
However, your next month estimate **does not include any history of changes**.

It is solely based on your current organization settings and resource allocation,
and shows what you may be charged if you don't make any changes until the end of next month.

### Invoice

Your invoice provides definitive information on what you will be charged.
It is calculated at month-end close, and includes your actual organization settings and resource usage.

To access your current invoice and a history of past invoices, open the **Invoices** tab:

![Invoices tab in the Console](/images/billing/invoices-tab.png)

## Set a billing alert

{{% note theme="info" title="Feature availability" %}}

Billing alerts can only be set and received by the organization owner,
users with the [**Manage Billing** permission](/administration/users.md#organization-permissions),
and identified billing contacts.

{{% /note %}}

You can set billing alerts to receive an email when your [current month estimate](#current-month-estimate) reaches a defined threshold.

{{% note theme="warning" title="Warning"%}}
Current month estimates are computed once a day only.
Therefore, email notifications can only be triggered once a day too.

You may want to increase your billing alert threshold after receiving an email notification.
However, if the new threshold is reached later on the same day,
**you won't get notified until the following day**, when the current month estimate is computed again.
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

## Track resource usage on a project

{{% note theme="info" title="Feature availability" %}}

This feature is available to users who have the [**Manage Billing** permission](/administration/users.md#organization-permissions) on the organization.

{{% /note %}}

You can track costs related to resource usage on a specific project in the [Console](/administration/web/_index.md).
To do so, after you've set or updated resources on your project:

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   A monthly estimate of how much each project is expected to cost is displayed.
4. You can also view the costs related to every project you've been added to.</br>
   To do so, click **{{< icon more >}} More** next to the project,
   and select **Project Billing**.</br>
   A monthly estimate of all the expected costs related to resource allocation on the project is displayed.

{{% note %}}

These estimates reflect the expected costs **for a full month** based on the way resources are allocated **at the time of viewing**.
They don't take into account the history of changes you may have made throughout the current month.</br>
Therefore, if you make changes to resource allocation during the month, your monthly invoice will differ from these estimates.

{{% /note %}}

For information on resource-related costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).


