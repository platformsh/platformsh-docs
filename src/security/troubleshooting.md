# Troubleshooting security issues

## Compliance scans

Many compliance scanning utilities will raise an flag if a site allows older SSL or TLS versions.  In practice that is rarely a concern as browsers have all supported the latest TLS 1.2 version for many years.  By default, however, Platform.sh allows connections from TLS 1.0 through 1.2.

If required by your compliance scanner or business requirements you can easily set a higher requirement, however.  Add the following to your route definition:

```yaml
tls:
    min_version: TLSv1.2
```

And after your next deploy HTTPS requests using an older version of TLS will be rejected outright, as required by scanners.  See the [Routes documentation](/configuration/routes/https.md) for more details.
