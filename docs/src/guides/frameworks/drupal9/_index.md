---
title: "How to Deploy Drupal 9 on Platform.sh"
weight: -110
sidebarTitle: Drupal 9
layout: single
description: |
  One-stop-shop for running Drupal on Platform.sh.
---

## Introduction

Drupal is a flexible and extensible PHP-based CMS framework. To deploy Drupal 9 on Platform.sh, the recommended way is to use Composer, the PHP package management suite. 

In this guide, it is assumed that you are using the well-supported Composer flavor of Drupal 9. Going through the steps below you will have two options:

1. You already have a [Composer flavored Drupal 9](https://github.com/drupal/recommended-project/tree/9.0.x) site your are trying to deploy. In this case, you will able to go through each step to make the recommended changes to your repository to prepare it for Platform.sh.  
2. You have no code at this point. In this case, Platform.sh maintains a ready-made [Drupal 9 template](https://github.com/platformsh-templates/drupal9) that you will be able to deploy very quickly. The steps below will then hopefully help to clarify why the modifications have been made to a base Drupal 9 project. 

Lorem ipsum.

### Sign up for Platform.sh

{{< guides/signup name="Drupal 9" template="drupal9" >}}

### Tools

{{< guides/tools >}}

## Steps

{{< guides/config-desc name="Drupal 9" >}}

### Requests configuration: `routes.yaml`

The `routes.yaml` file controls the [routing](/configuration/routes/_index.md) and caching of all HTTP requests sent to your application cluster.  Typically you will just route all incoming requests to your one application container, where your site lives, but many more elaborate configurations are possible.

The two most important parts to configure are the main route itself and its caching rules.  A route can have a placeholder of `{default}`, which will be replaced with a branch-specific generated domain name or, in production, with your configured domain name.

The route then has an `upstream`, which is the name of the container that it should forward requests to.  99% of the time you want the `name` property in the `.platform.app.yaml` file.

You can (and should) enable the [HTTP cache](/configuration/routes/cache.md).  The router includes a basic HTTP cache that will obey the HTTP cache headers produced by your application.  However, by default HTTP caches will include all cookies in the cache key, which if you have any cookies at all makes the site uncacheable.  Instead, the `cookies` key allows you to select which cookies should matter for the cache; generally that will be just the user session cookie, which for Drupal is included below.  However, depending on what additional modules you have installed there may be other cookies you need to add.

Finally, routes can also be [HTTP redirects](/configuration/routes/redirects.md), either fully or partially.  In this example, all `www.{default}` requests will be redirected to the equivalent non-www URL.  You could also configure it the other way around if desired.  More complex redirects are also possible.

Don't worry about unencrypted HTTP routes.  All requests on Platform.sh are TLS-enabled, and we automatically redirect HTTP requests to HTTPS.

{{< readFile file="static/files/fetch/routesyaml/drupal9" highlight="yaml" >}}

### Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run.  You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

We recommend the latest [MariaDB](/configuration/services/mysql.md) version for Drupal, although you can also use Oracle MySQL or [PostgreSQL](/configuration/services/postgresql.md) if you prefer.  We also strongly recommend using [Redis](/configuration/services/redis.md) for Drupal caching.  Drupal's cache can be very aggressive, and keeping that data out of the database helps with both performance and disk usage.  Our Drupal template comes [pre-configured to use Redis]() for caching.

You can add [other services](/configuration/services/_index.md) if desired, such as [Solr]() or [Elasticsearch]().  You will need to configure Drupal to use those services as well once the service is enabled.

Each service entry has a name (`db` and `cache` in the example below), as well as a `type` that specifies the service and version to use.  Note that not all services support clean version upgrades, and none support downgrades.  If you want to try upgrading a service, confirm on its service page that it's supported and test on a branch before pushing to your `master` branch.

If a service stores persistent data then it will also have a `disk` key, which specifies the amount of storage to give it, in MB.

{{< readFile file="static/files/fetch/servicesyaml/drupal9" highlight="yaml" >}}

### Application container: `.platform.app.yaml`

The `.platform.app.yaml` file is the heart of your application.  It has an [extensive set of options](/configuration/app/_index.md) that allow you to configure nearly any aspect of your application.  Most of it is explained with comments inline.

You can and likely will evolve this file over time as you build out your site.

{{< readFile file="static/files/fetch/appyaml/drupal9" highlight="yaml" >}}

### Application configuration

Replicate steps from `template-builder` applied to the upstream and show in [README.md#customizations](https://github.com/platformsh-templates/drupal9/blob/master/README.md#customizations).

### Deployment

Final steps to deploy (own code case).

**This has me thinking. Is it more realistic to assume that the OWN CODE case should really be 1) You already have it on GitHub, 2) set up the integration and do it on a branch?**

### Post-install

If relevant.

## Next steps

### Updating Drupal core

Framework-specific recommendations with quick explanations, that don't justify full guides of their own.

### Adding modules and themes

Framework-specific recommendations with quick explanations, that don't justify full guides of their own.

### Other resources

List the other guides in this subdirectory.

List Framework-specific references, community links, etc.