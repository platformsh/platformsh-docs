---
title: "Multiple Drupal sites in a single Project"
sidebarTitle: "Multi-site"
toc: false
description: |
    {{% vendor/name %}} supports running [multiple applications](/learn/bestpractices/oneormany.md) in the same project, and these can be two or more Drupal sites.
weight: -80
---

{{% description %}}

But they would be separate Drupal instances: they have their assets separate and live their lives apart, and it would be much better for them not to share the same database (though they could).

## Multisite Drupal

{{% vendor/name %}} actively discourages running Drupal in "multisite" mode. Doing so eliminates many of the advantages {{% vendor/name %}} offers, such as isolation and safe testing.
Additionally, because of the dynamic nature of the domain names that are created for the different environments, the multisite configuration would be complex and fragile.

We recommend running separate projects for separate Drupal sites, or using one of the various "single instance" options available such as [Domain Access](https://www.drupal.org/project/domain), [Organic Groups](https://www.drupal.org/project/og), or [Workbench Access](https://www.drupal.org/project/workbench_access).

The only reason to use multisite Drupal would be to manage a series of nearly identical sites with separate databases.
For that case we have built a [template repository](https://github.com/platformsh-templates/drupal9-multisite) that uses a unified lookup key for a subdomain, database name, and file paths.
Note that it will likely require modification for your specific setup and some configurations may require a different approach.

In particular, this example:

* Defines two MySQL databases.
* Uses a modified `settings.platformsh.php` that accepts a key variable from `settings.php` to specify which database and file system paths to use.
* Extracts the `sites` directory to use from the domain.
