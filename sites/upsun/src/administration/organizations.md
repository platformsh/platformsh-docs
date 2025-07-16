---
title: Organizations
weight: -1
description: See how to manage multiple {{% vendor/name %}} projects at once through organizations.
---

Organizations allow you to manage your {{% vendor/name %}} projects, users, and billing.
You can group multiple projects in one organization and manage them together.

To manage users within your organization, see how to [manage organization users](/administration/users.md#manage-organization-users).

## Manage your organization settings

As an organization owner, you can manage the basic settings for your organization such as its name and URL.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to the organization you want to manage (or a project in it).
2. Open the user menu (your name or profile picture).
3. Click **Settings**.
4. Click **Edit** to edit the label or click in the **Organization URL** field to edit the URL.
5. Click **Save**.

<--->
+++
title=Using the CLI
+++

To change the name (URL) and label of the `acme` organization, run:

```bash
{{% vendor/cli %}} organization:info --org acme label "Acme Corp" name acme-corp
```

To verify the changes, run:

```bash
{{% vendor/cli %}} organization:info --org acme-corp
```

{{< /codetabs >}}

## Manage your organization billing

As an organization owner or an organization user with the **Manage billing** permission,
you can access and download invoices and edit billing information such as the stored credit card and billing address.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to the organization you want to manage (or a project in it).
1. Open the user menu (your name or profile picture).
1. Click **Billing**.

{{< /codetabs >}}

## Create a new organization

You can create new organizations with different payment methods and billing addresses
and organize your projects as you want.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization or a project in it.
1. Open the user menu (your name or profile picture).
1. Click **Create Organization**.
1. Enter the required information (label, organization URL, company name, country, security contact).
1. Click **Create organization**.

<--->
+++
title=Using the CLI
+++

To create an organization with the label `Acme` and the name (URL) `acme`, run:

```bash
{{% vendor/cli %}} organization:create --label "Acme" --name acme --country "United States"
```

To verify the changes, run:

```bash
{{% vendor/cli %}} organization:info --org acme
```

{{< /codetabs >}}

{{% note %}}

To monitor your spend, you can [set billing alerts](/administration/billing/monitor-billing.html#manage-billing-alerts) on your new organization.
Billing alerts are based on a [current month estimate](/administration/billing/monitor-billing.html#current-month-estimate).
Once that estimate reaches a defined threshold, you receive an email notification.

{{% /note %}}

## Delete an existing organization

As an organization owner, you can delete your own organization.

Note that if your organization owns projects or owes remaining invoices, you can not delete it yourself.
To have it deleted, [contact support](/learn/overview/get-support.md).

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization or a project in it.
2. Open the user menu (your name or profile picture).
3. Click **Settings**.
4. Click **Delete Organization**.
5. Confirm your decision by clicking **Delete**.

<--->
+++
title=Using the CLI
+++

To delete the organization `acme`, run:

```bash
{{% vendor/cli %}} organization:delete --org acme
```

{{< /codetabs >}}

## Transfer project ownership

You can transfer your project ownership to a different organization at anytime.
To do this, you must be an organization owner or have the [manage billing permission](/administration/users.md#organization-permissions).

1. Make the new organization owner a [project admin](/administration/users.md#)
   for the project you want to transfer.
2. To ask for the transfer, from your organization account open a [support ticket](/learn/overview/get-support.md).

Once the transfer is completed, the new organization can administer all project settings and billing and receives future invoices.
Ownership transfer automatically transfers subscription charges to the new organization.

## Transfer organization ownership

To transfer an organization to a different owner, first make sure that user is part of the organization.
If they aren't yet, [add them](/administration/users.md#add-a-user-to-an-organization).
Then open a [support ticket](/learn/overview/get-support.md) from the current organization to ask for the transfer.

## Fixed and Flex organizations

### What is a fixed organization?
Ideal for workloads that have consistent resource requirements with stable and predictable usage.
Users can select a plan with predefined CPU and Memory resources. You can not adjust these resources, nor scale them automatically. To increase capacity, you’ll need to upgrade to a higher plan.

### What is a flex organization?
Ideal for workloads that evolve over time or have dynamic resource requirements. 
Flex will suit most use cases.
Users will be able to allocate the exact CPU and Memory resources that your applications and services need. You can adjust these resources at any time, or configure them to adapt automatically. You are charged based on the resources you allocate.

### What can you do?
When creating a new organization, users will be able to select the organization type from a drop-down option based on their preference. Once the organization is created, users can manage their organizations like they do today.

## FAQs
### Will customers who have organizations in both fixed and flex still switch between two different consoles?
Correct, they will be able to select their organization (fixed or flex) from a drop-down.

### How will fixed vs flex be identifiable in the console? 
Organizations will have tags next to the names in the console.

### Will customers with fixed projects be able to access them via the upsun cli tool?
Correct.

### Will customers with fixed projects still use the same configuration files and configuration file structures (ie .platform.app.yaml, .platform/services.yaml, .platform/routes.yaml, etc?
Correct.

### Will mount differences still exist between fixed and flex after Sept?
Yes, waiting for the git fixes for this.

### Beyond the name “platform.sh” going away in console, are there other visual changes in the fixed console that will be different than it is today?
Org creation flow is being updated, free trial for only flex orgs, @Ndifreke @Miguel is there anything else?

### Assuming a unified CLI, will there be a new field when viewing a project list to identify fixed vs flex?
Users have a list of all the organizations and right now there is no field for flex/fixed in the cli.
