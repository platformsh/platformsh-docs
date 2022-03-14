---
title: "Deploy Strapi"
sidebarTitle: "Deploy"
weight: -80
toc: false
description: |
  Now that your site is ready, push it to Platform.sh and import your data.
---

## Deployment

{{< guides/deployment >}}

## Additional changes

A standard Strapi site - either one created interactively through npm (`npx create-strapi-app@latest my-project`) or through a template- will generate a basic strapi instance with access to the admin panel without the use of any external services. If this is your starting point you have all of the configuration necessary to deploy your project, but below are a few modifications that may help you develop your site more efficiently going forward.

### Install the Config Reader

{{< guides/config-reader-nodejs >}}

Go forth and Deploy (even on Friday)!

{{< guide-buttons type="last" >}}
