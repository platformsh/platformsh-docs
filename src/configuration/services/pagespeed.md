# PageSpeed Module

Pagespeed module, also known as mod_pagespeed, is an open source HTTP module for Apache or Nginx, which runs several optimizations on the resources of your website, on the server side.

Because Pagespeed module is a proxy service, it will take place in between the router and your application. See below in the routes.yaml example how to set up this additional layer.

See the [PageSpeed docs](https://developers.google.com/speed/) for more information.

## Supported versions

* 1.12

## Setup

To describe the relationship between Pagespeed and your application, you need to set up an endpoint and a relationship to your application. Both will carry the same name, `<relationship to app>` in the services.yaml example.

Example of a `.platform/services.yaml`:

```yaml
pagespeed:
    type: pagespeed:1.12
    configuration:
        endpoints:
            <relationship to app>: {}
    relationships:
        <relationship to app>: "<name of the app>:http" # the name if the app is the same one as in .platform.app.yaml
```

The place of the Pagespeed service, between the router and the application, is described in the routes.yaml, using the same name `<relationship to app>`, in the expression "pagespeed:http-<relationship to app>".

Example of a `.platform/routes.yaml`:

```yaml
https://{default}/":
    type: upstream
    upstream: "pagespeed:http-<relationship to app>"
    cache:
        enabled: false
```

## Configuration

We recommend using the default configuration of the PageSpeed module which should work with any application. More intense optimizations (for example: automatically resizing images depending on the context, re-prioritizing CSS rules, etc.) are not supported yet.
