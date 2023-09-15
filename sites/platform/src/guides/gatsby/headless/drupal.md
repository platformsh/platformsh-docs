---
title: "How to deploy Gatsby with Drupal (Decoupled Drupal) on {{% vendor/name %}}"
sidebarTitle: "Drupal"
description: |
    Drupal's JSON API module can be used as a data source for Gatsby via `gatsby-source-drupal`.
---

{{< guides/gatsby/headless-intro template="gatsby-drupal" name="Drupal" >}}

## Shared configuration

{{% guides/gatsby/headless-project name="Drupal" %}}

### Service configuration

{{% guides/gatsby/headless-services template="gatsby-drupal" name="Drupal" %}}

### Routes configuration

{{% guides/gatsby/headless-routes template="gatsby-drupal" name="Drupal" %}}

## Drupal

{{% guides/gatsby/headless-backend name="Drupal" %}}

The only setup required to prepare the backend is to install a few additional modules that will configure the JSON API for consumption. In your Drupal directory, add the following dependencies.

```bash
composer require drupal/gatsby drupal/jsonapi_extras drupal/pathauto
```

The [Pathauto](https://www.drupal.org/project/pathauto) module helps you assign alias paths for each piece of content on your Drupal site that can then be replicated on the frontend Gatsby site. For example, the Drupal alias `/article/some-new-article` is the same path you find that article at on Gatsby.

## Gatsby

{{% guides/gatsby/headless-gatsby name="Drupal" template="gatsby-drupal" %}}

Additionally, there has been a change to Gatsby's start command,`web.commands.start`. In the generic Gatsby template, the static files in `public` are served via the [`web.locations` block](https://github.com/platformsh-templates/gatsby/blob/c764ed717752eacc3c3f3322b7e5415e276d02df/.platform.app.yaml#L29), but that attribute is removed in the file below. Instead, two separate start commands are defined depending on which branch you are developing on. This has been included to support [Live Preview and Incremental Builds](https://www.drupal.org/project/gatsby). It isn't required, but you can consult the [section below](#live-preview-and-incremental-builds) for more information about enabling it.

You can then modify [`gatsby-config.js`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) to read from the backend Drupal container through the `drupal` relationship defined above to configure the `baseUrl` attribute for `gatsby-source-drupal`. 

{{< /guides/gatsby/headless-gatsby >}}

- [`gatsby/gatsby-node.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/client/gatsby-node.js) 

    Dynamically creates individual pages from the data source using Gatsby's [Node API](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/). It retrieves all of Drupal's articles (see [post-install below](#deploy-and-post-install)) using the GraphQL query `allNodeArticle`. A page is created (`createPage`) with formatting described by the template file `article.js` below (`component`). A `path` is also defined for each article, in this case using an `alias` you will define within Drupal using the Pathauto module.

- [`gatsby/src/templates/article.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/client/src/templates/article.js)

    The template file that defines how a single Drupal article should be formatted on Gatsby, retrieving the data from that article using the `nodeArticle` GraphQL query.

- [`gatsby/src/pages/articles.js`](https://github.com/platformsh-templates/gatsby-drupal/blob/master/client/src/components/articlePreview.js)

    Generates previews of articles at `/articles` on the Gatsby site using the `allNodeArticle` GraphQL query.

## Deploy and post-install

{{< guides/gatsby/headless-postinstall name="Drupal">}}

After you have completed the installation, you need to enable the JSON API and Gatsby related modules
and then set up aliases for your articles using `pathauto`.
For detailed instructions, see the template's [post-installation instructions](https://github.com/platformsh-templates/gatsby-drupal#user-content-post-install).

{{< /guides/gatsby/headless-postinstall >}}

## Next steps

With Gatsby now deployed and pulling content from a backend Drupal application, there are a few things you may wish to change about your project going forward.

### Shared application configuration

{{% guides/gatsby/headless-applicationsyaml name="Drupal" %}}

### Multiple content sources

{{% guides/gatsby/headless-multiplesources name="Drupal" %}}

### Plan size

{{% guides/gatsby/headless-plansize name="Drupal" %}}

### Live preview and incremental builds

If you replicate the `web.commands.start` block in Gatsby's `{{< vendor/configfile "app" >}}` file above, you can enable incremental builds on your projects. Once you save an update to a piece of Drupal content on a preview branch, Drupal places a request to a dedicated `/__refresh` endpoint on Gatsby. Since Gatsby is running a development server on this non-production environment, this call causes Gatsby to retrieve content from Drupal once again, resulting in a near instantly updated article on the frontend.

To see how to enable this feature, consult the [template's README](https://github.com/platformsh-templates/gatsby-drupal#user-content-enabling-gatsby-live-preview-manual-configuration).
