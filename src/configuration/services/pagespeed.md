# PageSpeed Service (alpha)

> This service is currently experimental. It's API may change or it may go away at any time without notification. Applications using this services are not covered under Platform.sh's SLA policies.

The PageSpeed service speeds up your site and reduces page load time by automatically applying web performance best practices to pages and associated assets (CSS, JavaScript, images) without requiring you to modify your existing content or workflow. It is based on the Open Source PageSpeed project by Google. See the [PageSpeed docs](https://developers.google.com/speed/).

This service is very much fire-and-forget and does not currently allow for any configuration. It is also currently experimental.

## Supported versions

* 1.12-rc

## How it works

The PageSpeed Service is basically a proxy that sits between our router and your application. It exposes an end-point (here named `my-pagespeed`) and has a relationship to the application, with the same name.

## Setup

To describe the relationship between Pagespeed and your application, you need to configure an endpoint and a relationship back to your application, in `services.yaml`.

Example of a `.platform/services.yaml`, where the pagespeed endpoint name is `my-pagespeed`, and the source application is `my-app`:

```yaml
pagespeed:
    type: pagespeed:1.12-rc
    configuration:
        endpoints:
            "my-pagespeed": {}
    relationships:
        "my-pagespeed": "my-app:http"
```

Usually in your `.platform/routes.yaml` you would have an `upstream` composed of the name of the application (the one you put in `.platform.app.yaml` and the protocol (currently always `http`). Instead, we reference the PageSpeed service, using the format `pagespeed:http-<name of endpoint>`

```yaml
"https://{default}/":
    type: upstream
    upstream: "pagespeed:http-my-pagespeed"
    cache:
        enabled: false
```
