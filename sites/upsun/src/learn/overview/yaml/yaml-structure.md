---
title: "{{% vendor/name %}} YAML structure"
weight: -5
description: "A description of the YAML file for {{% vendor/name %}}."
---

In addition to the [basic functions you should be familiar with](./what-is-yaml.md), YAML structure is important.
{{% vendor/name %}} accepts a specific structure for YAML configuration files.

## YAML file location

When you run the [`{{% vendor/cli %}} project:init` command](/get-started/here/configure/_index.md), a default ``config.yaml`` file is generated in the `.{{% vendor/cli %}}` folder. It contains the minimum default configuration based on your detected local stack.
This YAML file is located in your ``.{{% vendor/cli %}}`` directory, at the root of your project source code, and is a good starting point before customization.

```bash
.
├── {{< vendor/configdir >}}
|   └── {{< vendor/configfile "apps" "strip" >}}
└── <source code>
```
## Mandatory top-level keys
In the ``config.yaml`` file, there are only three mandatory top-level YAML keys:
- ``applications``: this section of the file contains all of your [app definitions](/create-apps/app-reference/single-runtime-image)
- ``routes``: this section of the file contains all of your [route definitions](/define-routes) (for each of your apps)
- ``services``: this section of the file contains all of your [service definitions](/add-services) (for each of your apps)

This looks like:
```yaml {location="apps"}
{{< code-link destination="/create-apps/app-reference/single-runtime-image.html" text="applications" title="Complete list of all available properties" >}}:
  myapp:
    ...

{{< code-link destination="/add-services.html#available-services" text="services" title="Click to see the complete list of all available services" >}}:
  mariadb:
    type: mariadb:10.6 # All available versions are: 10.6, 10.5, 10.4, 10.3

{{< code-link destination="/define-routes.html" text="routes" title="The routes of the project. Each route describes how an incoming URL is going to be processed by {{% vendor/name %}} (Staging). Click for more information." >}}:
  "https://{default}/":
    type: upstream
    upstream: "myapp:http"
```

Below these three top-level key sections, you can use any of the [available YAML tags](./platform-yaml-tags.md) you need.

{{% note %}}
Any YAML files located at the first level of your ``.upsun`` folder, at the root of your project source code, are taken in account. See [Rules on YAML files](#rules-on-yaml-files).
{{% /note %}}

## Rules on YAML files
The following rules apply to YAML files contained in the ``.upsun`` folder:

- All the existing YAML files located at the first level of the ``.upsun`` folder are taken into account.
- All the existing YAML files located at the first level of the ``.upsun`` folder must feature the [mandatory top-level keys](#mandatory-top-level-keys), and must contain a [valid YAML configuration](/create-apps/app-reference/single-runtime-image.md).
- All the YAML files in subdirectories of the ``.upsun`` folder need to be [manually imported](/learn/overview/yaml/platform-yaml-tags.md#include) and contain a [valid YAML configuration](/create-apps/app-reference/single-runtime-image.md).

{{% note title="Warning" theme="warning"%}}
When {{% vendor/name %}} combines all the YAML files located at the first level of the ``.upsun`` folder, only the top-level keys (`applications`, `services`, and `routes`) are merged. So if you define an app named ``myapp`` in two different YAML files, {{% vendor/name %}} only takes the second one into account.

Example:
```yaml {location=".upsun/app.yaml"}
applications:
  myapp:
    type: nodejs:16
    source:
      root: folder1
    ...
```

```yaml {location=".upsun/app-bis.yaml"}
applications:
  myapp:
    type: nodejs:20
    build:
      flavor: none
    ...
```

Once {{% vendor/name %}} has combined the two configuration files,
the blended configuration will be the following:
```yaml {location="YAML config result"}
applications:
  myapp:
    type: nodejs:20
    build:
      flavor: none
    ...
```

Note that ``source.root`` (and any other `.upsun/app.yaml` parameters) will *not* be included in the final configuration.

{{% /note %}}
