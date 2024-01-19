---
title: Deploy your app and set project resources
sidebarTitle: "Deploy resources"
weight: -100
description: Steps required for deploying a configured Flask application to {{% vendor/name %}}.
---

To push all your changes to {{% vendor/name %}} and deploy your project,
follow these steps:

1. Run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} environment:push
   ```

   The following question is displayed:

   ```bash
   Are you sure you want to push to the main (type: production) branch?
   ```

2. To activate your initial environment, answer `Y`.</br>
   {{% vendor/name %}} will now read your configuration files and deploy your project using [default container resources](/manage-resources/resource-init.md).</br>
   If you don't want to use those default resources,
   define your own [resource initialization strategy](/manage-resources/resource-init.md#define-a-resource-initialization-strategy),
   or [amend those default container resources](/manage-resources/adjust-resources.md) after your project is deployed.

{{< guide-buttons next="Handle migrations" >}}
