---
title: "Organizations"
weight: 0
sidebarTitle: "Organizations"
description: |
  Organizations allow to manage Platform.sh projects, users and billing.
---

{{< description >}}

## Organization roles

As an organization owner, you can invite users to your organization and give them the following permissions:

* **Manage plans**: Add, remove and edit plans and plan options for your existing projects. (Change plan, change storage, change the number of environments, change the number of user licenses)
* **Manage billing**: Add, remove and edit billing information. Access invoices and vouchers.
* **Create projects**: Create new projects within the organization.
* **Manage users**: Add, remove and edit organization-level users and permissions, including yourself.

{{< note theme="warning" title="Important" >}}
A user with **manage users** permission can add, edit, or remove anyone’s manage plans, manage billing or create projects permissions using the Platform.sh CLI.
{{< /note >}}

## Manage organization users with the CLI

You can use the Platform.sh command line interface to fully manage users within your organization.

Available commands:

* `organization:create``
  * Create a new organization.
* `organization:info`   
  * View or change a single organization.
* `organization:list`   
  * List organizations.

## Transfer ownership

If you want to transfer ownership of a project to a different organization, submit a support ticket from the current project to ask for the transfer.

This action will automatically transfer the subscription charges to the new organization.
