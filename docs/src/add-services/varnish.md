---
title: "Varnish"
weight: 13
---

Varnish is a popular HTTP proxy server, often used for caching.
It is usually not needed on Platform.sh, as each project's router provides an HTTP cache already and most more advanced use cases will use a CDN instead, both of which render Varnish redundant.

However, it is possible to configure a Varnish instance as part of an application if Varnish-specific functionality is needed.

## Supported versions

| **Grid** | **Dedicated** | **Dedicated Generation 3** |
|----------------------------------|---------------|---------------|
|  {{< image-versions image="varnish" status="supported" environment="grid" >}} | {{< image-versions image="varnish" status="supported" environment="dedicated" >}} | {{< image-versions image="varnish" status="supported" environment="dedicated-gen-3" >}} |

{{% image-versions-legacy "varnish" %}}

## How it works

All incoming requests still go through the environment's router first. When using Varnish, a Varnish service sits between the router and the application server or servers.

```text
web -> router -> varnish -> application
                         -> application2
```

## Configuration

{{% endpoint-description type="varnish" noApp=true %}}

The `relationships` block allows Varnish to talk to your app.
You can define `<RELATIONSHIP_NAME>` as you like.
`<APP_NAME>` should match the name you gave your app in your [app configuration](../create-apps/app-reference.md).

The `configuration` block must reference a VCL file inside the `.platform` directory.
The `path` defines the file relative to the `.platform` directory.

{{% /endpoint-description %}}

### 2. Create a VCL template file

The VCL file you provide has three specific requirements over and above the VCL syntax itself.

1. You MUST NOT define a `vcl_init()` function.
   Platform.sh will auto-generate that function based on the relationships you define.
   In particular, it will define a "backend" for each relationship defined in `services.yaml`,
   named the same as the relationship.
2. You MUST NOT include the preamble at the beginning of the file, specifying the VCL version.
   That will be auto-generated as well.
   You CAN add imports, but not `std` and `directors`, as they're imported already.
3. You MUST specify the backend to use in `vcl_recv()`.
   If you have a single app container/relationship/backend, it's just a single line.
   If you want to split requests to different relationships/backends based on some rule,
   then the logic for doing so should be incorporated into the `vcl_recv()` function.

The absolute bare minimum VCL file is:

```bash {location=".platform/config.vcl"}
sub vcl_recv {
    set req.backend_hint = <RELATIONSHIP_NAME>.backend();
}
```

Where `<RELATIONSHIP_NAME>` is the name of the relationship you defined in [step 1](#1-configure-the-service).
With the [example configuration](#example-configuration), that would be the following:

```bash {location=".platform/config.vcl"}
sub vcl_recv {
    set req.backend_hint = application.backend();
}
```

If you have multiple applications fronted by the same Varnish instance,
then you need to include logic to determine to which application a request is forwarded.
For example:

```yaml {location=".platform/services.yaml"}
varnish:
    type: varnish:6.0
    relationships:
        blog: 'blog:http'
        main: 'app:http'
    configuration:
        vcl: !include
            type: string
            path: config.vcl
```

```bash {location=".platform/config.vcl"}
sub vcl_recv {
    if (req.url ~ "^/blog/") {
        set req.backend_hint = blog.backend();
    } else {
        set req.backend_hint = main.backend();
    }
}
```

This configuration will direct all requests to a URL beginning with a `/blog/` path to the application on the relationship `blog`,
and all other requests to the application on the relationship `main`.

Besides that, the VCL file, including the `vcl_recv()` function, can be arbitrarily complex to suit the needs of the project.
That includes additional `include` directives if appropriate.
See the [Varnish documentation](https://varnish-cache.org/docs/index.html) for more details on the functionality offered by Varnish.

{{< note >}}

A misconfigured VCL file can result in incorrect, often mysterious and confusing behavior.
Platform.sh does not provide support for VCL configuration options beyond the basic connection logic documented here.

{{< /note >}}

### 3. Route incoming requests to Varnish

To enable Varnish now, edit the `.platform/routes.yaml` file to point to the Varnish service you just created.
You also need to disable the router cache as it is now entirely redundant with Varnish.

For example:

{{< readFile file="src/registry/images/examples/full/varnish.routes.yaml" highlight="yaml" location=".platform/routes.yaml" >}}

That will map all incoming requests to the Varnish service rather than the application.
Varnish will then, based on the VCL file, forward requests to the application as appropriate.

## Modules

Platform.sh supports a number of optional modules you can include in your VCLs, namely:

* `cookie`
* `header`
* `saintmode`
* `softpurge`
* `tcp`
* `var`
* `vsthrottle`
* `xkey`

To use in your VCL, add an import such as:

```bash {location=".platform/config.vcl"}
import xkey;
```

## Circular relationships

At this time Platform.sh doesn't support circular relationships between services or applications.
That means you cannot add a relationship in your `.platform.app.yaml` that points to the Varnish service.
If you do so, then one of the relationships is skipped and the connection doesn't work.
This limitation may be lifted in the future.

## Stats endpoint

The Varnish service also offers an `http+stats` endpoint,
which provides access to some Varnish analysis and debugging tools.

You can't use it from an app fronted by Varnish because of the restriction with [circular relationships](#circular-relationships).
To access the stats, create a **separate app** with a relationship *to* Varnish, but not *from* it.
Define an [app configuration](../create-apps/app-reference.md) similar to the following:

```yaml {location=".platform.app.yaml"}
name: statsApp
type: "php:8.1"

build:
    flavor: none

relationships:
    varnishstats: "varnish:http+stats"
```

You choose any valid name and type.
When the app is deployed, the app can access the Varnish service over HTTP to get diagnostic information.
The following paths are available:

* `/`: returns the error if generating the VCL failed with an error
* `/config`: returns the generated VCL
* `/stats`: returns the output of `varnishstat`
* `/logs`: returns a streaming response of `varnishlog`

To access the Varnish stats endpoint from the command line:

1. Connect to your stats app [using SSH](../development/ssh/_index.md): `platform ssh --app statsApp`
   (replace `statsApp` with the name you gave the app).
2. Display the [relationships array](../create-apps/app-reference.md#relationships) with `echo $PLATFORM_RELATIONSHIPS | base64 -d | jq .`,
3. Query Varnish with `curl <HOST>:<PORT>/stats`, replacing `<HOST>` and `<PATH>` with the values from step 2.
