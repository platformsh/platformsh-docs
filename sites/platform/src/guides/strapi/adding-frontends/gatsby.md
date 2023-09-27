---
title: "How to deploy Strapi with a Gatsby frontend on {{% vendor/name %}}"
sidebarTitle: "Gatsby"
description: |
  You can build out an API from scratch with Strapi and then connect its data to a frontend Gatsby app with `gatsby-source-strapi`.
---

{{< guides/gatsby/headless-intro template="gatsby-strapi" name="Strapi" >}}

## Shared configuration

{{% guides/gatsby/headless-project name="Strapi" %}}

### Service configuration

{{% guides/gatsby/headless-services template="gatsby-strapi" name="Strapi" %}}

### Routes configuration

{{% guides/gatsby/headless-routes template="gatsby-strapi" name="Strapi" %}}

## Strapi

{{% guides/gatsby/headless-backend name="Strapi" %}}

The only additional setup required to prepare the backend is to install a package that enables GraphQL on Strapi.

In your Strapi directory, add the dependency:

```bash
yarn add strapi-plugin-graphql
```

## Gatsby

{{% guides/gatsby/headless-gatsby name="Strapi" template="gatsby-strapi" %}}

You can then modify [`gatsby-config.js`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) to read from the backend Strapi container through the `strapi` relationship defined above to configure the `apiURL` attribute for `gatsby-source-strapi`. Notice that the source plugin requires that you explicitly define the `contentTypes` you would like to retrieve from Strapi. At this point you have not built out the API, and the Content Types `article` and `category` are included to support the [post-install instructions](https://github.com/platformsh-templates/gatsby-strapi#user-content-post-install) outlined in the template's README. Adjust these values to fit your current API if your are planning on migrating an existing Strapi repository.

{{< /guides/gatsby/headless-gatsby >}}

- [`gatsby/gatsby-node.js`](https://github.com/platformsh-templates/gatsby-strapi/blob/master/gatsby/gatsby-node.js)

  Dynamically creates individual pages from the data source using Gatsby's [Node API](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/). It retrieves all of Strapi's articles and categories (see [post-install below](#deploy-and-post-install)) using the GraphQL queries `allStrapiArticle` and `allStrapiCategory` respectively. For each, a page is created (`createPage`) with an assigned `path` and formatting described by one of the template files below (`component`).

- [`gatsby/src/templates/article.js`](https://github.com/platformsh-templates/gatsby-strapi/blob/master/gatsby/src/templates/article.js)

  The template file that defines how a single Strapi article should be formatted on Gatsby, retrieving the data from that article using the `strapiArticle` GraphQL query.

- [`gatsby/src/templates/category.js`](https://github.com/platformsh-templates/gatsby-strapi/blob/master/gatsby/src/templates/category.js)

  The template file that defines how a list of articles that belong to a single Category are formatted by Gatsby. It uses the `Category` query, and then filters a specific category `id` on `allStrapiArticle`.

- [`gatsby/src/pages/index.js`](https://github.com/platformsh-templates/gatsby-strapi/blob/master/gatsby/src/pages/index.js)

  Retrieves all of Strapi's content to generate a list of articles on the homepage using the `allStrapiArticle` GraphQL query.

## Deploy and post-install

{{< guides/gatsby/headless-postinstall name="Strapi">}}

After you have deployed, you need to set up Strapi's Admin Panel and some initial content endpoints for the Gatsby frontend to consume. Create your admin user at the `backend` subdomain for Strapi. You can then follow the [template's post-install instructions](https://github.com/platformsh-templates/gatsby-strapi#user-content-post-install) to setup up some initial `Article` and `Category` content endpoints. The API you develop there is only accessible to admins by default, so be sure to adjust the permissions to public so Gatsby can access it.

{{< /guides/gatsby/headless-postinstall >}}

## Next steps

With Gatsby now deployed and pulling content from a backend Strapi application, there are a few things you may wish to change about your project going forward.

### Shared application configuration

{{% guides/gatsby/headless-applicationsyaml name="Strapi" %}}

### Multiple content sources

Gatsby supports pulling multiple sources into its build. This can include external services like Stripe, or additional backend CMSs for different sets of content. Like shown here with Strapi, you can branch off your repository and add an additional subdirectory that contains the codebase for another frontend.

### Plan size

{{% guides/gatsby/headless-plansize name="Strapi" %}}
