---
title: "`source`"
weight: 4
description: See all of the options for controlling your apps and how they're built and deployed on {{% vendor/name %}}.
---

Optional. The following table shows the properties that can be set in `source`:


| Name         | Type                     | Required | Description                                                                                                                                                      |
| ------------ | ------------------------ | -------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `operations` | An operations dictionary |          | Operations that can be applied to the source code. See [source operations](/create-apps/source-operations.md).                                                              |
| `root`       | `string`                 |          | The path where the app code lives. Useful for [multi-app setups](/create-apps/multi-app/_index.md). **Single-runtime image**: Defaults to the directory of the `{{< vendor/configfile "app" >}}` file. **Composable image**: Defaults to the root project directory. |
