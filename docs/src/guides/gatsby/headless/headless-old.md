---
title: "Using a backend CMS with Gatsby by deploying multi-app projects on Platform.sh"
sidebarTitle: "Headless CMS Old"
description: |
    You can use Platform.sh's multi-app configuration to deploy Gatsby alongside a backend CMS, pulling content into Gatsby during builds.
weight: -100
---

## Background

An increasingly common pattern is to decouple content resources from a frontend Gatsby site. Decoupled sites leverage Gatsby's source plugin ecosystem to pull external content resources into builds, which are typically located on a server elsewhere. 

Alternatively, Platform.sh supports [multi-app configuration](/configuration/app/multi-app.md) on projects - that is, including code for two separate sites that are deployed on their own containers within a single project cluster. Within a single repository, Gatsby would reside in a subdirectory alongside another directory that contains the code for the resource.

There are a few important points you will need to keep in mind when deploying this pattern on Platform.sh relevant to each of the backend examples below:

1. **Relationships:** 

    Communicating between application containers is made possible with a [`relationship`](/configuration/app/relationships.md) definition in Gatsby's `.platform.app.yaml` file. Deploying Gatsby and a backend application alone is not enough to enable communication between them. 

2. **Memory and plan size:** 

    Even after following the steps below, you may find that Gatsby fails to bundle assets during its build. This is a factor of both the size and number of Gatsby's dependencies on the frontend, as well as the amount of data being pulled from the backend. For this reason, it's recommended to have at least a Medium plan for your multi-app projects. Fully replicating the production relationship between the two application containers on development environments will require you to upsize the "Environments application size" to match production there as well. 

3. **Container availability:** 

    In the [Gatsby deployment guide](/guides/gatsby/deploy/_index.md) builds occur during the build hook while you still have write access to the container. Communicating with another container in your cluster, whether that is a backend Drupal site or an Elasticsearch service, is not possible until the deploy hook when the filesystem is read-only. You will see in the examples below that Gatsby's build has been postponed to a later stage in the build-deploy pipeline and that mounts have been defined to accommodate. 

Platform.sh maintains a number of [multi-application templates](https://github.com/platformsh-templates/?q=gatsby&type=&language=) for Gatsby, that generally have very similar configuration changes on the Gatsby side. Below are a few of those examples for different backend content management systems.

## How to deploy Gatsby with Drupal

Drupal is a flexible and extensible PHP-based CMS framework that can be set up to serve data and images to Gatsby via the [JSON API module](https://www.drupal.org/project/jsonapi) and the [`gatsby-source-drupal`](https://www.gatsbyjs.com/plugins/gatsby-source-drupal/) source plugin. 

The resulting repository will have the following structure:

```bash
.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── drupal
│   ├── <application code>
│   └── .platform.app.yaml
├── gatsby
│   ├── <application code>
│   └── .platform.app.yaml
├── CHANGELOG.md
├── LICENSE.md
└── README.md
```

If you do not already have a Gatsby and/or Drupal codebase that you plan to deploy to Platform.sh, you have two options. You can quickly deploy the [Gatsby with Drupal template](https://github.com/platformsh-templates/gatsby-drupal) by clicking the button below, and then clone the repository locally and follow the steps covered in this guide for better context of Platform.sh-specific changes. 

{{< dop-button template="gatsby-drupal" >}}

Alternatively, you can start a new project from scratch by cloning the component applications into a single repository..

```bash
$ mkdir gatsby-drupal && cd gatsby-drupal
# Get the individual applications
$ git clone git@github.com:platformsh-templates/drupal8.git drupal
$ git clone git@github.com:platformsh-templates/gatsby.git gatsby
# Reset the new repository
$ rm -rf drupal/.git && rm -rf gatsby/.git && git init
# Remove the individual applications' .platform directories
$ rm -rf drupal/.platform && rm -rf gatsby/.platform
# Create some initial empty Platform.sh configuration files.
$ mkdir -p .platform && touch .platform/routes.yaml && touch .platform/services.yaml
```

## How to deploy Gatsby with Wordpress

WordPress content is pulled into Gatsby using WordPress's API through the [`gatsby-source-drupal`](https://www.gatsbyjs.com/plugins/gatsby-source-wordpress/) source plugin. 

## How to deploy Gatsby with Strapi

Strapi content is pulled into Gatsby using Strapi's API through the [`gatsby-source-strapi`](https://www.gatsbyjs.com/plugins/gatsby-source-strapi/) source plugin. 