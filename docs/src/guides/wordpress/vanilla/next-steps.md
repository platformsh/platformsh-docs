---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    Upgrading, adding modules, and further development of your site.
---

## Updating WordPress, plugins, and themes

There is an important caveat to keep in mind when maintaining WordPress on Platform.sh, namely that after the build process has completed your site will be left with a read-only file system. Obviously, this makes updating WordPress core, themes, and plugins not possible at runtime through the administration panel like you may be used to. 

Keeping WordPress up-to-date in environments like this is the primary reasons that [managing WordPress with Composer](/guides/wordpress/composer/_index.md) is recommended. Keeping a vanilla WordPress up-to-date on Platform.sh will require you to clone the repository locally and subsequently remove and re-download WordPress core, themes, and plugins to their updated version. Perform this on a new branch, and push to Platform.sh to test the updates before merging. 

If you choose to keep themes, plugins and core defined as submodules in your project, consult the [submodule documentation](/development/submodules.md) and `git pull` for the latest version.

## Local development with Lando

{{< guides/lando repo="platformsh-templates/wordpress-vanilla" >}}

This Landofile is also the place where you can configure access to tools that would normally be available within a Platform.sh app container (such as the WordPress CLI), that you would also want access to locally. 

{{< /guides/lando >}}

{{< guide-buttons type="last" >}}