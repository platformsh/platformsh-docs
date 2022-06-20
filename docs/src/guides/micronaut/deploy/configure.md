---
title: "Configure Micronaut for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Micronaut.
---

{{% guides/config-desc name="Micronaut" noService=true %}}

## Requests configuration: `routes.yaml`

{{% guides/config-routes template="micronaut" name="Micronaut" %}}

## Service configuration: `services.yaml`

{{% guides/config-service name=Micronaut noService=true /%}}

## Application container: `.platform.app.yaml`

{{% guides/config-app template="micronaut" %}}
Explaining the file line by line, notice the following settings:

1. `name`: The application name.
2. `type` Where you'll define the language, in this case, Java, and the version.
3. `disk`: The disk space that the application needs in megabytes.
4. `hooks.build`: The command to package the application.
5. `web.commands`: The order to start the application,
   where the port is overwritten using the `PORT` environment variable provided by Platform.sh to the application container.

{{< /guides/config-app >}}

{{< guide-buttons next="Customize Micronaut" >}}
