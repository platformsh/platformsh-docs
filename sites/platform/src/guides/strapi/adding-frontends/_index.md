---
title: "Strapi multi-app projects"
sidebarTitle: "Adding frontends"
description: |
  You can use a multi-app configuration to deploy Strapi alongside a frontend application, pulling content from Strapi into the frontend during builds.
weight: -70
---

## Background

A common pattern for Strapi applications is to serve as a backend or headless CMS for a frontend application.
This helps with serving external data to a frontend at build time.
Supported by Strapi's plugin ecosystem, data from Strapi (or headless) CMS can be served into a frontend application,
with that frontend typically located on a server elsewhere.

{{% vendor/name %}} provides a platform for this architectural pattern through a [multi-app configuration](../../../create-apps/multi-app/_index.md).

Consider the following project structure:

```bash

├── {{< vendor/configdir >}}
│   ├── {{< vendor/configfile "routes" "strip" >}}
│   └── {{< vendor/configfile "services" "strip" >}}
├── strapi
│   ├── <application code>
│   └── {{< vendor/configfile "app" >}}
├── gatsby
│   ├── <application code>
│   └── {{< vendor/configfile "app" >}}
└── README.md
```

Above is the repository structure for a decoupled Strapi project (Gatsby sourcing content from Strapi).
Strapi and Gatsby reside in their own subdirectories within the same repository.
They're deployed to the same project from separate application containers,
and from this cluster Gatsby can read data from Strapi internally.
Their commit histories are tied together,
so each new pull request environment can test changes to either the frontend or backend from the same place.

Gatsby is just one example of a frontend that can be used with this pattern.

{{% guides/requirements %}}

## Signing up

Each of the frontend guides below has a **Deploy on {{% vendor/name %}}** button that deploys the guide's project for you
and also signs you up for a trial account.
If you're planning on deploying a template and following along with these guides for greater context,
feel free to move onto the next section.

If you're planning on using the templates and guides to deploy your existing codebase to {{% vendor/name %}},
you first need to [register for a trial {{% vendor/name %}} account](https://auth.api.platform.sh/register).
If you don't want to sign up initially with your e-mail address,
you can sign up using an existing GitHub, Bitbucket, or Google account.
If you choose one of these options, you can set a password for your {{% vendor/name %}} account later.

After creating an account, you're prompted to create your first project.
Since you are providing your own code, use the **Blank project** option.
Give the project a title and choose a region closest to your site visitors.
You can also select more resources for your project.
This is especially important with multi-application projects, so for more details see [plan size](#plan-size).

## Plan size

There are a few important points to keep in mind when deploying this pattern if you've already [deployed Gatsby by itself](../../gatsby/deploy/_index.md) on {{% vendor/name %}}, which are relevant to each backend example.
After following the steps below,
you may find that Gatsby fails to bundle assets during its build if your plan size is Development.
This is a factor of both the size and number of Gatsby's dependencies on the frontend,
as well as the amount of data being pulled from the backend.

Multi-application projects generally require more resources to run on {{% vendor/name %}}, and so the trial's default Development plan may not be enough to run your existing site.
You are free to either proceed with a smaller plan to test or increase the resources at this point for the project.
Otherwise, it may be best to initially deploy the templates listed in each backend guide to start out
and later modify that project to include your own code with more resources as you get used to developing on {{% vendor/name %}}.

## Frontends for Strapi

{{% vendor/name %}} maintains a number of [multi-application templates](https://github.com/platformsh-templates/?q=strapi&type=&language=) for Strapi that generally have very similar configuration changes on the Strapi side.
Below are a few of those written as short guides for different frontends.
