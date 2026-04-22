---
title: Manage search indexing for an environment
sidebarTitle: Manage search indexing
description: Protect SEO health by managing an environment's visibility to search engines.
---

Exposing multiple environments in the same project to search engines can harm your
production site's SEO rankings, for example, through duplicate content, broken links, or unpolished pages.

Whether search engines can index an environment depends on its domain:

- **No custom domain**: Always hidden from search engines. This is enforced and can't be changed.
- **Preview environment with a custom domain**: Hidden by default. You can make it visible.
- **Production environment with a custom domain**: Visible by default. You can hide it.

{{< note >}}

If multiple environments have custom domains, ensure that **at most** one is visible to avoid duplicate content and SEO dilution.

{{< /note >}}

To change whether search engines can index an environment:

{{< codetabs >}}
+++
title=In the Console
+++

Prerequisite: The environment must have a [custom domain](/domains/steps/_index.md).

1. Select the project you want to update.
1. From the **Environment** menu, select the environment.
1. Click {{< icon settings >}} **Settings**.
1. Select or clear the **Hide from search engines** checkbox.

<--->
+++
title=Using the CLI
+++

Prerequisite: The environment must have a [custom domain](/domains/steps/_index.md).

Run the following command:

```bash
{{% vendor/cli %}} environment:info --environment {{< variable "ENVIRONMENT_NAME" >}} restrict_robots false
```

{{< /codetabs >}}

{{< note >}}

{{% vendor/name %}} can't guarantee that indexers follow the instructions.
To restrict access entirely, set up [HTTP access control](/environments/http-access-control.md).

{{< /note >}}

## How it works

When **Hide from search engines** is enabled, {{% vendor/name %}} adds the following header
to responses, which instructs search engines to not index and to not traverse your site:

```txt
X-Robots-Tag: noindex, nofollow
```

This setting can only be changed on environments with a custom domain.

## Alternative method: Use a robots.txt file

You can also instruct search engine indexers by using a `robots.txt` file.
Your app can serve this as a static file from its disk or as a dynamic response from its `passthru`.
Control either with the [`location` section of your app configuration](/create-apps/image-properties/web.md#locations).

If your `robots.txt` file instructs search engines to ignore a page, that instruction takes effect regardless of whether {{% vendor/name %}} is configured to send the `X-Robots-Tag` header.
