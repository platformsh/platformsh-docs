---
title: Multiple apps in a single project
sidebarTitle: Multiple apps
description: Create multiple apps within a single project, such as a CMS backend connected to a frontend to display it.
---

{{% multi-app-intro %}}

Note that to have enough resources to support multiple apps, you need at least a [{{< partial "plans/multiapp-plan-name" >}} plan](/administration/pricing/_index.md#multiple-apps-in-a-single-project).

{{< note >}}

This page applies to Grid and {{% names/dedicated-gen-3 %}} projects.
To set up multiple apps in {{% names/dedicated-gen-2 %}} environments, contact your sales representative.

{{< /note >}}

No matter how many apps you have in one project, they're all served by a single [router for the project](./routes.md#routes).
To let your apps talk to one another, create [relationships among them](./relationships.md#relationships).
Each app separately defines its relationships to [services](/add-services/_index.md).
So apps can share services or have their own.
