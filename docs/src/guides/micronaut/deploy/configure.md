---
title: "Configure Micronaut for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
    Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Micronaut.
---

{{< guides/config-desc name="Micronaut" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="micronaut" name="Micronaut" >}}

## Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

Deploying Micronaut does not in itself require you to configure a database or another service, but in all likelihood you will want to add one at some point. Below is the example configuration for adding a MariaDB (named `db`) and Redis (named `cache`) container to your cluster. 

{{< readFile file="static/files/fetch/servicesyaml/drupal9" highlight="yaml" >}}

You can add [other services](/configuration/services/_index.md) if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure Micronaut to use those services as well once the service is enabled.

Each service entry has a name (`db` and `cache` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

## Application container: `.platform.app.yaml`

{{< guides/config-app template="micronaut" >}}
Explaining the file line by line, notice the following settings:

1. `name`: The application name
2. `type` where you'll define the language, in this case, Java, and the version.
3. `disk`: the disk space that the application needs in megabytes.
4. `hooks.build`: the command to package the application
5. `web.commands`: The order to start the application, where the port is overwritten using the `PORT` environment variable provided by Platform.sh to the application container.

{{< /guides/config-app >}}

{{< guide-buttons next="Customize Micronaut" >}}
