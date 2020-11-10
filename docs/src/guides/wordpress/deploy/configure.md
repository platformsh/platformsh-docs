---
title: "Configure Wordpress for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Wordpress.
---

{{< guides/config-desc name="Wordpress" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="wordpress-composer" name="Wordpress" >}}

## Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for Wordpress, although you can also use Oracle MySQL or [PostgreSQL](/configuration/services/postgresql.md) if you prefer. You can add [other services](/configuration/services/_index.md) if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure Wordpress to use those services as well once the service is enabled.

Each service entry has a name (`db` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

{{< readFile file="static/files/fetch/servicesyaml/wordpress-composer" highlight="yaml" >}}

## Application container: `.platform.app.yaml`

{{< guides/config-app template="wordpress-composer" >}}

Notice that the build `flavor` is set to `composer`, which will automatically download WordPress core, as well as your plugins, themes, and dependencies during the build step as defined in your `composer.json` file. The two directories need write access directories that require write access at runtime (for caching and uploads) have corresponding [mounts](/configuration/app/storage.md#basic-mounts) defined for them at the bottom of the file, and MariaDB will be accessible to WordPress internally at `database.internal` thanks to the relationship definition `database`. The [WordPress CLI](https://packagist.org/packages/wp-cli/wp-cli) is added as a build dependency, but we will still need to add some additional dependencies in the next step so that it can be used by the application and via SSH. 

{{< note >}}
During the build hook above, you will see an `rsync` command that allows you to commit and use plugins that are not accessible via Composer. You will need to replicate some variation on this pattern (here, committing a subdirectory called `plugins`) for all plugins and themes that cannot be defined in a `composer.json` file. 
{{< /note >}}

{{< guide-buttons next="Customize Wordpress" >}}
