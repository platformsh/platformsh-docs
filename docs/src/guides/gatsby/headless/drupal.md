---
title: "How to deploy Gatsby with Drupal (Decoupled Drupal) on Platform.sh"
sidebarTitle: "Drupal"
description: |
    Drupal's JSON API module can be used as a data source for Gatsby via `gatsby-source-drupal`.
---

Platform.sh maintains a [template](https://github.com/platformsh-templates/gatsby-drupal) that you can quickly deploy and then use this guide as a reference for the Platform.sh specific changes that have been made to Gatsby and Drupal to make it work. Click the button below to sign up for a free trial account and deploy the project.

{{< dop-button template="gatsby-drupal" >}}

## Project structure

In your local clone of the template, you will notice the following project structure:

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
└── README.md
```

## Shared Platform.sh configuration

When deploying a single application project to Platform.sh ([Gatsby, for example](/guides/gatsby/deploy/_index.md)), that repository needs to have three configuration files commmitted that describe its infrastructure, which are described below in detail. For [multi-app projects](/configuration/app/multi-app.md), however, two of those files remain in the project root and are shared with each application container. 

### `.platform/services.yaml`

This file describes which [service containers](/configuration/services/_index.md) should be included in your project (i.e. a MariaDB database). Looking at the directory tree above, you will see that for multi-app projects this file is shared between each application in the cluster. Gatsby does not require services by itself to deploy, but it is likely that the backend resource it will connect to does, and so you will see those service configurations for Drupal in the shared file below: 

{{< github repo="platformsh-templates/gatsby-drupal" file=".platform/services.yaml" lang="yaml" >}}

### `.platform/routes.yaml`

This [`routes.yaml`](/configuration/routes/_index.md) file defines how requests are handled by Platform.sh. In the file below, you will see that Gatsby will be served from the primary domain, whereas Drupal will be accessible from the `backend` subdomain.

{{< github repo="platformsh-templates/gatsby-drupal" file=".platform/routes.yaml" lang="yaml" >}}

## Drupal

There has only been a single modification Platform.sh's [standard Drupal template](https://github.com/platformsh-templates/drupal9) configuration in the multi-app template: the `name` attibribute in Drupal's `.platform.app.yaml` has been updated to `drupal`. You will notice this value used when the `relationship` between Gatsby and Drupal is defined [below for Gatsby](#gatsby). 

The only additional setup required to prepare the backend is to install a few additional modules that will configure the JSON API for consumption. In your Drupal directory, add the following dependencies.

```bash
$ composer require drupal/gatsby drupal/jsonapi_extras drupal/pathauto
```

The [Pathauto](https://www.drupal.org/project/pathauto) module will help you assign alias paths for each piece of content on your Drupal site that can then be replicated on the frontend Gatsby site. For example, the Drupal alias `/article/some-new-article` will be the same path you will find that article on Gatsby.

## Gatsby

The frontend Gatsby app on the other hand has a slightly different configuration from the basic [Gatsby deployment](/guides/gatsby/deploy/_index.md). Below is the `gatsby/.platform.app.yaml` file that configures the application. In particular, notice:

- `post_deploy`: 

    Platform.sh containers reside in separate build containers at build time, before their images are moved to the final application container at deploy time. These build containers are isolated, and therefore Gatsby does not have access to Drupal during the build hook, where you would normally run [`gatsby build`](https://github.com/platformsh-templates/gatsby/blob/master/.platform.app.yaml#L21). Drupal will not be available until after the deploy hook, and so Gatsby's build is postponed until the `post_deploy` hook below.

- `mounts`: 

    To the point above, there are additional consequences to postponing the Gatsby build, namely that you will only have write access to the container this late in the build-deploy pipeline. In order to allow Gatsby to write to `public`, that directory has been defined as a [mount](/configuration/app/storage.md).

- `web.commands.start`: 

    In the generic Gatsby template, the static files in `public` are served via the [`web.locations` block](https://github.com/platformsh-templates/gatsby/blob/c764ed717752eacc3c3f3322b7e5415e276d02df/.platform.app.yaml#L29), but that attribute is removed in the file below. Instead, two separate start commands are defined depending on which branch you are developing on. This has been included in order to support [Live Preview and Incremental Builds](https://www.drupal.org/project/gatsby). It is not required, but you can consult the [section below](#live-preview-and-incremental-builds) for more information about enabling it.

- `relationships`: 

    Access to another service or application container in the cluster is given through [`relationships`](/configuration/app/relationships.md), and in this case one has been defined to the backend Drupal container using it's `name`. 


{{< github repo="platformsh-templates/gatsby-drupal" file="gatsby/.platform.app.yaml" lang="yaml" >}}

You can then modify `gatsby-config.js` to read from the backend Drupal container through the `drupal` relationship defined above to configure the `baseUrl` attribute for `gatsby-source-drupal`. You will notice that this is made a little easier using Platform.sh's [Config Reader library for Node.js](https://github.com/platformsh/config-reader-nodejs), so be sure to install this to the Gatsby dependencies first when replicating. 

{{< github repo="platformsh-templates/gatsby-drupal" file="gatsby/gatsby-config.js" lang="js" >}}

Lastly, the Gatsby application itself needs to have updated GraphQL queries to handle the data coming from Drupal and turn it into frontend content pages. There are a number of [helpful](https://www.lullabot.com/articles/decoupled-drupal-getting-started-gatsby-and-jsonapi) [tutorials](https://www.youtube.com/playlist?list=PLlzlpMzp4eR3EORfm3lwJ_gV5egTa2caF) for setting this up, but the most important files in the template you can consult are:

- [`gatsby/gatsby-node.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/gatsby-node.js): which [dynamically creates](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/) individual pages from the data source.
- [`gatsby/src/pages/articles.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/src/pages/articles.js): which places a query for all Drupal articles to generate a list page at `/articles` on the Gatsby site. 
- [`gatsby/src/templates/article.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/src/templates/article.js): which places queries to individual articles, formatting their single content pages on the Gatsby site.

