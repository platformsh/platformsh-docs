---
title: "{{% vendor/name %}} YAML structure"
weight: -5
description: "A description of the YAML file for {{% vendor/name %}}."
---

In addition to the [basic functions you should be familiar with](./what-is-yaml.md), YAML structure is important.
{{% vendor/name %}} accepts a specific structure for YAML configuration files.

## YAML file location

When you run the [`upsun project:init` command](/get-started/express.md#configure-your-project), a default ``config.yaml`` file is generated in the `.upsun` folder. It contains the minimum default configuration based on your detected local stack.
This YAML file is located in your ``.upsun`` directory, at the root of your project source code, and is a good starting point before customization.

```bash
.
├── {{< vendor/configdir >}}
|   └── {{< vendor/configfile "apps" "strip" >}}
└── <source code>
```
## Mandatory top-level keys
In the ``config.yaml`` file, there are only three mandatory top-level YAML keys:
- ``applications``: this section of the file contains all of your [app definitions](/create-apps/app-reference.md)
- ``routes``: this section of the file contains all of your [route definitions](/define-routes.md) (for each of your apps)
- ``services``: this section of the file contains all of your [service definitions](/add-services.md) (for each of your apps)

This looks like:
```yaml {location="{{< vendor/configfile "apps" >}}"}
{{< code-link destination="/create-apps/app-reference.md" text="applications" title="Complete list of all available properties" >}}:
  app:
    ...

{{< code-link destination="/add-services.html#available-services" text="services" title="Click to see the complete list of all available services" >}}:
  mariadb:
    type: mariadb:10.6 # All available versions are: 10.6, 10.5, 10.4, 10.3

{{< code-link destination="/define-routes.md" text="routes" title="The routes of the project. Each route describes how an incoming URL is going to be processed by Upsun (Staging). Click for more information." >}}:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
```

Below these three top-level key sections, you can use any of the [available YAML tags](./yaml-structure.md) you need.

{{% note %}}
Any YAML files located at the first level of your ``.upsun`` folder, at the root of your project source code, are taken in account. See [Rules on YAML files](#rules-on-yaml-files).
{{% /note %}}

## Rules on YAML files
The following rules apply to YAML files contained in the ``.upsun`` folder:

- All the existing YAML files located at the first level of the ``.upsun`` folder are glue together.
- All the existing YAML files located at the first level of the ``.upsun`` folder must respect the 3 top level YAML keys as described above, and must contain a [valid YAML configuration](/create-apps/app-reference.md).
- All YAML files in subdirectory of ``.upsun`` folder needs to be [manually imported](/learn/overview/yaml/platform-yaml-tags.md#include) and must contain [valid YAML configuration](/create-apps/app-reference.md).

{{% note title="Disclaimer" %}}
Please note that when Upsun glues YAML files (located at the first level of the ``.upsun`` folder), we merge only the top level YAML keys (`applications`, `services`, and `routes`).
In other words, if you defined twice an ``app`` app in two different YAML files, only the second one would be taken in account:

As an example, if we are defining our app in two different files:
```yaml {location=".upsun/app.yaml"}
applications:
  app:
    type: nodejs:16
    source:
      root: folder1
    ...
```

```yaml {location=".upsun/app-bis.yaml"}
applications:
  app:
    type: nodejs:20
    build:
      flavor: none
    ...
```

This will result as:
```yaml {location="YAML config result"}
applications:
  app:
    type: nodejs:20
    build:
      flavor: none
    ...
```

Note: ``source.root`` (and any other `.upsun/app.yaml` parameters) will be missing in the final configuration.

{{% /note %}}
