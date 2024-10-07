---
title: "Configure WordPress for {{% vendor/name %}}"
sidebarTitle: "Configure"
weight: -100
description: |
    Review the basics of what makes up a {{% vendor/name %}} project, including its three principle configuration files and how to define them for WordPress.
---

{{% guides/config-desc name="WordPress" %}}

{{% guides/config-app template="wordpress-vanilla" %}}

There are a few things to notice in this file specific to running non-Composer variants of WordPress on {{% vendor/name %}}. Defined in the `dependencies` block, all of the packages needed to run the WordPress CLI in both the application container and via SSH are installed in the first stages of the build process using Composer. Also, the `web.locations` block will expose `wordpress/index.php` under the primary route. 

{{< /guides/config-app >}}

{{% guides/config-service WordPress=true framework=WordPress %}}

We recommend the latest [MariaDB](../../../add-services/mysql/_index.md) version for WordPress.

{{% /guides/config-service %}}

```yaml
# The services of the project.
#
# Each service listed will be deployed
# to power your Platform.sh project.

db:
    type: mariadb:10.4
    disk: 2048
```

{{% guides/config-routes template="wordpress-vanilla" name="WordPress" %}}

{{< guide-buttons next="Customize WordPress" >}}


