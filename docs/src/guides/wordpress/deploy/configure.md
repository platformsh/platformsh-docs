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

{{< guides/config-routes template="wordpress-composer" name="WordPress" >}}

## Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for WordPress. You can add [other services](/configuration/services/_index.md) if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure WordPress to use those services as well once the service is enabled.

Each service entry has a name (`db` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

{{< template-file template="wordpress-composer" file=".platform/services.yaml" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="wordpress-composer" >}}

Notice that the build `flavor` is set to `composer`, which will automatically download WordPress core, as well as your plugins, themes, and dependencies during the build step as defined in your `composer.json` file. Since WordPress's caching and uploads require write access at runtime, they've been given corresponding [mounts](/configuration/app/storage.md#basic-mounts) defined for them at the bottom of the file. MariaDB will be accessible to WordPress internally at `database.internal` thanks to the relationship definition `database`. The [WordPress CLI](https://packagist.org/packages/wp-cli/wp-cli) is added as a build dependency, but we will still need to add some additional dependencies in the next step so that it can be used by the application and via SSH. 

{{< /guides/config-app >}}

{{< note >}}
During the template's build hook above, you will see an `rsync` command that allows you to commit and use plugins that are not accessible via Composer. The command moves all non-Composer plugins in a committed `plugins` directory to the final `wp-content/plugins` destination so that they can be enabled through the adminstration panel. 

If you are migrating WordPress or starting from scratch, you should copy this line for your committed non-Composer plugins and, if needed, modify it to move committed `themes` to `wp-content/themes` in the same way.
{{< /note >}}

{{< guide-buttons next="Customize WordPress" >}}
