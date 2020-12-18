---
title: "How to deploy Gatsby with Drupal (Decoupled Drupal) on Platform.sh"
sidebarTitle: "Drupal"
description: |
    Drupal's JSON API module can be used as a data source for Gatsby via `gatsby-source-drupal`.
---

{{< guides/gatsby/headless-intro template="gatsby-drupal" name="Drupal" >}}

## Shared Platform.sh configuration

{{< guides/gatsby/headless-project name="Drupal" >}}

### `.platform/services.yaml`

{{< guides/gatsby/headless-services template="gatsby-drupal" name="Drupal" >}}

### `.platform/routes.yaml`

{{< guides/gatsby/headless-routes template="gatsby-drupal" name="Drupal" >}}

## Drupal

There has only been a single modification Platform.sh's [standard Drupal template](https://github.com/platformsh-templates/drupal9) configuration in the multi-app template: the `name` attibribute in Drupal's `.platform.app.yaml` has been updated to `drupal`. You will notice this value used when the `relationship` between Gatsby and Drupal is defined [below for Gatsby](#gatsby) and in the [routes](#platformroutesyaml) configuration above.

The only additional setup required to prepare the backend is to install a few additional modules that will configure the JSON API for consumption. In your Drupal directory, add the following dependencies.

```bash
$ composer require drupal/gatsby drupal/jsonapi_extras drupal/pathauto
```

The [Pathauto](https://www.drupal.org/project/pathauto) module will help you assign alias paths for each piece of content on your Drupal site that can then be replicated on the frontend Gatsby site. For example, the Drupal alias `/article/some-new-article` will be the same path you will find that article at on Gatsby.

## Gatsby

The frontend Gatsby app on the other hand has a slightly different configuration from the basic [Gatsby deployment](/guides/gatsby/deploy/_index.md). Below is the `gatsby/.platform.app.yaml` file that configures the application. 

{{< github repo="platformsh-templates/gatsby-drupal" file="gatsby/.platform.app.yaml" lang="yaml" >}}

In particular, notice:

- `relationships`

    Access to another service or application container in the cluster is given through [`relationships`](/configuration/app/relationships.md), and in this case one has been defined to the backend Drupal container using it's `name`. 

- `post_deploy`

    Platform.sh containers reside in separate build containers at build time, before their images are moved to the final application container at deploy time. These build containers are isolated, and therefore Gatsby does not have access to Drupal during the build hook, where you would normally run [`gatsby build`](https://github.com/platformsh-templates/gatsby/blob/master/.platform.app.yaml#L21). Drupal will not be available until after the deploy hook, and so Gatsby's build is postponed until the `post_deploy` hook below.

- `mounts`

    To the point above, there are additional consequences to postponing the Gatsby build, namely that you will only have write access to the container this late in the build-deploy pipeline. In order to allow Gatsby to write to `public`, that directory has been defined as a [mount](/configuration/app/storage.md).


---

Additionally, there has been a change to Gatsby's start command,`web.commands.start`. In the generic Gatsby template, the static files in `public` are served via the [`web.locations` block](https://github.com/platformsh-templates/gatsby/blob/c764ed717752eacc3c3f3322b7e5415e276d02df/.platform.app.yaml#L29), but that attribute is removed in the file below. Instead, two separate start commands are defined depending on which branch you are developing on. This has been included in order to support [Live Preview and Incremental Builds](https://www.drupal.org/project/gatsby). It is not required, but you can consult the [section below](#live-preview-and-incremental-builds) for more information about enabling it.

You can then modify [`gatsby-config.js`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) to read from the backend Drupal container through the `drupal` relationship defined above to configure the `baseUrl` attribute for `gatsby-source-drupal`. 

--- inner

You will notice that this is made easier by using Platform.sh's [Config Reader library for Node.js](https://github.com/platformsh/config-reader-nodejs), so be sure to install this to the Gatsby dependencies first when replicating. When used, Gatsby pulls the information to communicate with the Drupal container *on the current branch*.

{{< github repo="platformsh-templates/gatsby-drupal" file="gatsby/gatsby-config.js" lang="js" >}}

Lastly, the Gatsby application itself needs to have updated [GraphQL](https://www.gatsbyjs.com/docs/reference/graphql-data-layer/) queries to handle the data coming from Drupal and turn it into frontend content pages. The most important files in the template you can consult are:


--- after

- [`gatsby/gatsby-node.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/gatsby-node.js): which [dynamically creates](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/) individual pages from the data source.
- [`gatsby/src/pages/articles.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/src/pages/articles.js): which places a query for all Drupal articles to generate a list page at of all of your articles at `/articles` on the Gatsby site. 
- [`gatsby/src/templates/article.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/src/templates/article.js): which places queries to individual articles, formatting their single content pages on the Gatsby site.

## Deploy and post-install

{{< guides/gatsby/headless-postinstall name="Drupal">}}

After you have completed the installation you will need to enable the JSON API and Gatsby related modules, and then set up aliases for your articles using Pathauto. See [the post-installation](https://github.com/platformsh-templates/gatsby-drupal#post-install) instructions on the template for the detailed instructions.

{{< /guides/gatsby/headless-postinstall >}}

## Next steps

With Gatsby now deployed and pulling content from a backend Drupal application, there are a few things you may wish to change about your project going forward.

### `applications.yaml`

{{< guides/gatsby/headless-applicationsyaml name="Drupal" >}}

### Multiple content sources

{{< guides/gatsby/headless-multiplesources name="Drupal" >}}

### Plan size

{{< guides/gatsby/headless-plansize >}}

### Live preview and incremental builds

If you replicate the `web.commands.start` block in Gatsby's `.platform.app.yaml` file above, you will be able to enable incremental builds on your projects. Once you save an update to a piece of Drupal content on a non-production branch, Drupal will place a request to a dedicated `/__refresh` endpoint on Gatsby (which is itself enabled by a [branch-dependent environment variable](https://github.com/platformsh-templates/gatsby-drupal/blob/master/gatsby/.environment)). Since Gatsby is running a development server on this non-production environment, this call will cause Gatsby to retrieve content from Drupal once again, resulting in a near instantly updated article on the frontend. 

The process of enabling this feature is a little detailed, so it is best to consult the [template's README](https://github.com/platformsh-templates/gatsby-drupal#enabling-gatsby-live-preview-manual-configuration) for the most up-to-date instructions for how to do so.

