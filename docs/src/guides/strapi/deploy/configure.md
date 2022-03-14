---
title: "Configure Strapi for Platform.sh"
sidebarTitle: "Configure"
weight: -100
toc: false
description: |
  Review the basics of what makes up a Platform.sh project, including its three principle configuration files and how to define them for Strapi.
---

{{< guides/config-desc name="Strapi" >}}

## Requests configuration: `routes.yaml`

{{< guides/config-routes template="gatsby" name="Strapi" >}}

## Service configuration: `services.yaml`

The `services.yaml` file lists the pre-packaged services you need for your application to run. You pick the major version of the service, and Platform.sh updates the patch version periodically so that you always get the newest version when you deploy.

Strapi requires a database to be able to deploy, by default it uses an SQLlite database but other database types are also supported.
These other database types are Oracle MySQL, PostgreSQL or MonogoDB(available only in strapi v3 and below). In the strapi template, a postgres database service is defined. So you can add the following to your `services.yaml` file:

```yaml
# The services of the project.

# Each service listed will be deployed
# to power your Platform.sh project.

dbpostgres:
  type: postgresql:12
  disk: 256
# Uncomment the line below if you would like to use a mysql database
# dbmysql:
#   type: oracle-mysql:8.0
#   disk: 256
```

Apart from databases, you can add other services if desired, such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md). You will need to configure Strapi to use those services as well once the service is enabled.

## Application container: `.platform.app.yaml`

{{< guides/config-app template="strapi" >}}

In the Strapi template, `yarn` is run during the build hook to install all of Strapi’s dependencies, and then `yarn build` is run to build the site. If you would rather use npm to manage your dependencies, you can:

- delete the `yarn` from the build hook
- Update the `yarn build` to `npm run build` in the build hook
- delete the `build.flavor` block which tells Platform.sh to rely solely on the build hook to define the build process for your project when set to none. By default, Node.js containers run npm install prior to the build hook, so this block can be removed entirely from the configuration.
- delete the `dependencies` block , which includes yarn.

A relationships block is also added which is responsible for defining any additional data sources (services) that the Strapi application needs.

Since Platform.sh is read-only during build, mainly for security purposes, certain folders need to be mounted. These folders are needed for Strapi to successfully build. Despite being read-only during build, Platfrom.sh allows you to mount important folders and files needed during build or deploy so that Strapi can write to them. In this case, the following files and folders are mounted for Strapi.

- `.cache` file
- `.tmp` file
- `database` folder
- `extensions` folder
- `uploads` folder in the public directory.

{{< /guides/config-app >}}

{{< guide-buttons next="Deploy Strapi" >}}
