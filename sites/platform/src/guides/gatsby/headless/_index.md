---
title: "Gatsby multi-app projects"
sidebarTitle: "Headless CMS"
description: |
    You can use {{% vendor/name %}}'s multi-app configuration to deploy Gatsby alongside a backend CMS, pulling content into Gatsby during builds.
weight: -100
toc: true
---

## Background

A common pattern for Gatsby sites is to decouple services from the main site, pulling in external data at build time. Supported by Gatsby's source plugin ecosystem, data from conventional (or headless) content management systems can be collected into a common [Data Layer](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/), with that CMS typically located on a server elsewhere, and that data then used to fill out content on the frontend.

The location of an external CMS is usually hard coded into Gatsby's configuration, so when you're developing your site every branch points to the same backend resource. Should the location of that resource change, you would need to commit the new URL to update the configuration.

The decoupled pattern can work differently on {{% vendor/name %}} due to support for [multi-app configuration](../../../create-apps/multi-app/_index.md) on your projects. Consider the following project structure:

```bash
.
├── .platform
│   ├── routes.yaml
│   └── services.yaml
├── drupal
│   ├── <application code>
│   └── {{< vendor/configfile "app" >}}
├── gatsby
│   ├── <application code>
│   └── {{< vendor/configfile "app" >}}
└── README.md
```

Above is the repository structure for a Decoupled Drupal (Gatsby sourcing Drupal content) project on {{% vendor/name %}}. Here, Gatsby and Drupal reside in their own subdirectories within the same repository. They are deployed to the same project from separate application containers, and from this cluster Gatsby can read data from Drupal internally. Their commit histories are tied together, such that each new pull request environment can test changes to either the frontend or backend freely from the same place.

Drupal is just one example of a backend CMS that can be used with this pattern, and at the bottom of this page are a few additional guides for alternatives that work well on {{% vendor/name %}}.

{{% guides/requirements %}}

## Signing up

In each of the backend guides below, there is a "Deploy on {{% vendor/name %}}" button that will not only deploy the guide's project for you, but also sign you up for a trial account. If you are planning on deploying a template and following along with these guides for greater context, feel free to move onto the next section.

If however you are planning on using the templates and guides to deploy your existing codebase to {{% vendor/name %}},
you first need to [register for a trial {{% vendor/name %}} account](https://auth.api.platform.sh/register).
If you don't want to sign up initially with your e-mail address,
you can sign up using an existing GitHub, Bitbucket, or Google account.
If you choose one of these options, you can set a password for your {{% vendor/name %}} account later.

After creating an account, you are prompted to create your first project. Since you're providing your own code, use the "Blank project" option. You can give the project a title and choose a region closest to the visitors of your site. You also have the option to select more resources for your project. This is especially important with multi-application projects, so make sure to consult the [**Plan size**](#plan-size) note below for more details.

## Plan size

There are a few important points you need to keep in mind when deploying this pattern if you have already [deployed Gatsby by itself](/guides/gatsby/deploy/_index.md) on {{% vendor/name %}}, which are relevant to each backend example. After following the steps below, you may find that Gatsby fails to bundle assets during its build on projects of the "Development" plan size. This is a factor of both the size and number of Gatsby's dependencies on the frontend, as well as the amount of data being pulled from the backend.

Multi-application projects generally require more resources to run on {{% vendor/name %}}, and so the trial's default `development` plan may not be enough to run your existing site. You are free to either proceed with a smaller plan to test or increase the resources at this point for the project. Otherwise, it may be best to initially deploy the templates listed in each backend guide to start out, and later modify that project to include your own code with more resources as you get used to developing on {{% vendor/name %}}.

## Headless backends

{{% vendor/name %}} maintains a number of [multi-application templates](https://github.com/platformsh-templates/?q=gatsby&type=&language=) for Gatsby, that generally have very similar configuration changes on the Gatsby side. Below are a few of those written as short guides for different backend content management systems.
