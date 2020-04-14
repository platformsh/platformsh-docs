# Update all the things

**The Platform.sh Rule:** Update Early, Update Often

Platform.sh periodically updates its container images for the latest security updates from upstream providers.  (PHP versions, Ruby versions, MariaDB versions, etc.).  These do not always happen immediately but when a security vulnerability is identified and released it tends to be fairly soon after.

However, these updates are not automatically propagated to individual projects as that would involve potential customer downtime.  Instead, the latest available version of every requested container is loaded on each deploy to a given environment.  After a deploy you are always guaranteed to be running the latest Platform.sh-provided version of a container.

If you have regular redeploys scheduled for Let's Encrypt SSL certificates then that will also ensure your container versions are up to date at the same time.  For that reason we recommend all customers setup the [appropriate cron task](/configuration/routes/https.md#automatic-certificate-renewal) to redeploy every two weeks or so.
