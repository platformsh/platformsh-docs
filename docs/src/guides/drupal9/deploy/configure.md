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

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for Drupal, although you can also use Oracle MySQL or [PostgreSQL](/configuration/services/postgresql.md) if you prefer.  We also strongly recommend using [Redis](/configuration/services/redis.md) for Drupal caching.  Drupal's cache can be very aggressive, and keeping that data out of the database helps with both performance and disk usage. Our Drupal template comes [pre-configured to use Redis](https://github.com/platformsh-templates/drupal9#customizations) for caching.

You can add [other services](/configuration/services/_index.md) if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure Drupal to use those services as well once the service is enabled.

Each service entry has a name (`db` and `cache` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

{{< readFile file="static/files/fetch/servicesyaml/drupal9" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="drupal9" >}}

{{< guide-buttons next="Customize Drupal9" >}}
