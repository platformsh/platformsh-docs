---
title: "Fastly CDN"
weight: -1
description: |
  Offers an integrated web interface to manage your Fastly CDN service yourself without having to create individual {{% vendor/name %}} support tickets.
---

{{% description %}}

- [Click to install directly in the console](https://console.upsun.com/-/add-plugin?manifest=https%253A%252F%252Ffastsun.plugins.pltfrm.sh%252Fmanifest.json)
- Plugin manifest URL: 
https://fastsun.plugins.pltfrm.sh/manifest.json 



The Fastly CDN plugin enables you to:
- Manage cache (purge all URLs or purge a specific URL)
- Manage ACLs (add, edit, delete)
- View real-time statistics and performance metrics
- View historical statistics and performance metrics
- View all domains attached to the Fastly service
- View current VCL version, and version history
- View service activity, and recent events history

## Using the Fastly CDN plugin
When accessing an {{% vendor/name %}} environment page, you should see a Fastly CDN tab.

Log in with your Fastly credentials: 
  - Service ID
  - API token

      If you have a Fastly subscription, you can get your credentials directly from the Fastly interface.

      If you purchased your Fastly service through Upsun, you can find your credentials in the Upsun project variables or you can get them by [opening a support ticket](https://console.upsun.com/-/users/~/tickets/open). 

    These credentials are stored only in your browser because the Fastly CDN web plugin is a single-page application.

After you log in, you can see a dashboard with the following information:
- A real-time metrics tab
- A historical metrics tab, where you can:
  - View metrics over weeks, months, and years by using the date picker
  - Enable/disable chart metrics by clicking on them. Disabled metrics appear as strikethrough and are not displayed on the graph.
  - View average, min, and max values for different metrics (when available, below the historical chart)
  
    Both the chart or the table presentation are based on the range you selected in the date picker.


To connect to another Fastly CDN service, you must log out (on the real-time metrics tab) and then enter different Fastly credentials.
