## 1. Avoid double-caching

To avoid stale content that can't be cleared, 
avoid using {{ .Get "CDN" }} with [HTTP caching](/define-routes/cache.md).

For routes where {{ .Get "CDN" }} is used, 
disable HTTP caching using the following configuration:

```yaml {location=".platform/routes.yaml"}
https://{default}/:
    type: upstream
    ...
    cache:
        enabled: false
```
