---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    A collection of resources for the further development of your Gatsby site.
---

{{% vendor/name %}} supports [multi-app configuration](../../../create-apps/multi-app/_index.md) on projects - that is, including code for two separate sites that are deployed on their own containers within a single project cluster.

These days, an increasingly common pattern is to decouple content resources from a frontend Gatsby site. Decoupled sites use Gatsby's source plugin ecosystem to pull external content resources into the build, where those resources (a headless CMS, for example) are typically located on a server elsewhere.

{{% vendor/name %}}'s multi-app configuration gets around this, placing both frontend and backend sites on the same server by keeping the code for both sites in the same repository. Gatsby would reside in a subdirectory alongside another that contains the code for the backend resource. For example, a Gatsby site pulling content from a Drupal site could be kept in a single repository that looks like the snippet below:

```bash
.
├── {{< vendor/configdir >}}
│   ├── {{< vendor/configfile "routes" "strip" >}}
│   └── {{< vendor/configfile "services" "strip" >}}
├── drupal
│   ├── <application code>
│   └── {{< vendor/configfile "app" >}}
├── gatsby
│   ├── <application code>
│   └── {{< vendor/configfile "app" >}}
├── CHANGELOG.md
├── LICENSE.md
└── README.md
```

This pattern can be replicated for a number of backend applications, and you can consult the [Gatsby Headless](/guides/gatsby/headless/_index.md) guide for some common examples.

{{< guide-buttons type="last" >}}
