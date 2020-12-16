---
title: "Gatsby multi-app projects"
sidebarTitle: "Headless CMS"
description: |
    You can use Platform.sh's multi-app configuration to deploy Gatsby alongside a backend CMS, pulling content into Gatsby during builds.
weight: -100
toc: true
---

## Background

An increasingly common pattern is to decouple content resources from a frontend Gatsby site. Decoupled sites leverage Gatsby's source plugin ecosystem to pull external content resources into builds, which are typically located on a server elsewhere. 

Alternatively, Platform.sh supports [multi-app configuration](/configuration/app/multi-app.md) on projects - that is, including code for two separate sites that are deployed on their own containers within a single project cluster. Within a single repository, Gatsby would reside in a subdirectory alongside another directory that contains the code for the resource.

## Tools

{{< guides/tools >}}

## Signing up for Platform.sh

In each of the backend guides below, there will be a "Deploy on Platform.sh" button that will not only deploy the guide's project for you, but also sign you up for a trial account. If you are planning on simply deploying a template and following along with these guides for greater context, feel free to move onto the next section. 

If however you are planning on using the templates and guides to deploy your existing codebase to Platform.sh, you will first need to visit the [Platform.sh accounts](https://accounts.platform.sh/platform/trial/general/setup) page and fill out your information to set up your trial account. If you don't want to sign up initially with your e-mail address, you can sign up using an existing GitHub, Bitbucket, or Google account. If you choose one of these options, you will be able to set a password for your Platform.sh account later.

After creating an account, you will be prompted to create your first project. Since you'll be providing your own code, use the "Blank project" option. You will be able to give the project a title and choose a region closest to the visitors of your site. You also have the option to select more resources for your project. This is especially important with multi-application projects, so make sure to consult the [**Plan size**](#plan-size) note below for more details.

## Plan size

There are a few important points you will need to keep in mind when deploying this pattern on Platform.sh if you have already [deployed Gatsby by itself](/guides/gatsby/deploy/_index.md) on Platform.sh, which are relevant to each backend example. After following the steps below, you may find that Gatsby fails to bundle assets during its build on projects of the "Development" plan size. This is a factor of both the size and number of Gatsby's dependencies on the frontend, as well as the amount of data being pulled from the backend. 

Multi-application projects generally require more resources to run on Platform.sh, and so the trial's default `development` plan may not be enough to run your existing site. You are free to either proceed with a smaller plan with your code or increase the resources at this point for the project. Otherwise, it may be best to initially deploy the templates listed in each backend guide to start out, and later modify that project to include your own code with more resources as you get used to developing on Platform.sh.

{{< note >}}
In general, it's recommended to have at least a Medium plan for your multi-app projects. Note that this plan size affects the resources available on the production environment (Master), but not its development environments (which default to "Standard"). As you continue to work with Gatsby and a backend headless CMS, you may find that it is also necessary to upsize your development environments to match production (the "Environments application size" setting for your plan).
{{< /note >}}

## Headless backends

Platform.sh maintains a number of [multi-application templates](https://github.com/platformsh-templates/?q=gatsby&type=&language=) for Gatsby, that generally have very similar configuration changes on the Gatsby side. Below are a few of those written as short guides for different backend content management systems.
