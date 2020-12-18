---
title: "How to deploy Gatsby with Strapi on Platform.sh"
sidebarTitle: "Strapi"
description: |
    You can build out an API from scratch with Strapi, and then connect its data to a frontend Gatsby app with `gatsby-source-strapi`.
---

{{< guides/gatsby/headless-intro template="gatsby-strapi" name="Strapi" >}}

## Shared Platform.sh configuration

{{< guides/gatsby/headless-project name="Strapi" >}}

### `.platform/services.yaml`

{{< guides/gatsby/headless-services template="gatsby-strapi" name="Strapi" >}}

### `.platform/routes.yaml`

{{< guides/gatsby/headless-routes template="gatsby-strapi" name="Strapi" >}}

## Strapi

**Strapi specifics**

## Gatsby

{{< guides/gatsby/headless-gatsby template="gatsby-strapi" >}}

## Deploy and post-install

{{< guides/gatsby/headless-postinstall name="Strapi">}}

**Strapi post-install description...**

{{< /guides/gatsby/headless-postinstall >}}

## Next steps

With Gatsby now deployed and pulling content from a backend Strapi application, there are a few things you may wish to change about your project going forward.

### `applications.yaml`

{{< guides/gatsby/headless-applicationsyaml name="Strapi" >}}

### Multiple content sources

{{< guides/gatsby/headless-multiplesources name="Strapi" >}}

### Plan size

{{< guides/gatsby/headless-plansize >}}
