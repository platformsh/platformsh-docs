---
title: Manage search indexing for an environment
sidebarTitle: Manage search indexing
description: Protect SEO health by managing an environment's visibility to search engines.
---

Exposing multiple environments in the same project to search engines can harm your
production site's SEO rankings, for example, through duplicate content, broken links, or unpolished pages.

By default, {{% vendor/name %}} hides **all** environments that do not have a custom domain assigned.

After you assign a [custom domain](../domains/steps/_index.md) to an environment (preview or production), you can
then choose to reveal the environment to search engines.

{{< note >}}

If you have multiple environments with custom domains, make only one visible to search engines.

{{< /note >}}

To change an environment's visibility to search engines:

{{< codetabs >}}
+++
title=In the Console
+++

1. Select the project you want to update.
1. From the **Environment** menu, select the environment whose visibility you want to change.
1. Click {{< icon settings >}} **Settings**.
1. Select or clear the **Hide from search engines** checkbox.

<--->
+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} environment:info --environment {{< variable "ENVIRONMENT_NAME" >}} restrict_robots false
```

{{< /codetabs >}}

{{< note >}}

{{% vendor/name %}} can't guarantee that indexers follow the instructions.
If you're concerned about access, set up [HTTP access control](/environments/http-access-control.md).

{{< /note >}}

## How it works

When **Hide from search engines** is enabled, {{% vendor/name %}} adds the following header
to responses, which instructs search engines to not index and to not traverse your site:

```txt
X-Robots-Tag: noindex, nofollow
```

By default, this setting is enabled for all `{{% vendor/cli %}}.site` domains, and is disabled for any environment with a custom domain.

## Alternative method: Use a robots.txt file

You can also instruct search engine indexers by using a `robots.txt` file.
Your app can serve this as a static file from its disk or as a dynamic response from its `passthru`.
Control either with the [`location` section of your app configuration](/create-apps/image-properties/web.md#locations).

If your `robots.txt` file instructs search engines to ignore a page, that instruction takes effect regardless of whether {{% vendor/name %}} is configured to send the `X-Robots-Tag` header.
