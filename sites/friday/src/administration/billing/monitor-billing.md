---
title: Monitor your billing data
weight: 2
description: Manage your costs efficiently by viewing monthly spending estimates and setting overspending alerts.
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
Upsun provides an invoice estimate for the current month, and a cost projection for the next.

You can also set billing alerts to make sure you don't overspend,
and track resource usage on each of your projects.

## Access your billing data

To access billing data pertaining to your organization in the [Console](/administration/web/_index.md), follow these steps:

1. Navigate to your organization.
2. Open the user menu (your name or profile picture).
3. Click **Billing**.</br>
   The **Overview** tab is displayed.
   You can view your invoice estimate for the current month,
   and a cost projection for the following month.

![Overview tab in the Console](/images/billing/billing-overview-tab-console.png)

### Invoice estimates and cost projections

Your invoice estimate gives you an idea of what you may be charged at the end of the current month.
It is based on the following elements:

- Your current organization settings (number of users and projects, potential add-ons, support SLA, etc.).
- Your current resource allocation on each project.

  {{% note theme="warning" title="Warning"%}}
  Your invoice estimate is updated once a day to reflect changes made to your organization settings and resource allocation.
  
  However, the estimate only takes into account **the history of changes** made to your organization settings throughout the current month.
  It **does not** take into account the history of changes made to your resource allocation.
  
  In other words, if you make changes to your resource allocation during the month,
  your final invoice will differ from the estimate.

  **Example**:

  You make changes to your organization settings on day 12.
  Your updated estimate reflects the organization settings history since day 1,
  and shows a projected total assuming no further changes will be made until the end of the month.

  You make changes to resource allocation on a project on day 12.
  Your updated estimate is only based on the new resource allocation,
  and shows a projected total assuming no further changes will be made until the end of the month.

  {{% /note %}}

The estimated total of your current invoice is displayed in the **Overview** tab.
To view its details, click **View invoice**.</br>
Alternatively, you can go to the **Invoices** tab, which also provides a history of your past invoices.

![Billings tabs in the Console](/images/billing/invoices.png)

The **Overview** tab also shows a cost projection for the following month.
This cost projection is computed in the same way as your invoice estimate, and includes VAT.

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


