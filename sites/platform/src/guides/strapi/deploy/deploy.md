---
title: "Deploy Strapi"
sidebarTitle: "Deploy"
weight: -80
description: |
  Now that your site is ready, push it to {{% vendor/name %}} and import your data.
---

{{% guides/deployment %}}

## Additional changes

A standard Strapi site
(one created either interactively through `npx create-strapi-app@latest my-project` or through a template)
generates a basic Strapi instance with access to the admin panel without any external services.
If this is your starting point, you have all of the configuration necessary to deploy your project.
Below are a few modifications that may help you develop your site more efficiently going forward.

### Install the Config Reader

{{% guides/config-reader-info lang="nodejs" %}}

Go forth and deploy (even on Friday)!

{{< guide-buttons previous="Back" type="last" >}}
