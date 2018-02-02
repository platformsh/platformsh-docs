# PageSpeed Service (beta)

The PageSpeed service speeds up your site and reduces page load time by automatically applying web performance best practices to pages and associated assets (CSS, JavaScript, images) without requiring you to modify your existing content or workflow. It is based on the Open Source PageSpeed project by Google. See the [PageSpeed docs](https://developers.google.com/speed/).

This service is very much fire-and-forget and does not currently allow for any configuration. It is also currently experimental. So your mileage may vary.

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

This is basically a proxy service that sits between our router (the web server) and your application. It exposes an end-point (here confusingly named `app`) and has a relationship to the application also called app.

Usually in your  `.platform/routes.yaml` you would have an `upstream` composed of the name of the application (the one you put in `.platform.app.yaml` and the protocol (currently always `http`). To use the PageSpeed service we make the router use it as its upstream rather than directly the app. In this example `pagespeed:http-app` (the `app` part being the name of the application) instead of `app:http`. 

```yaml
https://{default}/":
    type: upstream
    upstream: "pagespeed:http-app"
    cache:
        enabled: false
```
