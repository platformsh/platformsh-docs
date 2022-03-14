---
title: "Strapi multi-app projects"
sidebarTitle: "Adding Frontends"
description: |
  You can use Platform.sh's multi-app configuration to deploy Strapi alongside a frontend application, pulling content from Strapi to the frontend during builds.
weight: -70
toc: true
---

## Background

A common pattern for Strapi applications is to decouple services from the main site, serving external data to a frontend at build time. Supported by Strapi's source plugin ecosystem, data from Strapi (or headless) content management systems can be served into a frontend application [Data Layer](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/), with that frontend typically located on a server elsewhere, and that data then used to fill out content on the frontend.

The decoupled pattern can work differently on Platform.sh due to support for [multi-app configuration](/configuration/app/multi-app.md) on your projects. Consider the following project structure:

```bash

├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── strapi
│   ├── <application code>
│   └── .platform.app.yaml
├── gatsby
│   ├── <application code>
│   └── .platform.app.yaml
└── README.md
```

Above is the repository structure for a Decoupled Strapi (Gatsby sourcing strapi content) project on Platform.sh. Here, Gatsby and Strapi reside in their own subdirectories within the same repository. They are deployed to the same project from separate application containers, and from this cluster Gatsby can read data from Drupal internally. Their commit histories are tied together, such that each new pull request environment can test changes to either the frontend or backend freely from the same place.

Drupal is just one example of a backend CMS that can be used with this pattern, and at the bottom of this page are a few additional guides for alternatives that work well on Platform.sh.

## Tools

{{% guides/tools %}}

## Signing up for Platform.sh

In each of the backend guides below, there will be a "Deploy on Platform.sh" button that will not only deploy the guide's project for you, but also sign you up for a trial account. If you are planning on simply deploying a template and following along with these guides for greater context, feel free to move onto the next section.

If however you are planning on using the templates and guides to deploy your existing codebase to Platform.sh,
you first need to [register for a trial Platform.sh account](https://auth.api.platform.sh/register).
If you don't want to sign up initially with your e-mail address,
you can sign up using an existing GitHub, Bitbucket, or Google account.
If you choose one of these options, you can set a password for your Platform.sh account later.

After creating an account, you will be prompted to create your first project. Since you'll be providing your own code, use the "Blank project" option. You will be able to give the project a title and choose a region closest to the visitors of your site. You also have the option to select more resources for your project. This is especially important with multi-application projects, so make sure to consult the [**Plan size**](#plan-size) note below for more details.

## Plan size

There are a few important points you will need to keep in mind when deploying this pattern if you have already [deployed Gatsby by itself](/guides/gatsby/deploy/_index.md) on Platform.sh, which are relevant to each backend example. After following the steps below, you may find that Gatsby fails to bundle assets during its build on projects of the "Development" plan size. This is a factor of both the size and number of Gatsby's dependencies on the frontend, as well as the amount of data being pulled from the backend.

Multi-application projects generally require more resources to run on Platform.sh, and so the trial's default `development` plan may not be enough to run your existing site. You are free to either proceed with a smaller plan to test or increase the resources at this point for the project. Otherwise, it may be best to initially deploy the templates listed in each backend guide to start out, and later modify that project to include your own code with more resources as you get used to developing on Platform.sh.

## Frontends for Strapi

Platform.sh maintains a number of [multi-application templates](https://github.com/platformsh-templates/?q=strapi&type=&language=) for Strapi, that generally have very similar configuration changes on the Strapi side. Below are a few of those written as short guides for different backend content management systems.
