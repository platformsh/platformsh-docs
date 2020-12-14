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

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for WordPress. You can add [other services](/configuration/services/_index.md) if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure WordPress to use those services as well once the service is enabled.

Each service entry has a name (`db` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

{{< readFile file="static/files/fetch/servicesyaml/wordpress-vanilla" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="wordpress-vanilla" >}}

There are a few things to notice in this file specific to running non-Composer variants of WordPress on Platform.sh. Defined in the `dependencies` block, all of the packages needed to run the WordPress CLI in both the application container and via SSH are included and installed in the first stages of the build process using Composer. Also, the `web.locations` block will expose `wordpress/index.php` under the primary route. 
{{< /guides/config-app >}}

{{< guide-buttons next="Customize WordPress" >}}


