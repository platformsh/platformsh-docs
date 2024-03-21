---
title: "Source"
weight: 180
description:
---

The following table shows the properties that can be set in `source`:

| Name         | Type                     | Required | Description                                                                                                                                 |
|--------------|--------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `operations` | An operations dictionary |          | Operations that can be applied to the source code. See [source operations](/create-apps/source-operations.md)                               |
| `root`       | `string`                 |          | The path where the app code lives. Defaults to the root project directory. Useful for [multi-app setups](/create-apps/multi-app/_index.md). |
