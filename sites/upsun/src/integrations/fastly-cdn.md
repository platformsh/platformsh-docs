---
title: "Fastly CDN"
weight: -1
description: |
 This integration provides a web interface to manage your Fastly CDN service without having to create individual {{% vendor/name %}} support tickets.
---

{{% description %}}

- [Click to install directly in the Upsun console](https://console.upsun.com/-/add-plugin?manifest=https%253A%252F%252Ffastsun.plugins.pltfrm.sh%252Fmanifest.json)
- Plugin manifest URL:
https://fastsun.plugins.pltfrm.sh/manifest.json


The Fastly CDN plugin enables you to:
- Manage cache: purge a specific URL or all URLs
- Manage access control lists (ACLs): add, edit, delete
<!-- - View bandwith analysis on the top 10 URLs in your allowlist -->
- View real-time statistics, performance metrics
- View historical statistics and performance metrics
- View all domains attached to the Fastly service
- View current Varnish Configuration Language (VCL) version and version history
- View service activity and recent events history


## Using the Fastly CDN plugin
1. In the Upsun [console](https://console.upsun.com), navigate to the project and environment whose metrics you want to view.

      **Note:** To view summarized monthly _project-level_ traffic, including CDN bandwidth and CDN requests, see the **Traffic this month** section of a project page (make sure no environment is selected).


1. On the **Fastly CDN** tab, enter your Fastly credentials (Service ID and API token).

    - If you have a Fastly subscription, you can retrieve your credentials directly from the Fastly interface.

    - If you purchased your Fastly service through Upsun, you can retrieve your credentials in these ways:
      - Run a query such as `upsun ssh "printenv | grep FASTLY"` against the [Upsun project environment variables](https://docs.upsun.com/development/variables/set-variables.html#create-environment-specific-variables). 
      - [Open a support ticket](https://console.upsun.com/-/users/~/tickets/open).

    Your Fastly credentials are stored securely within your browser and are never transmitted to Upsun.

After you log in, you can find the following information for the selected environment:
- A real-time metrics tab
- A historical metrics tab, where you can:
  - View metrics by weeks, months, and years by using the date picker.
  - Enable/disable chart metrics by clicking them. Disabled metrics are not shown on the graph.
  - View average, min, and max values for different metrics (when available, these are shown below the historical chart).<BR>

    Both the chart and the table presentation are based on the range you select in the date picker.

The image below shows a sample historical metrics tab for a selected environment:
![Image showing the Fastly CDN historical metrics tab in the Upsun console](/images/integrations/console-fastly.png "0.75")
