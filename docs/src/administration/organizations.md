---
title: "Organizations"
weight: -1
sidebarTitle: "Organizations"
description: |
  Organizations allow you to manage your Platform.sh projects, users, and billing.
---

{{% description %}}

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

As an organization owner or an organization user with the **Manage users** permission,
you can invite other users to your organization and grant them the following permissions:

* **Manage billing** (`billing`):
  Add, remove and edit billing information.
  Access invoices and vouchers.
  Users with this permission receive monthly invoices by email.
* **Manage plans** (`plans`):
  Add, remove, and edit plans and plan options for existing projects.
  (Change plan, change storage, change the number of environments, change the number of user licenses)
* **Manage users** (`members`):
  Add, remove, and edit organization-level users and permissions, except their own.
  Users with this permission can't grant other users permissions that they themselves don't have.
* **Create projects** (`projects:create`):
  Create new projects within the organization.

{{< note theme="warning" >}}

Users with the **Manage users** (`members`) permission can add, edit, or remove _any_ user's permissions except their own.

{{< /note >}}

{{< codetabs >}}

---
title=Using the Console
file=none
highlight=false
---

1. Navigate to the organization you want to manage (or a project in it).
2. Open the user menu (your name or profile picture).
3. Click **Users**.
4. Invite new users or edit existing users to manage their permissions.

<--->
---
title=Using the CLI
file=none
highlight=false
---

### Add a new user

To invite `alice@example.com` to the `acme` organization with the **Manage billing** and **Create projects** permissions, run:

```bash
platform organization:user:add alice@example.com --org=acme --permission=billing,projects:create
```

Once you've invited `alice@example.com`,
Alice receives an invitation email with instructions.

### Manage existing users

To update Alice's permissions in your organization so that she has only the **Manage billing** permission, run:

```bash
platform organization:user:update alice@example.com --org=acme --permission=billing
```

{{< /codetabs >}}

Users who are a part of an organization can see all projects in that organization at the organization's URL,
which takes the form `https://console.platform.sh/<ORGANIZATION_NAME>`.

They can only access projects they've been explicit invited to by a project admin.

To see all the projects that you have access to,
go to the [main Console page](https://console.platform.sh) or click **All projects** within the Console.
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

1. Navigate to your existing organization or a project in it.
2. Open the user menu (your name or profile picture).
3. Click **Settings**.
4. Click **Delete Organization**.
5. Confirm your decision by clicking **Delete**.

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

You can transfer your plan ownership to a different organization at anytime.
You have to be an organization owner or have the [manage plan permission](#manage-your-organization-users).

1. Make the new organization owner a Project Admin for the project you want to transfer.
2. Submit a [support ticket](https://console.platform.sh/-/users/~/tickets) from your organization account to ask for the transfer.

Once the transfer is completed, the new organization can administer all project settings and billing and receives future invoices.
Ownership transfer automatically transfers subscription charges to the new organization.

## Transfer organization ownership

To transfer an organization to a different owner, first make sure that user is part of the organization.
If they aren't yet, [add them](#manage-your-organization-users).
Then submit a [support ticket](https://console.platform.sh/-/users/~/tickets) from the current organization to ask for the transfer.
