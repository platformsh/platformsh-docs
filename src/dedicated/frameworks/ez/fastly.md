# eZ Platform Enterprise with Fastly

eZ Platform Enterprise is a "commercial extended" version of ez Platform that includes, among other things, support for push-based purging on the Fastly CDN.

## Setting up eZ Platform to use Fastly

eZ Platform's documentation includes instructions on how to [configure eZ Platform for Fastly](https://doc.ezplatform.com/en/latest/guide/http_cache/#serving-varnish-through-fastly).  Follow the steps there to prepare eZ Platform for Fastly.

## Set credentials on Platform.sh

The best way to provide the Fastly credentials and configuration to eZ Platform on Platform.sh is via environment variables.  That way private credentials are never stored in Git.

Your `production` branch is what will be deployed to the Production Cluster.  You can therefore set environment variables on that branch specifically and they will be replicated over to the Production Cluster on each git push without affecting development environments.

```bash
platform variable:set -e production env:HTTPCACHE_PURGE_TYPE fastly
platform variable:set -e production env:FASTLY_SERVICE_ID YOUR_ID_HERE
platform variable:set -e production env:FASTLY_KEY YOUR_ID_HERE
```

Replacing `YOUR_ID_HERE` with the Fastly Service ID and Key obtained from Fastly.

Optionally, if you have a separate set of Fastly credentials to use for Staging you can set those on the `staging` branch by replacing `production` with `staging` in the above commands.

## Launch on Fastly

See the [Launching on Fastly instructions](/launch/launch.html#fastly-specific-instructions) for configuring your domain with Fastly.
