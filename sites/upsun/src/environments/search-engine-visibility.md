---
title: Set an environment's visibility to search engines
sidebarTitle: Set search engine visibility
description: Learn how to change.a given environment's visbility to search engines.
---

When you have preview environments,
you don't want search engines indexing them and diluting the SEO of your production site.

Search engine indexers are told to ignore all preview environments.
When you're ready to go live, give your production environment a [custom domain](../domains/steps/_index.md)
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

- Select the project where you want to change visibility.
- From the **Environment** menu, select your production environment.
- Click {{< icon settings >}} **Settings**.
- In the row with **Hide from search engines**, click **Edit {{< icon chevron >}}**.
- Select or clear the **Hide from search engines** checkbox.

{{< /codetabs >}}

{{% vendor/name %}} can't guarantee that indexers follow the instructions.
If you're concerned about access, set up [HTTP access control](./http-access-control.md).

## How it's done

When the **Hide from search engines** is activated,
search engines are turned away from environments by including a `X-Robots-Tag` header:

```txt
X-Robots-Tag: noindex, nofollow
```

That tells search engine indexers to not index these sites and not traverse links from these sites.
This helps keep non-Production sites out of search engine indexes.

It's automatically on for all `{{% vendor/cli %}}.site` domains, and it's automatically off for production environments with a custom domain.

## Alternative method

You can also send instructions to search engine indexers using a `robots.txt` file.
Your app can serve this as a static file from its disk or as a dynamic response from its `passthru`.
Control either with the [`location` section of your app configuration](/create-apps/app-reference/single-runtime-image.md#locations).

If your `robots.txt` file includes instructions to ignore a page,
search engine indexers may ignore it even if you have configured {{% vendor/name %}} to not send the header.
