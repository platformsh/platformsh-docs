---
title: Set up multiple apps in a single project
sidebarTitle: Multiple apps
description: Create multiple apps within a single project, such as a CMS backend connected to a frontend to display it.
banner:
   title: Feature availability
   type: tiered-feature
   body: This page applies to Grid and {{% names/dedicated-gen-3 %}} projects. To ensure you have enough resources to support multiple apps, you need at least a [{{< partial "plans/multiapp-plan-name" >}} plan](/administration/pricing/_index.md#multiple-apps-in-a-single-project). To set up multiple apps on {{% names/dedicated-gen-2 %}} environments, [contact Sales](https://platform.sh/contact/).
weight: 8
---

{{% multi-app-intro %}}

No matter how many apps you have in one project, they're all served by a single [router for the project](./routes.md).
To allow your apps to communicate with each other, [create relationships](./relationships.md).
Each app separately defines its relationships to [services](/add-services/_index.md),
so apps can share services or have their own.
