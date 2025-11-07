---
title: Subscribe to an add-on
description: Subscribe to add-ons to enhance your user experience.
keywords:
  - Advanced User Management
  - Add-on
  - Sellable
  - Continuous profiling
---

Depending on your needs, you may want to upgrade to the following {{% vendor/name %}} add-ons.
You can do so directly from the Console.

## Advanced User Management add-on

### Included features

The Advanced User Management add-on gives you access to the following features:

- [Teams](/administration/teams.md)
- [MFA enforcement](/administration/mfa.md)
- [Single sign-on](#single-sign-on)

{{% note theme="info" %}}

Note that the minimum commitment for this add-on is **30 days** before any changes can be made.

{{% /note %}}

### Upgrade to the Advanced User Management add-on

To upgrade to the Advanced User Management add-on, follow these steps:

1. In the Console, navigate to your organization.
2. Open the user menu (your name or profile picture), then select **Billing**.
3. In the **Organization add-ons** section of the **Overview** tab,
   locate the **User management** panel and click **Upgrade**.
4. In the pop-up window, select **Advanced user management** and check the 30-day commitment box.
5. Click **Upgrade**.

After the add-on is added to your organization,
you can remove it from the same location in the **Overview** tab
by clicking **Downgrade**.
Once the minimum 30-day commitment period is over,
the add-on is removed from your organization and you are no longer billed for it.

## Continuous Profiling add-on

### Included features

By default, {{% vendor/name %}} offers 15 minutes of continuous profiling per project and for free.
When you upgrade to the continuous profiling add-on,
you get 30 days of continuous profiling per project for a fixed fee.
For more information on incurred costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

### Upgrade to the Continuous Profiling add-on

To upgrade to this add-on, follow these steps:

1. In the Console, navigate to your organization.
2. Open the user menu (your name or profile picture), then select **Billing**.
3. In the **Overview** tab, find the project on which you want to activate full continuous profiling.
4. Click **{{< icon more >}} More** next to that project.
5. Click **Project billing**.
3. In the **Project add-ons** section,
   locate the **Continuous profiling** panel and click **Enable**.
5. To confirm, click **Enable**.

## Organization Support add-on

The {{% vendor/name %}} Organization Support add-on provides tiered support options tailored to organizational needs. These tiers vary between Standard, Advanced and Premium. 

{{% note theme="tip" %}}

All organizations are automatically enrolled in the **Standard** support tier. This tier is the default and cannot be removed.  

{{% /note %}}

### Available tiers

| Tier       | Cost (% of Org Spend) | Urgent SLA   | High SLA     | Normal SLA   | Low SLA     |
|------------|------------------------|--------------|--------------|--------------|-------------|
| **Standard** (Default) | 10%                   | 4h (24/7)     | 24h (24/7)    | 48h (24/7)   | 72h (24/7)  |
| **Advanced**           | 15%                   | 1h (24/7)     | 6h (24/7)     | 12h (24/7)   | 24h (24/7)  |
| **Premium**            | 19%                   | 30m (24/7)    | 3h (24/7)     | 8h (24/7)    | 24h (24/7)  |

{{% note theme="info" title="Minimum requirements" %}}

The Advanced and Premium tiers require a 12 month minimum time commitment (MTC). 

{{% /note %}}

### Upgrade to the Organization Support add-on

To upgrade to either the Advanced or Premium tier, follow these steps:

1. Visit the **Organization Billing Overview** page in Console.
2. Navigate to the **Organization Add-ons** section.
2. Select your desired support tier.
3. Acknowledge and accept the 12 month MTC.
4. Confirm the upgrade. The new support level will be applied, and billing will be adjusted accordingly.


### Spend calculation

The Organization Support add-on fee is calculated as a percentage of your Organization's total recurring spend, including:

- Projects
- Sellables
- User licenses

For more information on incurred costs, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

{{% note theme="warning" title="Exclusions" %}}

One-time charges, taxes, discounts, and the support add-on itself are **not** included in the spend calculation.

{{% /note %}}

### Downgrading tiers

Downgrades are permitted only after the 365 day MTC has been completed. Organizations may:

- Downgrade from Premium to Advanced
- Downgrade from Advanced or Premium to Standard

Downgrades are performed through the Console and take effect based on the Organization's billing cycle.

## Single sign-on {#single-sign-on}

The Advanced User Management add-on enables you to enforce single sign-on (SSO) with <span id="single-sign-on-google">Google</span> or the following OpenID Connect (OIDC)–compliant providers: Microsoft (Entra ID), Okta, Ory, or Ping Identity.

As explained previously in this topic, you can [upgrade to this add-on](#upgrade-to-the-advanced-user-management-add-on) directly in the {{% vendor/name %}} console. For additional questions, please contact our [Support team](https://console.upsun.com/-/users/~/tickets/open) or visit the [Upsun pricing](https://upsun.com/pricing/) page.


