---
title: "Fastly CDN"
weight: -1
description: |
 The Fastly CDN integration provides a centralized interface within the Upsun Console to oversee your edge traffic, manage cache, edit access control lists (ACLs), and tune performance without switching platforms. You can also manage dynamic configuration by using Edge Dictionaries.
---

{{% description %}}

## Install the Fastly CDN plugin

1. Go to https://console.upsun.com/-/add-plugin and click **Add plugin**.
1. Enter the plugin manifest URL https://fastsun.plugins.pltfrm.sh/manifest.json and click **Create**.

  **Tip:** You can also [click here](https://console.upsun.com/-/add-plugin?manifest=https%253A%252F%252Ffastsun.plugins.pltfrm.sh%252Fmanifest.json) to install directly in the Upsun console. 

## Manage and monitor your CDN traffic

The Fastly CDN integration provides a centralized interface within the Upsun Console to oversee your edge traffic, manage cache, and tune performance without switching platforms.

### Access the Fastly dashboard
1. In the Upsun [console](https://console.upsun.com), navigate to the project and environment you want to monitor.

      **Note:** To view summarized monthly _project-level_ traffic, including CDN bandwidth and CDN requests, see the **Traffic this month** section of a project page (make sure no environment is selected).


1. On the **Fastly CDN** tab, log in with your Fastly credentials (Service ID and API token).

    - If you have a Fastly subscription, you can retrieve your credentials directly from the Fastly interface.

    - If you purchased Fastly through Upsun, you can retrieve your credentials by running `upsun ssh "printenv | grep FASTLY"` in your terminal, or by [opening a support ticket](https://console.upsun.com/-/users/~/tickets/open).

    Your Fastly credentials are stored securely within your browser and are never transmitted to Upsun.

### Track real-time and historical performance

The dashboard provides two levels of visibility into how your site is performing at the edge:

- **Real-time metrics:** Monitor current traffic spikes, request rates, and global delivery status as it happens.

- **Historical metrics:** Use the date picker to analyze trends over weeks or months. You can toggle specific metrics on the graph to isolate data like cache hit ratios, 4xx/5xx error rates, and total bandwidth.

The image below shows a sample historical metrics tab for a selected environment:
![Image showing the Fastly CDN historical metrics tab in the Upsun console](/images/integrations/console-fastly.png "0.75")

### Analyze usage with Fastly Insights

For deeper visibility into your traffic patterns, you can [open a Support ticket](https://console.upsun.com/-/users/~/tickets/open) to enable an additional **Insights** tab. This view provides finer-grained "Top 10" reports per service, helping you identify exactly which assets are driving your usage:

- **Performance:** Top URLs by bandwidth, highest cache hit ratios, and frequent cache misses.
- **Traffic Sources:** The most common operating systems and browsers used by your visitors.

This data is essential for optimizing your caching strategy and troubleshooting unexpected bandwidth overages.

## Manage dynamic configuration with Edge Dictionaries
Edge Dictionaries allow you to store key-value pairs at the CDN level to control site behavior in real-time. This integration enables you to update configurations (such as feature flags, redirects, or header values) instantly, without a full code redeploy or VCL version change. This can be helpful, for example, to block a bot attack or quickly update a site banner. 

With this integration, you can:
- **Update instantly:** Add, edit, or delete items via the UI or API for immediate effect.
- **Secure secrets:** Use write-only dictionaries to store sensitive API keys that are accessible to your logic but hidden from view.
- **Maintain consistency:** Leverage built-in validation and a management workflow that mirrors Fastly ACLs.

### Example: Use a Dictionary for a maintenance toggle
Instead of hard-coding a maintenance mode in your application, you can use an Edge Dictionary (for example, named `site_config`) to toggle a "Maintenance Mode" page at the edge.

1. Define the dictionary: Create a dictionary named `site_config` and add a `maintenance_enabled` key with a value of `true` or `false`.

1. Add the VCL Logic: Add the following snippet to your Fastly configuration to check the dictionary value on every request:

    ```
    sub vcl_recv {
      # Check if the 'maintenance_enabled' key is set to 'true' in the dictionary
      if (table.lookup(site_config, "maintenance_enabled") == "true") {
        # Send a 503 Service Unavailable response immediately
        error 601 "Maintenance";
      }
    }

    sub vcl_error {
      if (obj.status == 601) {
        set obj.status = 503;
        set obj.response = "Service Unavailable";
        synthetic {"
          <html>
            <body>
              <h1>We'll be back soon!</h1>
              <p>Our site is currently undergoing scheduled maintenance.</p>
            </body>
          </html>
        "};
        return(deliver);
      }
    }
    ```

Related information: 
- [How to create a custom maintenance page in Fastly](https://devcenter.upsun.com/posts/fastly-maintenance/#create-fastly-configuration) - this {{% vendor/company_name %}} Dev Center article also describes how to create a Fastly configuration.