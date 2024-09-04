---
title: "{{% vendor/name %}} YAML structure"
weight: -5
description: "A description of the YAML file for {{% vendor/name %}}."
---

In addition to the [basic functions you should be familiar with](./what-is-yaml.md), YAML structure is important.
{{% vendor/name %}} accepts a certain structure for YAML configuration files.


When you run the `platform project:init` command, three default YAML configuration files are generated in the `{{< vendor/configdir >}}` folder and at the root of your source code. They contain the minimum default configuration based on your detected local stack.
These YAML files are a good starting point before customization.

```bash
.
├── {{< vendor/configdir >}}
|   ├── {{< vendor/configfile "routes" "strip" >}}
|   └── {{< vendor/configfile "services" "strip" >}}
├── {{< vendor/configfile "app" >}}
└── <source code>
```

These three YAML files configure the following:
- ``{{< vendor/configfile "routes" "strip" >}}``: this file contains all of your [routes definition](/define-routes.md)
- ``{{< vendor/configfile "services" "strip" >}}``: this file contains the list of your [services definition](/add-services.md)
- ``{{< vendor/configfile "app" >}}``: this file contains your [application definition](/create-apps/app-reference/single-runtime-image)

## Examples

```yaml {location="{{< vendor/configfile "app" >}}"}

# {{< code-link destination="/create-apps/app-reference/single-runtime-image.html" text="Complete list of all available properties" title="Complete list of all available properties" >}}

# A unique name for the app. Must be lowercase alphanumeric characters.
# Changing the name destroys data associated with the app.
name: "myapp"

# The runtime the application uses.

# {{< code-link destination="/create-apps/app-reference/single-runtime-image.html#types" text="Complete list of available runtimes" title="Complete list of available runtimes" >}}
type: "php:8.2"
...
```

```yaml {location="{{< vendor/configfile "services" >}}"}
# The services of the project.
#
# Each service listed will be deployed
# to power your Platform.sh project.
# {{< code-link destination="/add-services.html#available-services" text="Full list of available services" title="Click to see the complete list of all available services" >}}

mariadb:
  # All available versions are: 10.6, 10.5, 10.4, 10.3
  type: mariadb:10.6
```

```yaml {location="{{< vendor/configfile "routes" >}}"}
# The routes of the project.
#
# Each route describes how an incoming URL is going
# to be processed by Platform.sh.
# {{< code-link destination="/define-routes.html" text="More information" title="Click to see more information" >}}

"https://{default}/":
  type: upstream
  upstream: "myapp:http"

# A basic redirect definition
# {{< code-link destination="/define-routes.html#basic-redirect-definition" text="More information" title="Click to see more information" >}}

"https://www.{default}":
  type: redirect
  to: "https://{default}/"
```

In these files, you can use any of the [available YAML tags](./platform-yaml-tags.md) you need.

## Multi-app
In a [multiple application](/create-apps/multi-app/_index.md) context, you can also group all of your app configurations in a global ``.platform/applications.yaml`` file.
This file contains a list of app configurations, such as:
```yaml {location="{{< vendor/configfile "apps" >}}"}
app1:
  type: php:8.3
  source:
    root: app1

app2:
  type: nodejs:20
  source:
    root: app2
```

