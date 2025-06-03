---
title: Set up multiple apps in a single project
sidebarTitle: Multiple apps
description: Create multiple apps within a single project, such as a CMS backend connected to a frontend to display it.
---

{{% multi-app-intro %}}

No matter how many apps you have in one project, they're all served by a single [router for the project](/create-apps/multi-app/routes.md).
To allow your apps to communicate with each other, [create relationships](/create-apps/multi-app/relationships.md).
Each app separately defines its relationships to [services](/add-services/_index.md),
so apps can share services or have their own.
