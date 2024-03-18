---
title: "Deploy Drupal"
sidebarTitle: "Deploy"
weight: -80
description: |
    Now that your site is ready, push it to {{% vendor/name %}} and import your data.
---

## Deployment

{{% guides/deployment %}}

## Post-install (new site)

If you are creating a new site, visiting the site in your browser will trigger the Drupal installer.
Run through it as normal, but note that you will not be asked for the database credentials.
The `settings.platformsh.php` file added earlier automatically provides the database credentials
and the installer is smart enough to not ask for them again.

Once the installer is complete you are presented with your new site.

{{% guides/data-migration %}}

Drupal has a number of database tables that are useless when migrating
and you're better off excluding their data.

* If you're using a database cache backend then you can and should exclude all `cache_*` table data.
  On {{% vendor/name %}} we recommend using Redis anyway,
  and the template described on the previous pages uses Redis automatically.
* The `sessions` table's data can also be excluded.

While you can trim the data out of these tables post-migration,
that's wasteful of both time and disk space, so it's better to exclude that data to begin with.

{{% /guides/data-migration %}}

Go forth and Deploy (even on Friday)!

{{< guide-buttons previous="Back" next="More resources" >}}
