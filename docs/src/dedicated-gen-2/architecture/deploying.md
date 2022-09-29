---
title: "Deployment"
weight: 1
sidebarTitle: "Deploying"
aliases:
  - /dedicated/architecture/deploying.html
---

## Deploying to Production and Staging

The production branch of your Git repository is designated for production and a `staging` branch is designated for staging.
Any code merged to those branches automatically triggers a rebuild
of the production or staging environment in the {{% names/dedicated-gen-2 %}} cluster.
Any defined users or environment variables are also propagated to the {{% names/dedicated-gen-2 %}} cluster.

Note that there is no automatic cloning of data from the {{% names/dedicated-gen-2 %}} cluster to the Development Environment
the way there is between branches in the Development Environment.
Production data may still be replicated to the Development Environment manually.

Deploys of other branches don't trigger rebuilds of the {{% names/dedicated-gen-2 %}} cluster environments.

## Deployment process

When deploying to the {{% names/dedicated-gen-2 %}} cluster the process is slightly different than when working with Platform.sh on the Grid.

* The new application image is built in the exact same fashion as for Platform.sh Professional.
* Any active background tasks on the cluster, including cron tasks, are terminated.
* The cluster (production or staging) is closed, meaning it doesn't accept new requests.
Incoming requests receive an HTTP 500 error.
* The application image on all three servers is replaced with the new image.
* The deploy hook is run on one, and only one, of the three servers.
* The cluster is opened to allow new requests.

The deploy usually takes approximately 30-90 seconds, although that is highly dependent on how long the deploy hook takes to run.

During the deploy process the cluster is unavailable.
Nearly all {{% names/dedicated-gen-2 %}} instances are fronted by the Fastly Content Delivery Network (CDN).
Fastly can be configured to allow a "grace period", meaning that requests to the origin that fail are served from the existing cache, even if that cache item is stale.
We configure a default grace period that is longer than a typical deployment, and can extend that time upon request.
That means anonymous users should see no interruption in service at all.
Authenticated traffic that can't be served by the CDN still sees a brief interruption.

## Deployment philosophy

Platform.sh values consistency over availability, acknowledging that it is nearly impossible to have both.
Because the deploy hook may make database changes that are incompatible with the previous code version it's unsafe to have both old and new code running in parallel (on different servers), as that could result in data loss.
We believe that a minute of planned downtime for authenticated users is preferable to a risk of race conditions resulting in data corruption, especially with a CDN continuing to serve anonymous traffic uninterrupted.

That brief downtime applies only to changes pushed to the `production` branch. Deployments to staging or to a development branch have no impact on the production environment and cause no downtime.

<!--
## Service overview

Add image here once it's updated.
-->
