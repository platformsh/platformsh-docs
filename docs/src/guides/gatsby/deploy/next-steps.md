---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
toc: false
description: |
    A collection of resources for the further development of your site.
---

## Multi-app configuration and headless CMS content sources

An increasingly common pattern is to decouple content resources from a frontend Gatsby site. Decoupled sites leverage Gatsby's source plugin ecosystem to pull external content resources into builds, which are typically located on a server elsewhere. 

Alternatively, Platform.sh supports [multi-app configuration](/configuration/app/multi-app.md) on projects - that is, including code for two separate sites that are deployed on their own containers within a single project cluster. Within a single repository, Gatsby would reside in a subdirectory alongside another directory that contains the code for the resource. For example, a Gatsby site pulling content from a Drupal site could be kept in a single repository, with a subdirectory dedicated for each of those codebases:

```bash
.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── drupal
│   ├── <application code>
│   └── .platform.app.yaml
├── gatsby
│   ├── <application code>
│   └── .platform.app.yaml
├── CHANGELOG.md
├── LICENSE.md
└── README.md
```

This pattern can be replicated for a number of backend applications, and you can consult the [Gatsby Headless](/guides/gatsby/headless/_index.md) guide for some common examples.

{{< guide-buttons type="last" >}}
