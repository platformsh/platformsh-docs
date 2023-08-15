---
title: "Configure Drupal 9 for {{< vendor/name >}}"
sidebarTitle: "Configure"
weight: -100
description: |
    Review the basics of what makes up a {{< vendor/name >}} project, including its three principle configuration files and how to define them for Drupal.
banner:
    title: A note on version
    body: While this guide focuses on Drupal 9, you can also refer to it when using Drupal 10 as differences in settings are minimal. Note that a {{< vendor/name >}} [Drupal 10 template](https://github.com/platformsh-templates/drupal10) is available.
---

{{% guides/config-desc name="Drupal 9" %}}

{{% guides/config-app template="drupal9" /%}}

{{% guides/config-service name="Drupal" %}}

We recommend the latest [MariaDB](../../../add-services/mysql/_index.md) version for Drupal,
although you can also use Oracle MySQL or [PostgreSQL](../../../add-services/postgresql.md).
For Drupal caching, we strongly recommend [Redis](../../../add-services/redis.md).
Drupal's cache can be very aggressive,
and keeping that data out of the database helps with both performance and disk usage.
See an example of Redis for caching in our [Drupal template](https://github.com/platformsh-templates/drupal9).

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/drupal9" highlight="yaml" >}}

{{% guides/config-routes template="drupal9" name="Drupal 9" %}}

{{< guide-buttons next="Customize Drupal9" >}}
