---
title: "How to deploy Gatsby with WordPress on {{% vendor/name %}}"
sidebarTitle: "WordPress"
description: |
    WordPress's built-in content API can quickly become a content source for Gatsby with `gatsby-source-wordpress`.
---


{{< guides/gatsby/headless-intro template="gatsby-wordpress" name="WordPress" >}}

## Shared configuration

{{% guides/gatsby/headless-project name="WordPress" %}}

### Service configuration

{{% guides/gatsby/headless-services template="gatsby-wordpress" name="WordPress" %}}

### Routes configuration

{{% guides/gatsby/headless-routes template="gatsby-wordpress" name="WordPress" %}}

## WordPress

{{% guides/gatsby/headless-backend name="WordPress" %}}

## Gatsby

{{% guides/gatsby/headless-gatsby template="gatsby-wordpress" name="WordPress" %}}

You can then modify [`gatsby-config.js`](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/)
to read from the backend WordPress container through the `wordpress` relationship defined above
to configure the `baseUrl` attribute for `gatsby-source-wordpress`.
The plugin requires you to define the `protocol`,
which in this case is `http` because WordPress content is retrieved through an internal request to the backend container.
Also, you need to declare `hostingWPCOM: false` as you don't pull data from a WordPress site hosted at wordpress.com.

{{< /guides/gatsby/headless-gatsby >}}

- [`gatsby/gatsby-node.js`](https://github.com/platformsh-templates/gatsby-wordpress/blob/master/gatsby/gatsby-node.js) 

    Dynamically creates individual pages from the data source using Gatsby's [Node API](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/). It retrieves all of WordPress's posts using the GraphQL query `allWordpressPost`. A page is created (`createPage`) with an assigned `path` and formatting described by the `blog-post.js` template file below (`component`).

- [`gatsby/src/templates/blog-post.js`](https://github.com/platformsh-templates/gatsby-wordpress/blob/master/gatsby/src/templates/blog-post.js)

    The template file that defines how a single WordPress post should be formatted on Gatsby, retrieving the data from that post using the `allWordpressPost` GraphQL query and filtering for its `slug`.

- [`gatsby/src/pages/index.js`](https://github.com/platformsh-templates/gatsby-wordpress/blob/master/gatsby/src/pages/index.js)

    Retrieves all of WordPress's content to generate a list of posts on the homepage using the `allWordpressPost` GraphQL query. 

## Deploy and post-install

{{% guides/gatsby/headless-postinstall name="WordPress" %}}

WordPress comes with an initial "Hello world" article, and it isn't necessary to add any more content to the site.

{{< /guides/gatsby/headless-postinstall >}}

## Next steps

With Gatsby now deployed and pulling content from a backend WordPress application, there are a few things you may wish to change about your project going forward.

### Shared application configuration

{{% guides/gatsby/headless-applicationsyaml name="WordPress" %}}

### Multiple content sources

{{% guides/gatsby/headless-multiplesources name="WordPress" %}}

### Plan size

{{% guides/gatsby/headless-plansize name="WordPress" %}}
