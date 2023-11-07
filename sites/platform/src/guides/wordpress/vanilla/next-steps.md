---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    Upgrading, adding modules, and further development of your site.
---

## Updating WordPress, plugins, and themes

There is an important caveat to keep in mind when maintaining WordPress on {{% vendor/name %}},
namely that after the build process has completed your site is left with a read-only file system.
This makes updating WordPress core, themes, and plugins not possible at runtime through the administration panel like you may be used to. 

Keeping WordPress up-to-date in environments like this is the primary reason that [managing WordPress with Composer](/guides/wordpress/composer/_index.md) is recommended.
Keeping a vanilla WordPress up-to-date on {{% vendor/name %}} requires you to clone the repository locally
and subsequently remove and re-download WordPress core, themes, and plugins to their updated version.
Perform this on a new branch, and push to {{% vendor/name %}} to test the updates before merging. 

If you choose to keep themes, plugins, and core defined as submodules in your project,
consult the [submodule documentation](/development/submodules.md) and `git pull` for the latest version.

## Local development with Lando

{{% guides/lando repo="wordpress-vanilla" %}}

{{< guide-buttons type="last" >}}