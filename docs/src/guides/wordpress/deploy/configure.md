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

{{% guides/config-service WordPress=true %}}

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for WordPress.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/wordpress-composer" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="wordpress-composer" >}}

Notice that the build `flavor` is set to `composer`, which will automatically download WordPress core, as well as your plugins, themes, and dependencies during the build step as defined in your `composer.json` file. Since WordPress's caching and uploads require write access at runtime, they've been given corresponding [mounts](/configuration/app/storage.md#basic-mounts) defined for them at the bottom of the file. MariaDB will be accessible to WordPress internally at `database.internal` thanks to the relationship definition `database`. The [WordPress CLI](https://packagist.org/packages/wp-cli/wp-cli) is added as a build dependency, but we will still need to add some additional dependencies in the next step so that it can be used by the application and via SSH. 

{{< /guides/config-app >}}

{{< note >}}
During the template's build hook above, you will see an `rsync` command that allows you to commit and use plugins that are not accessible via Composer. The command moves all non-Composer plugins in a committed `plugins` directory to the final `wp-content/plugins` destination so that they can be enabled through the administration panel. 

If you are migrating WordPress or starting from scratch, you should copy this line for your committed non-Composer plugins and, if needed, modify it to move committed `themes` to `wp-content/themes` in the same way.
{{< /note >}}

{{< guide-buttons next="Customize WordPress" >}}
