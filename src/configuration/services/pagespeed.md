# PageSpeed Module

PageSpeed is a family of 4 tools developped by Google Inc to optimize of websites performance.

Pagespeed module, also known as mod_pagespeed, is an open source HTTP module for Apache or Nginx, which runs several optimizations on the resources of your website, on the server side.

See the [PageSpeed docs](https://developers.google.com/speed/) for more information.

## Supported versions

* 1.12

## Setup

In your ``.platform/services.yaml``:

```yaml
pagespeed:
    type: pagespeed:1.12-rc
    configuration:
        endpoints:
            app: {}
    relationships:
        app: "myapp:http"
```

The pagespeed proxy exposes an endpoint app and this endpoint uses the upstream relationship named app.

In your .platform/routes.yaml, use pagespeed:http-app instead of app:http:

```yaml
https://{default}/":
    type: upstream
    upstream: "pagespeed:http-app"
    cache:
        enabled: false
```

## Configuration

We recommend to use the default configuration of the PageSpeed module which should work with any application. More intense optimizations (for example: automatically resizing images depending on the context, re-prioritizing CSS rules, etc.) are not supported yet.
