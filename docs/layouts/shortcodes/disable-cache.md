
## Check the routes settings

To avoid stale content that can't be cleared, don't use {{ .Get "CDN" }} with HTTP caching.

For routes where {{ .Get "CDN" }} is used, disable HTTP caching by setting the [`cache` key](../../src/define-routes/cache.md) to `false`:

```yaml {location=".platform/routes.yaml"}
https://{default}/:
    type: upstream
    ...
    cache:
        enabled: false
```