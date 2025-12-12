---
title: "source"
weight: 4
description: Contains information about the app’s source code and operations that can be run on it.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images.

The following table shows the properties that can be set in `source`:

| Name         | Type                     | Required | Description                                                                                                                       |
|--------------|--------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------|
| `operations` | An operations dictionary |          | Operations that can be applied to the source code. See [source operations](/create-apps/source-operations.md).                              |
| `root`       | `string`                 |          | The path where the app code lives. Useful for [multi-app setups](/create-apps/multi-app/_index.md). <BR>**Single-runtime image**: Defaults to the directory of the `{{< vendor/configfile "app" >}}` file. <BR>**Composable image**: Defaults to the root project directory.|