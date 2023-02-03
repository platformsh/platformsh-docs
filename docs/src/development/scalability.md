---
title: "Scale your live site"
sidebarTitle: "Scalability"
description: Learn how to scale your live site.
---

Your production environment gets a [pool of resources](../create-apps/app-reference.md#sizes)
based on your [plan size](../administration/pricing/_index.md).
These resources are split up between the applications and services you have defined.
Here is an example distribution: PHP 40%, MySQL 30%, Redis 10%, Solr 20%.

To increase the pool of resources available to your project,
upgrade your plan and redeploy your site.

If you're expecting more traffic than usual, 
upgrade your plan ahead of time.
You can downgrade your plan after the traffic surge to save resources.
Fees are adjusted as soon as you upgrade or downgrade so you're never overcharged.

Note that Platform.sh monitors Dedicated projects so [scaling can be initiated](../dedicated-gen-2/architecture/scalability.md)
when a high-load incident occurs. 