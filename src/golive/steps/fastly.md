# (Optional) Fastly configuration

In some cases you may want to opt to use a CDN such as Fastly rather than the Platform.sh router's cache.  Using a CDN can offer a better time-to-first-byte for cached content across a wider geographic region at the cost of the CDN service.

A Fastly CDN is included for Platform.sh Dedicated instances.  Platform.sh does not offer an integrated CDN on Platform.sh Professional at this time, but it is a common choice for customers to self-configure.

Launching a Platform.sh site with Fastly in front of it is nearly the same as launching normally.  There are only two notable differences.

Note that individual applications may have their own Fastly setup instructions or additional modules.  Consult the documentation for your application for specific details.

## Set the Platform.sh domain on Fastly

Rather than create a DNS CNAME for your Platform.sh master branch (for instance `master-7rqtwti-qwertyqwerty.eu.platform.sh`), [configure Fastly](https://docs.fastly.com/guides/basic-configuration/working-with-domains) to respond to requests for your domain name and to treat the Platform.sh master branch as its backend server.  Be sure to enable TLS for the backend connection to Platform.sh.  Then configure your DNS to point your domain at Fastly instead.  See the [Fastly documentation](https://docs.fastly.com/guides/basic-configuration/connecting-to-origins) for further details.

Note that you will still need to configure the domain on Platform.sh for it to respond to requests properly.

## Disable Platform.sh caching

When using a CDN the Platform.sh router's HTTP cache becomes redundant.  In most cases it's best to disable it outright.  Modify your route in `.platform/routes.yaml` like so to disable the cache:

```yaml
"https://{default}/":
    type: upstream
    upstream: "app:http"
    cache:
        # Disable the HTTP cache on this route. It will be handled by Fastly instead.
        enabled: false
```
