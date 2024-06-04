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

To help you manage costs related to your organization,
{{% vendor/name %}} provides estimates for the current month and the next.

You can set billing alerts to ensure you don't overspend,
and track resource usage on each of your projects.

For details on costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

## Access your organization billing information

To access your organization billing information in the [Console](/administration/web/_index.md):

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   The **Overview** tab is displayed.
   You can view your current month and next month estimates.

![Organization billing information in the Overview tab](/images/billing/organization-billing.png "0.6")

### Current month estimate

The [**Overview** tab](#access-your-organization-billing-information) shows an estimate of how much you may be charged at the end of this month.</br>
This estimate is based on:

- Your organization settings (user management settings, number of projects, potential add-ons, support SLA, etc.)
- Your resource allocation on each project

The estimate includes the history of changes made since the beginning of the month.
**It cannot be 100% accurate, as it is impossible to know exactly what your future usage will be.**

However, for maximum accuracy, the current month estimate includes the following underlying estimates,
each with its own calculation:

{{< codetabs >}}

+++
title=User management estimate
+++

The following formula is used to estimate how much user license and user management add-on fees may cost you this month:</br>
`unit price x prorated quantity`.

| Item               | Description |
| ------------------ | ----------- |
| `unit price`       | A fixed unit price. |
| `prorated quantity`| An average of past changes and current settings, applied for all the remaining days in the month. |

All items used for the calculation are displayed in the **Overview** tab.

<--->

+++
title=Accumulated resource usage estimate
+++

The resources consumed for builds, bandwidth, and log forwarding are accumulated resources.</br>
The following formula is used to estimate how much accumulated resource usage may cost you this month:</br>
`current accumulation + (unit price x daily average x remaining days in the month)`.

| Item                   | Description |
| ---------------------- | ----------- |
| `current accumulation` | The amount of accumulated resources you have effectively used so far this month. |
| `unit price`           | A fixed unit price. |
| `daily average`    | An average based on the accumulated resource usage you've had over the last 30 days. |

All items used for the calculation are displayed in the [**Overview** tab](#access-your-organization-billing-information).

<--->

+++
title=Allocated resource usage estimate
+++

The resources consumed by your applications and services (CPU, RAM, and storage) are allocated resources.</br>
The following formula is used to estimate how much allocated resource usage may cost you this month:</br>
`unit price x prorated quantity`.

| Item                 | Description |
| -------------------- | ----------- |
| `unit price`         | A fixed unit price. |
| `prorated quantity`  | An average of past changes and current settings, applied for all the remaining days in the month. |

All items used for the calculation are displayed in the [**Overview** tab](#access-your-organization-billing-information).

{{< /codetabs >}}

### Next month estimate

From the [**Overview** tab](#access-your-organization-billing-information), you can also access an estimate for next month.

Like your [current month estimate](#current-month-estimate), it includes your organization settings and resource allocation on each project.
However, your next month estimate **does not include any history of changes**.

It is solely based on your current organization settings and resource allocation,
and shows what you may be charged if you don't make any changes until the end of next month.

The following formulas are used:

- `unit price x current allocation` to estimate how much user license, user management add-on fees,
  and allocated resources may respectively cost you next month.

- `unit price x daily average x 30 days` to estimate how much accumulated resources may cost you next month.

### Invoice

Your invoice provides definitive information on what you will be charged.
It is calculated at month-end close, and includes your actual organization settings and resource usage.

To access your current invoice and a history of past invoices, open the **Invoices** tab:

![Invoices tab in the Console](/images/billing/invoices-tab.png)

## Manage billing alerts

{{% note theme="info" title="Feature availability" %}}

Billing alerts can only be set and received by the organization owner,
users with the [**Manage Billing** permission](/administration/users.md#organization-permissions),
and identified billing contacts.

{{% /note %}}

### Set a billing alert

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

### Edit a billing alert

To edit or delete a billing alert, click the billing alert button in the **Overview** tab:

![Billing alert button in the Console](/images/billing/billing-alert-button.png "0.1")

Change the monthly threshold and click **Save**, or click **Delete alert**.

To change the currency of your billing alerts, [contact support](/learn/overview/get-support.md).

{{% note theme="warning" title="Warning"%}}
After Support changes the currency, your existing billing alerts are **not** automatically converted to the new currency.
Edit your billing alerts to have correct amounts in the new currency.
{{% /note %}}

## Track resource usage on a project

{{% note theme="info" title="Feature availability" %}}

This feature is available to users with the [**Manage Billing** permission](/administration/users.md#organization-permissions) on the organization.

{{% /note %}}

You can track costs related to resource usage on a specific project in the [Console](/administration/web/_index.md).
To do so, after you've set or updated resources on your project:

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   Your [current month estimate](#current-month-estimate) shows how much each project in your organization is expected to cost this month.
4. You can select a project to view resource allocation and usage details.</br>
   To do so, click **{{< icon more >}} More** next to it, and select **Project Billing**.</br>
   ![Project billing information in the Overview tab](/images/billing/project-billing.png "0.6")

For information on resource-related costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).


