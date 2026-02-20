---
title: Manage search indexing for an environment
sidebarTitle: Manage search indexing
description: Learn how to set up search indexing so only your live production site appears in search results.
---

When you have preview environments,
you don't want search engines indexing them and diluting the SEO of your production site.

Search engine indexers are told to ignore all preview environments.
When you're ready to go live, give your production environment a [custom domain](/domains/steps/_index.md)
and then set it to be visible to search engines.

To change your production environment's visibility to search engines, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

To not restrict indexers on your production environment, run the following command:

```bash
{{% vendor/cli %}} environment:info --environment {{< variable "PRODUCTION_ENVIRONMENT_NAME" >}} restrict_robots false
```

<--->
+++
title=In the Console
+++

1. Select a project.
1. From the **Environment** menu, select the production environment.
1. Click {{< icon settings >}} **Settings** near the upper right of the page.
1. On the **General** tab, select or clear the **Hide from search engines** checkbox.

{{< /codetabs >}}

{{% vendor/name %}} can't guarantee that indexers follow the instructions.
If you're concerned about access, set up [HTTP access control](/environments/http-access-control.md).

## How it's done

When the **Hide from search engines** is enabled, 
search engines are turned away from environments by including a `X-Robots-Tag` header:

```txt
X-Robots-Tag: noindex, nofollow
```

This header instructs search engine indexers to not index these sites and not traverse links from these sites, keeping non-production sites out of search engine indexes.

By default, this setting is enabled for all `{{% vendor/cli %}}.site` domains, and is disabled for production environments with a custom domain.

## Alternative method

You can also instruct search engine indexers by using a `robots.txt` file.
Your app can serve this as a static file from its disk or as a dynamic response from its `passthru`.
Control either with the [`location` section of your app configuration](/create-apps/image-properties/web.md#locations).

If your `robots.txt` file includes instructions to ignore a page,
search engine indexers may ignore it even if you have configured {{% vendor/name %}} to not send the header.
