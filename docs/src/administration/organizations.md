---
title: "Organizations"
weight: -1
sidebarTitle: "Organizations"
description: |
  Organizations allow you to manage your Platform.sh projects, users, and billing.
---

{{< description >}}

## Manage your organization settings

As an organization owner, you can manage the basic settings for your organization such as its name and URL.

{{< codetabs >}}

---
title=Using the Console
file=none
highlight=false
---

1. Navigate to the organization you want to manage (or a project in it).
1. Open the user menu (your name or profile picture).
1. Click **Settings**.
1. Click **Edit** to edit the label or click in the **Organization URL** field to edit the URL.
1. Click **Save**.

<--->
---
title=Using the CLI
file=none
highlight=false
---

To change the name (URL) and label of the `acme` organization, run:

```bash
platform organization:info --org acme label "Acme Corp" name acme-corp
```

To verify the changes, run:

```bash
platform organization:info --org acme-corp
```

{{< /codetabs >}}

## Manage your organization billing

As an organization owner or an organization user with the **Manage billing** permission,
you can access and download invoices and edit billing information such as the stored credit card and billing address.

{{< codetabs >}}

---
title=Using the Console
file=none
highlight=false
---

1. Navigate to the organization you want to manage (or a project in it).
1. Open the user menu (your name or profile picture).
1. Click **Billing**.

{{< /codetabs >}}

## Manage your organization users

As an organization owner or an organization user with the **Users** permission,
you can invite other users to your organization and grant them the following permissions:

* **Billing** (`billing`):
  Add, remove and edit billing information.
  Access invoices and vouchers.
* **Plans** (`plans`):
  Add, remove, and edit plans and plan options for your existing projects.
  (Change plan, change storage, change the number of environments, change the number of user licenses)
* **Users** (`members`):
  Add, remove, and edit organization-level users and permissions, including your own.
* **Create projects** (`projects:create`):
  Create new projects within the organization.


{{< note theme="warning" >}}

A user with the **Users** (`members`) permission can add, edit, or remove _any_ user's permissions.

{{< /note >}}

{{< codetabs >}}

---
title=Using the Console
file=none
highlight=false
---

1. Navigate to the organization you want to manage (or a project in it).
1. Open the user menu (your name or profile picture).
1. Click **Users**.
1. Invite new users or edit existing users to manage their permissions.

<--->
---
title=Using the CLI
file=none
highlight=false
---

### Add a new user

To invite `alice@example.com` to the `acme` organization with the **Billing** and **Create projects** permissions, run:

```bash
platform organization:user:add alice@example.com --org=acme --permission=billing,projects:create
```

Once you've invited `alice@example.com`,
Alice receives an invitation email with instructions.

### Manage existing users

To update Alice's permissions in your organization so that she has only the **Billing** permission, run:

```bash
platform organization:user:update alice@example.com --org=acme --permission=billing
```

{{< /codetabs >}}

Users who are a part of an organization can see all projects in that organization at the organization's URL,
which takes the form `https://console.platform.sh/<ORGANIZATION_NAME>`.

They can only access projects they've been explicit invited to by a project admin.

To see all the projects that you have access to,
go to the [main console page](https://console.platform.sh) or click **All projects** within the console.
For more information on project access control, see [user administration](./users.md).

## Create a new organization

When you create a new project, if you don't already have an organization, one is created for you automatically.

You can create new organizations with different payment methods and billing addresses
and organize your projects as you want.

{{< codetabs >}}

---
title=Using the Console
file=none
highlight=false
---

1. Navigate to your existing organization or a project in it.
1. Open the user menu (your name or profile picture).
1. Click **Create Organization**.
1. Enter the required information (label, organization URL, country).
1. Click **Create organization**.

<--->
---
title=Using the CLI
file=none
highlight=false
---

To create an organization with the label `Acme` and the name (URL) `acme`, run:

```bash
platform organization:create --label "Acme" --name acme --country "United States"
```

To verify the changes, run:

```bash
platform organization:info --org acme
```

{{< /codetabs >}}

## Delete an existing organization

As an organization owner, you can delete your own organization.

Note that if your organization owns projects or owes remaining invoices, you can not delete it yourself.
To have it deleted, [contact support](../overview/get-support.md).

{{< codetabs >}}

---
title=Using the Console
file=none
highlight=false
---

1. In the console, open the organization menu.
1. Select the organization you want to delete.
1. Click **Delete the organization**.

<--->
---
title=Using the CLI
file=none
highlight=false
---

To delete the organization `acme`, run:

```bash
platform organization:delete --org acme
```

{{< /codetabs >}}

## Transfer project ownership

If you want to transfer a project to a different organization,
please [submit a support ticket](../overview/get-support.md) from the current project to ask for the transfer.

Ownership transfer automatically transfers subscription charges to the new organization.
