---
title: "Configure Laravel for Platform.sh"
sidebarTitle: "Configure"
weight: -100
description: |
  Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Laravel.
---

{{% guides/config-desc name="Laravel" platformify="laravel" %}}

## Requests configuration: `routes.yaml`

{{% guides/config-routes template="laravel" name="Laravel" %}}

## Service configuration: `services.yaml`

{{% guides/config-service framework=Laravel %}}

{{% /guides/config-service %}}

## Application container: `.platform.app.yaml`

{{% guides/config-app template="laravel" %}}

{{< /guides/config-app >}}

Now that you have Laravel configured, connect it with Laravel Bridge.

{{< guide-buttons next="Connect to Platform.sh" >}}
