# eZ Platform Enterprise with Fastly

eZ Platform Enterprise is a "commercial extended" version of ez Platform that includes, among other things, support for push-based purging on the Fastly CDN.

## Setting up eZ Platform to use Fastly

eZ Platform's documentation includes instructions on how to [configure eZ Platform for Fastly](https://doc.ezplatform.com/en/latest/guide/http_cache/#serving-varnish-through-fastly).  Follow the steps there to prepare eZ Platform for Fastly.

## Set credentials on Platform.sh

The best way to provide the Fastly credentials and configuration to eZ Platform on Platform.sh is via environment variables.  That way private credentials are never stored in Git.

Using the CLI, run the following commands to set the configuration on your master environment.  (Note that they will inherit to all other environments by default unless overridden.)

```bash
platform variable:set -e master env:HTTPCACHE_PURGE_TYPE fastly
platform variable:set -e master env:FASTLY_SERVICE_ID YOUR_ID_HERE
platform variable:set -e master env:FASTLY_KEY YOUR_ID_HERE
```

Replacing `YOUR_ID_HERE` with the Fastly Service ID and Key obtained from Fastly.

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
