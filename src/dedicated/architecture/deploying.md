# Deployment

## Deploying to Production and Staging

The `production` branch of your Git repository is designated production, and a `staging` branch is designated for staging.  Any code merged to those branches will automatically trigger a rebuild of the production and staging environments, respectively, in the Enterprise Cluster.  Any defined users or environment variables will also be propagated to the Enterprise Cluster as well.

Note that there is no automatic cloning of data from the Enterprise Cluster to the Development Environment the way there is between branches in the Development Environment.  Production data may still be replicated to the Development Environment manually.

The `master` branch is still available but will have no impact on either the production or staging environments.  Deploys of the master branch will not trigger a rebuild of the Enterprise Cluster environments.  A common model is to use the `master` branch as a pre-integration branch before merging code to staging, such as at the end of a sprint.

## Deployment process

When deploying to the Enterprise Cluster the process is slightly different than when working with Platform.sh Professional.

* The new application image is built in the exact same fashion as for Platform.sh Professional.
* Any active background tasks on the cluster, including cron tasks, are terminated.
* The cluster (production or staging) is closed, meaning it does not accept new requests.  Incoming requests will receive an HTTP 500 error.
* The application image on all three servers is replaced with the new image.
* The deploy hook is run on one, and only one, of the three servers.
* The cluster is opened to allow new requests.

The deploy usually takes approximately 30-90 seconds, although that is highly dependent on how long the deploy hook takes to run.

During the deploy process the cluster is unavailable.  However, nearly all Platform.sh Enterprise instances are fronted by a Content Delivery Network (CDN).  Most CDNs can be configured to allow a "grace period", that is, requests to the origin that fail will be served from the existing cache, even if that cache item is stale.  We strongly recommend configuring the CDN with a grace period longer than a typical deployment.  That means anonymous users should see no interruption in service at all.  Authenticated traffic that cannot be served by the CDN will still see a brief interruption.

## Deployment philosophy

Platform.sh values consistency over availability, acknowledging that it is nearly impossible to have both.  Because the deploy hook may make database changes that are incompatible with the previous code version it is unsafe to have both old and new code running in parallel (on different servers), as that could result in data loss.  We believe that a minute of planned downtime for authenticated users is preferable to a risk of race conditions resulting in data corruption, especially with a CDN continuing to serve anonymous traffic uninterrupted.

That brief downtime applies only to changes pushed to the `production` branch. Deployments to staging or to a development branch have no impact on the production environment and will cause no downtime.

<!--
## Service overview

Add image here once it's updated.
-->
