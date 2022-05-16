
## Check the routes settings

To avoid stale content that can't be cleared, {{ .Get "CDN" }} shouldn't be used with the Platform.sh caching mechanism.

For the routes where {{ .Get "CDN" }} is used, make sure that the Platform.sh HTTP Cache layer is disabled by setting the [`cache` key](../../src/define-routes/cache.md) to `false`:

```yaml {location=".platform/routes.yaml"}
https://{default}/:
    type: upstream
    ...
    cache:
        enabled: false
```