---
title: "Configure Drupal for {{% vendor/name %}}"
sidebarTitle: "Configure"
weight: -100
description: |
    Review the basics of what makes up a {{% vendor/name %}} project, including its three principle configuration files and how to define them for Drupal.
---

{{% guides/config-desc name="Drupal" %}}

{{% guides/config-app template="drupal10" /%}}

{{% guides/config-service name="Drupal" %}}

We recommend the latest [MariaDB](../../../add-services/mysql/_index.md) version for Drupal,
although you can also use Oracle MySQL or [PostgreSQL](../../../add-services/postgresql.md).
For Drupal caching, we strongly recommend [Redis](../../../add-services/redis.md).
Drupal's cache can be very aggressive,
and keeping that data out of the database helps with both performance and disk usage.
See an example of Redis for caching in our [Drupal template](https://github.com/platformsh-templates/drupal10).

{{% /guides/config-service %}}

```yaml {configFile="services"}
# The services of the project.
#
# Each service listed will be deployed
# to power your Platform.sh project.

db:
    type: mariadb:10.11
    disk: 2048

cache:
    type: redis:7.2
```

{{% guides/config-routes template="drupal10" name="Drupal" %}}

{{< guide-buttons previous="Back" next="Customize Drupal" >}}
