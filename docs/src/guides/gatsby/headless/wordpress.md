---
title: "How to deploy Gatsby with WordPress on Platform.sh"
sidebarTitle: "WordPress"
description: |
    WordPress's built-in content API can quickly become a content source for Gatsby with `gatsby-source-wordpress`.
---


{{< guides/gatsby/headless-intro template="gatsby-wordpress" name="WordPress" >}}

## Shared Platform.sh configuration

{{< guides/gatsby/headless-project name="WordPress" >}}

### `.platform/services.yaml`

{{< guides/gatsby/headless-services template="gatsby-wordpress" name="WordPress" >}}

### `.platform/routes.yaml`

{{< guides/gatsby/headless-routes template="gatsby-wordpress" name="WordPress" >}}

## WordPress

**WordPress specifics**

## Gatsby

{{< guides/gatsby/headless-gatsby template="gatsby-wordpress" name="WordPress" >}}

**WordPress specifics**

{{< /guides/gatsby/headless-gatsby >}}

**WordPress specifics**

## Deploy and post-install

{{< guides/gatsby/headless-postinstall name="WordPress" >}}

**WordPress post-install description...**

{{< /guides/gatsby/headless-postinstall >}}

## Next steps

With Gatsby now deployed and pulling content from a backend WordPress application, there are a few things you may wish to change about your project going forward.

### `applications.yaml`

{{< guides/gatsby/headless-applicationsyaml name="WordPress" >}}

### Multiple content sources

{{< guides/gatsby/headless-multiplesources name="WordPress" >}}

### Plan size

{{< guides/gatsby/headless-plansize >}}
