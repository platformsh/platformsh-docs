---
title: "Configure WordPress for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for WordPress.
---

{{< guides/config-desc name="WordPress" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="wordpress-vanilla" name="WordPress" >}}

## Service configuration: `services.yaml`

{{% guides/config-service WordPress=true framework=WordPress %}}

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for WordPress.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/wordpress-vanilla" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="wordpress-vanilla" >}}

There are a few things to notice in this file specific to running non-Composer variants of WordPress on Platform.sh. Defined in the `dependencies` block, all of the packages needed to run the WordPress CLI in both the application container and via SSH are installed in the first stages of the build process using Composer. Also, the `web.locations` block will expose `wordpress/index.php` under the primary route. 
{{< /guides/config-app >}}

{{< guide-buttons next="Customize WordPress" >}}


