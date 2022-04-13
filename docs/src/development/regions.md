---
# Data: Add and edit regions in `docs/data/regions.yaml`.
# Styles: See `docs/static/styles/user-customizations.css`.
# Table shortcode: See `docs/layouts/shortcodes/region_ips.html`.
title: Regions
weight: 14
description: |
  Platform.sh regions reach the outside through a limited number of IP addresses.
aliases:
  - /development/public-ips.html
---

{{< description >}}

IP addresses are stable, but not guaranteed to never change.
Before any change, you will be notified well in advance regarding affected projects.

## Region availability

While this page contains IP addresses for data centers in every Platform.sh region,
only those regions listed during provisioning are actually available to new projects.
Those regions that are no longer open are included here as reference for existing projects and for Enterprise customers.

Enterprise tier projects can continue to create projects on these "closed" regions when appropriate.  

## IP addresses by region

Use the inbound IP addresses if you have a corporate firewall which blocks outgoing SSH connections.
In that case, add the following IP addresses for inbound traffic to your allow list.

### Europe

{{< region_ips region="europe" >}}

### United States

{{< region_ips region="us" >}}

### Canada

{{< region_ips region="canada" >}}

### Australia

{{< region_ips region="australia" >}}
