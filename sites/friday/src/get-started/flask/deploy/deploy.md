---
title: Deploy your app and set project resources
sidebarTitle: "Deploy resources"
weight: -100
description: Steps required for deploying a configured Flask application to {{% vendor/name %}}.
---

To push all your changes to {{% vendor/name %}} and deploy your project,
run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:push
```
   
The following question is displayed:

```bash
Are you sure you want to push to the main (type: production) branch?
```

To activate your initial environment, answer `Y`.

{{% vendor/name %}} reads your configuration files and deploys your project using [default container resources](/manage-resources/_index.md).
You can [amend those default container resources](/manage-resources/_index.md#configure-resources) after your project is deployed.

{{< guide-buttons next="Handle migrations" >}}
