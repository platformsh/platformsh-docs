---
title: "Deploy Drupal 9"
sidebarTitle: "Deploy"
weight: -80
toc: false
description: |
    Now that your site is ready, push it to Platform.sh and import your data.
---

## Deployment

{{< guides/deployment >}}

## Additional changes

For a standard Gatsby site, or for the example starter blog example, you have all of the configuration necessary to deploy your project. Below are a few modifications that may help you to develop your site more efficiently going forward.

### Install the Config Reader

{{< guides/config-reader-nodejs >}}

When you make a new branch environment off of it, all of your data will be fully cloned to that new environment so you can test with your complete dataset without impacting production.

Go forth and Deploy (even on Friday)!

{{< guide-buttons next="More resources" >}}
