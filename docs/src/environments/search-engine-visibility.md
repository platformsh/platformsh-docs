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

To change the environment's visibility to search engines, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project where you want to change visibility.</li>
  <li>From the <strong>Environment</strong> menu, select the environment you want to change.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>In the row with <strong>Hide from search engines</strong>, click <strong>Edit {{< icon chevron >}}</strong>.</li>
  <li>Select or clear the <strong>Hide from search engines</strong> checkbox.</li>
</ol>

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform environment:info -e <ENVIRONMENT_NAME> restrict_robots true
```

{{< /codetabs >}}

## How it's done

Search engines are turned away from environments by including a `X-Robots-Tag` header:

```txt
X-Robots-Tag: noindex, nofollow
```

That tells search engine indexers to not index these sites and not traverse links from these sites.
This helps keeps non-Production sites out of search engine indexes.

## Override it

You can also send instructions to search engine indexers using a `robots.txt` file.
Your app can serve this as a static file from its disk or as a dynamic response from its `passthru`.
Control either with the [`location` section of your app configuration](../create-apps/app-reference.md#locations).

If your `robots.txt` file includes instructions to ignore a page,
search engine indexers may ignore it even if you have configured Platform.sh to not send the header.
