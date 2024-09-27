---
title: "Configure WordPress for {{% vendor/name %}}"
sidebarTitle: "Configure"
weight: -100
description: |
    Review the basics of what makes up a {{% vendor/name %}} project, including its three principle configuration files and how to define them for WordPress.
---

{{% guides/config-desc name="WordPress" %}}

{{% guides/config-app template="wordpress-composer" %}}

Notice that the build `flavor` is set to `composer`, which will automatically download WordPress core, as well as your plugins, themes, and dependencies during the build step as defined in your `composer.json` file. Since WordPress's caching and uploads require write access at runtime, they've been given corresponding [mounts](/create-apps/app-reference/single-runtime-image.md#mounts) defined for them at the bottom of the file. MariaDB is accessible to WordPress internally at `database.internal` thanks to the relationship definition `database`. The [WordPress CLI](https://packagist.org/packages/wp-cli/wp-cli) is added as a build dependency, but we will still need to add some additional dependencies in the next step so that it can be used by the application and via SSH.

{{< /guides/config-app >}}

{{< note >}}
During the template's build hook above, you see an `rsync` command that allows you to commit and use plugins that aren't accessible via Composer. The command moves all non-Composer plugins in a committed `plugins` directory to the final `wp-content/plugins` destination so that they can be enabled through the administration panel.

If you are migrating WordPress or starting from scratch, you should copy this line for your committed non-Composer plugins and, if needed, modify it to move committed `themes` to `wp-content/themes` in the same way.
{{< /note >}}

{{% guides/config-service WordPress=true framework=WordPress %}}

We recommend the latest [MariaDB](../../../add-services/mysql/_index.md) version for WordPress.

{{% /guides/config-service %}}

```yaml
# The services of the project.
#
# Each service listed will be deployed
# to power your Platform.sh project.
# More information: https://docs.platform.sh/add-services.html
# Full list of available services: https://docs.platform.sh/add-services.html#available-services
db:
    type: mariadb:10.4
    disk: 2048
```

{{% guides/config-routes template="wordpress-composer" name="WordPress" %}}

{{< guide-buttons previous="Back" next="Customize WordPress" >}}