## Post-install

When you first deploy the template, the frontend Gatsby site will fail to deploy. Visit the `backend` subdomain of your site and finish Drupal's installation. Database credentials will already be provided for you, so you will not need to set them up manually. 

After you have completed the installation you will need to enable the JSON API and Gatsby related modules, and then set up aliases for your articles using Pathauto. See [the post-installation](https://github.com/platformsh-templates/gatsby-drupal#post-install) instructions on the template for the detailed instructions.

Once you have completed those steps, you can redeploy the project with the CLI command `platform redeploy` to view your Gatsby site, now pulling its content from a backend Drupal container on the same project. 

## Next steps

With Gatsby now deployed and pulling content from a backend Drupal application, there are a few things you may wish to change about your project going forward.

### `applications.yaml`

You can optionally combine the application configuration (`.platform.app.yaml`) for Gatsby and Drupal into a single configuration file called `applications.yaml`. Like `services.yaml` and `routes.yaml`, this file is shared across the project and resides in the `.platform` subdirectory. It does require that you explicitly define the source of each application, so [consult the documentation](/configuration/app/multi-app.md#applicationsyaml) for more information.

### Multiple content sources

Gatsby supports pulling multiple sources into its build. This can include external services like Stripe, or additional backend CMSs for different sets of content. Like shown here with Drupal, you can branch off your repository and add an additional subdirectory that contains the codebase for [another backend](/guides/gatsby/headless/_index.md#headless-backends), and then add the source plugin for that backend to `gatsby-config.js`. 

### Plan size

As mentioned previously, it's generally recommended to have at least a Medium plan for your multi-app projects. This size will give the project enough resources for all of your containers as well as the memory necessary to actually pull content from the Drupal container into Gatsby during its build. 

Keep in mind that increasing the plan size applies only to the production environment of your project, and not to its development environments (which default to "Standard"). As you continue to work with Gatsby and a backend headless CMS, you may find that it is also desirable to upsize your development environments to match production (the "Environments application size" setting for your plan).

### Live preview and incremental builds

If you replicate the `web.commands.start` block in Gatsby's `.platform.app.yaml` file above, you will be able to enable incremental builds on your projects. Once you save an update to a piece of Drupal content on a non-production branch, Drupal will place a request to a dedicated `/__refresh` endpoint on Gatsby (which is itself enabled by a [branch-dependent environment variable](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/.environment)). Since Gatsby is running a development server on this non-production environment, this call will cause Gatsby to retrieve content from Drupal once again, resulting in a near instantly updated article on the frontend. 

The process of enabling this feature is a little detailed, so it is best to consult the [template's README](https://github.com/platformsh-templates/gatsby-drupal#enabling-gatsby-live-preview-manual-configuration) for the most up-to-date instructions for how to do so.

