---
title: "Configure Quarkus for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Quarkus.
---

{{< guides/config-desc name="Quarkus" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="quarkus" name="Quarkus" >}}

## Service configuration: `services.yaml`

{{% guides/config-service %}}

Deploying Quarkus doesn't in itself require you to configure a database or another service,
but in all likelihood you will want to add one at some point.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/drupal9" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="quarkus" >}}
Explaining the file line by line, notice the following settings:

1. `name`: The application name
2. `type` Where you'll define the language, in this case, Java, and the version.
3. `disk`: The disk space that the application needs in megabytes.
4. `hooks.build`: The command to package the application
5. `web.commands`: The order to start the application, where the port is overwritten with `-Dquarkus.http.port=$PORT`,
   using the `PORT` environment variable provided by Platform.sh to the application container.

{{< /guides/config-app >}}

{{< guide-buttons next="Customize Quarkus" >}}
