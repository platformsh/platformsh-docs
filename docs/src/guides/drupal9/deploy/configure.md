---
title: "Configure Drupal 9 for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Drupal.
---

{{< guides/config-desc name="Drupal 9" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="drupal9" name="Drupal 9" >}}

## Service configuration: `services.yaml`

{{% guides/config-service name=Drupal %}}

We recommend the latest [MariaDB](../../../add-services/mysql/_index.md) version for Drupal,
although you can also use Oracle MySQL or [PostgreSQL](../../../add-services/postgresql.md) if you prefer.
We also strongly recommend using [Redis](../../../add-services/redis.md) for Drupal caching.
Drupal's cache can be very aggressive,
and keeping that data out of the database helps with both performance and disk usage.
Our Drupal template comes [pre-configured to use Redis](https://github.com/platformsh-templates/drupal9#user-content-customizations) for caching.

{{% /guides/config-service %}}

{{< readFile file="static/files/fetch/servicesyaml/drupal9" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="drupal9" >}}{{< /guides/config-app >}}

{{< guide-buttons next="Customize Drupal9" >}}
