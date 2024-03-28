---
title: Organizations
weight: -1
description: See how to manage multiple {{% vendor/name %}} projects at once through organizations.
---

Organizations allow you to manage your {{% vendor/name %}} projects, users, and billing.
You can group multiple projects in one organization and manage them together.

To manage users within your organization, see how to [manage organization users](./users.md#manage-organization-users).

<!-- {{% version/specific %}} -->
<!-- To manage users within your organization, see how to [manage organization users](./users.md#manage-organization-users). -->
<!-- <---> -->
<!-- To manage users within your organization, you have two options: -->
<!--  -->
<!-- 1. [Managing users](./users.md#manage-organization-users) at an organization-wide or per-project basis - that is, individually. -->
<!-- 1. [Managing users as a part of a team](/administration/teams.md). -->
<!-- {{% /version/specific %}} -->

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

When you create a new project, if you don't already have an organization, one is created for you automatically.

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

You can transfer your plan ownership to a different organization at anytime.
You have to be an organization owner or have the [manage plan permission](./users.md#organization-permissions).

1. Make the new organization owner a [project admin](./users.md#)
   for the project you want to transfer.
2. To ask for the transfer, from your organization account open a [support ticket](/learn/overview/get-support).

Once the transfer is completed, the new organization can administer all project settings and billing and receives future invoices.
Ownership transfer automatically transfers subscription charges to the new organization.

## Transfer organization ownership

To transfer an organization to a different owner, first make sure that user is part of the organization.
If they aren't yet, [add them](./users.md#add-a-user-to-an-organization).
Then open a [support ticket](/learn/overview/get-support) from the current organization to ask for the transfer.
