# eZ Platform behind Fastly

The Fastly CDN offers a number of benefits for eZ Platform projects.  In particular, it supports selective-purge functionality that allows for a much longer default TTL while still offering up-to-date content.  To fully leverage Fastly of course requires specific configuration.

As eZ Platform is built on Symfony it inherits much of its network configuration.

## Disable Symfony's HTTP caching

When run behind a CDN like Fastly, the built-in HTTP Cache middleware in Symfony should *not* be used.  It is redundant with the CDN. However, it may be desirable to keep it active in the Dev environment.


To disable the Cache middleware in all environments, add the following to your `.platform.app.yaml` file:

```yaml
variables:
    env:
        SYMFONY_HTTP_CACHE: 0
```

To enable the Cache middleware in Dev but disable it on a Platform.sh Enterprise Cluster, instead place the following in the `.environment` file in the root of the application:

```
If ["$PLATFORM_MODE" == "enterprise"]; then
    export SYMFONY_HTTP_CACHE=0
fi
```
