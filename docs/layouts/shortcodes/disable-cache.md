## Avoid double-caching

To avoid stale content that can't be cleared, don't use {{ .Get "CDN" }} with [HTTP caching](../../src/define-routes/cache.md).

For routes where {{ .Get "CDN" }} is used, disable HTTP caching:

```yaml {location=".platform/routes.yaml"}
https://{default}/:
    type: upstream
    ...
    cache:
        enabled: false
```
