# Integrations

## New Relic

New Relic APM is supported on Platform.sh Enterprise. To setup the integration, please create a support ticket and let us know your New Relic license key.


## Blackfire

Blackfire is supported on Platform.sh Enterprise. To setup the integration, please create a support ticket with your Blackfire server ID and token attached. The Blackfire client ID and token is optional.

Note, Blackfire integration works only on profiling your cluster via the URL to the origin. Do not profile your site going through the CDN.

To profile your PHP CLI scripts, use the following command line to do so.

```
blackfire --config /etc/platform/$USER/blackfire.ini <command>
```

