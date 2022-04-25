---
# Data: Add and edit regions in `docs/data/regions.yaml`.
# Styles: See `docs/static/styles/user-customizations.css` under `Region information`
# Table shortcode: See `docs/layouts/shortcodes/regions.html`.
title: Regions
weight: 14
description: See information about Platform.sh regions, including their environmental impact and IP addresses.
aliases:
  - /development/public-ips.html
---

Platform.sh offers several different regions for hosting project data.
You can choose a region based on criteria such as its closeness to your users and its environmental impact.

## Environmental impact

Platform.sh is committed to reducing the environmental impact from its activities.
As part of this effort, when creating a project you see information about the carbon footprint of the region's electricity grid provider.
You see the average carbon intensity for its energy grid (in gCO2eq/kWh).
The carbon intensity values come from the International Energy Agency.

Information on carbon intensity is also available in the Platform.sh API.
For example, to get a JSON object of the regions with their carbon intensities, run the following command:

```bash
platform api:curl regions | jq -r '.regions | map({(.label|tostring):.environmental_impact.carbon_intensity}) | add'
```

See all available information in the [API documentation](https://api.platform.sh/docs/#tag/Regions).

## Region availability

The regions listed here may be different from those available when you create a new project.
The list includes legacy regions as reference for existing projects.

## Public IP addresses

The public IP addresses for regions are stable, but not guaranteed to never change.
Before any change, you will be notified well in advance regarding affected projects.

They're useful for cases such as when you have a corporate firewall that blocks outgoing SSH connections.
In such cases, add the inbound IP addresses for your region to your allow list.

### Europe

{{< regions region="europe" >}}

### United States

{{< regions region="us" >}}

### Canada

{{< regions region="canada" >}}

### Australia

{{< regions region="australia" >}}
