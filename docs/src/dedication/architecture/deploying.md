---
title: "Deployment"
weight: 3
sidebarTitle: "Deploying"
---

## Deploying to Production and Staging

The `master` branch of your Git repository is designated for production, and a `staging` branch is designated for staging.  Any code merged to those branches will automatically trigger a rebuild of the production and staging environments, respectively, in the Dedicated Cluster.  Any defined users or environment variables will also be propagated to the Dedicated Cluster as well.

## Deployment philosophy

Platform.sh values consistency over availability, acknowledging that it is nearly impossible to have both.  Because the deploy hook may make database changes that are incompatible with the previous code version it is unsafe to have both old and new code running in parallel (on different servers), as that could result in data loss.  We believe that a minute of planned downtime for authenticated users is preferable to a risk of race conditions resulting in data corruption, especially with a CDN continuing to serve anonymous traffic uninterrupted.
