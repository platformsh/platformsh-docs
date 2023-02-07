---
title: Set an environment's visibility to search engines
sidebarTitle: Set search engine visibility
description: Learn how to change.a given environment's visbility to search engines.
toc: false
---

When you have development environments,
you don't want search engines indexing them and diluting the SEO of your production site.

Search engine indexers are told to ignore all development environments.
You can change the setting for Production environments that don't have a custom domain.
Platform.sh can't guarantee that indexers follow the instructions.
If you're concerned about access, set up [HTTP access control](./http-access-control.md).

You can change visibility to search engines for production environments with a [custom domain](../domains/steps/_index.md).
If you're using a CDN, make sure everything is configured for [TLS ownership verification](../domains/troubleshoot.md#ownership-verification).

To change your production environment's visibility to search engines, follow these steps:

{{< codetabs >}}

+++
title=In the Console
+++

- Select the project where you want to change visibility.
- From the **Environment** menu, select your production environment.
- Click {{< icon settings >}} **Settings**.
- In the row with **Hide from search engines**, click **Edit {{< icon chevron >}}**.
- Select or clear the **Hide from search engines** checkbox.

<--->
+++
title=Using the CLI
+++

Run the following command:

```bash
platform environment:info --environment {{< variable "PRODUCTION_ENVIRONMENT_NAME" >}} restrict_robots true
```

{{< /codetabs >}}

## How it's done

When the **Hide from search engines** is activated,
search engines are turned away from environments by including a `X-Robots-Tag` header:

```txt
X-Robots-Tag: noindex, nofollow
```

That tells search engine indexers to not index these sites and not traverse links from these sites.
This helps keep non-Production sites out of search engine indexes.

## Alternative method

You can also send instructions to search engine indexers using a `robots.txt` file.
Your app can serve this as a static file from its disk or as a dynamic response from its `passthru`.
Control either with the [`location` section of your app configuration](../create-apps/app-reference.md#locations).

If your `robots.txt` file includes instructions to ignore a page,
search engine indexers may ignore it even if you have configured Platform.sh to not send the header.
