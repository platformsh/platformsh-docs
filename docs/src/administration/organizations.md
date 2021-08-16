---
title: "Organizations"
weight: -1
sidebarTitle: "Organizations"
description: |
  Organizations allow to manage Platform.sh projects, users and billing.
---

{{< description >}}

## Organization settings

As an organization owner you can manage basic settings of your organization such as its name and URL.

## Organization billing

As an organization owner, or as an organization user with the **manage billing** role, you can access and download invoices, edit billing information such as the stored credit card, the billing address etc. 

## Organization users and roles

As an organization owner, or as an organization user with the **manage users** role, you can invite other users to your organization and grant them the following roles:

* **Manage plans** (`plans`): Add, remove and edit plans and plan options for your existing projects. (Change plan, change storage, change the number of environments, change the number of user licenses)
* **Manage billing** (`billing`): Add, remove and edit billing information. Access invoices and vouchers.
* **Create projects** (`projects:create`): Create new projects within the organization.
* **Manage users** (`users`): Add, remove and edit organization-level users and permissions, including your own.

{{< note theme="warning" title="Important" >}}
A user with the **manage users** permission can add, edit, or remove any user's permissions to manage plans, manage billing or create projects using the Platform.sh CLI.
{{< /note >}}

## Manage organizations with the CLI

You can use the Platform.sh command line interface to manage your organizations.

Available commands:

* `platform organization:create`
  * Create a new organization.
* `platform organization:info`
  * View or edit an organization.
* `platform organization:list`
  * List all the organizations that you have access to.
* `platform organization:user:list`
  * List all users within an organization.
* `platform organization:user:add`
  * Invite a user to an organization.
* `platform organization:user:get`
  * Get information about a user in an organization.
* `platform organization:user:update`
  * Update permissions of a user in an organization.
* `platform organization:user:delete`
  * Remove a user from an organization.

For example, the following command would invite `alice@example.com` with the **Billing**, **Plans** and **Projects create** permissions to the `my-organization-name` organization.

```bash
platform organization:user:add alice@example.com --name=my-organization-name --permission=billing,plans,projects:create
```

After inviting `alice@example.com`, Alice will receive an invitation email asking to confirm her details and optionally, register for a Platform.sh account.

To update Alice permissions in your organization, simply run:

```bash
platform organization:user:update alice@example.com --name=my-organization-name --permission=billing
```

This command would remove all previously granted permissions from Alice, and only grant the **Billing** permission.

## Transfer project ownership

If you want to transfer a project to a different organization, please submit a support ticket from the current project to ask for the transfer.

This action will automatically transfer the subscription charges to the new organization.
