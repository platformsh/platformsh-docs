# Troubleshooting security issues

## Update early, update often

Platform.sh periodically updates its container images for the latest security updates from upstream providers.  (PHP versions, Ruby versions, MariaDB versions, etc.).  These do not always happen immediately but when a security vulnerability is identified and released it tends to be fairly soon after.

However, these updates are not automatically propagated to individual projects as that would involve potential customer downtime.  Instead, the latest available version of every requested container is loaded on each deploy to a given environment.  After a deploy you are always guaranteed to be running the latest Platform.sh-provided version of a container.

If you have regular redeploys scheduled for Let's Encrypt SSL certificates then that will also ensure your container versions are up to date at the same time.  For that reason we recommend all customers setup the [appropriate cron task](/configuration/routes/https.md#automatic-certificate-renewal) to redeploy every 2 weeks or so.

## Compliance scans

Many compliance scanning utilities will raise an flag if a site allows older SSL or TLS versions.  In practice that is rarely a concern as browsers have all supported the latest TLS 1.2 version for many years.  By default, however, Platform.sh allows connections from TLS 1.0 through 1.2.

If required by your compliance scanner or business requirements you can easily set a higher requirement, however.  Add the following to your route definition:

```yaml
tls:
    min_version: TLSv1.2
```

And after your next deploy HTTPS requests using an older version of TLS will be rejected outright, as required by scanners.  See the [Routes documentation](/configuration/routes/https.md) for more details.
