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

## How it works

All incoming requests still go through the environment's router first. When using Varnish, a Varnish service sits between the router and the application server or servers.

```text
web -> router -> varnish -> application
                         -> application2
```

## Configuration

{{% endpoint-description type="varnish" noApp=true %}}

[Service definition](./_index.md):

{{< readFile file="src/registry/images/examples/full/varnish.services.yaml" highlight="yaml" location=".platform/services.yaml" >}}

[App configuration](../app/app-reference.md):

{{< readFile file="src/registry/images/examples/full/varnish.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

{{% /endpoint-description %}}

### 3. Create a VCL template file

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

```bash
sub vcl_recv {
    set req.backend_hint = application.backend();
}
```

Where `application` is the name of the relationship defined in `services.yaml`.
(If the relationship was named differently, use that name instead.)

If you have multiple applications fronted by the same Varnish instance,
then you will need to include logic to determine to which application a request is forwarded.
For example:

```yaml
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

```bash
# config.vcl
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

### 4. Route incoming requests to Varnish

To enable Varnish now, edit the `.platform/routes.yaml` file to point to the Varnish service you just created.
You also need to disable the router cache as it is now entirely redundant with Varnish.

For example:

{{< readFile file="src/registry/images/examples/full/varnish.routes.yaml" highlight="yaml" >}}

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

```bash
import xkey;
```

## Circular relationships

At this time Platform.sh doesn't support circular relationships between services or applications.
That means you cannot add a relationship in your `.platform.app.yaml` that points to the Varnish service.
If you do so, then one of the relationships is skipped and the connection doesn't work.
This limitation may be lifted in the future.

## Stats endpoint

The Varnish service also offers an `http+stats` endpoint, which provides access to some Varnish analysis and debugging tools.
To access it, from a dedicated app container add the following to your [app configuration](../../configuration/app/app-reference.md):

{{< readFile file="src/registry/images/examples/full/varnish.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

You can then access the `varnishstats` relationship over HTTP at the following paths to get diagnostic information:

* `/`: returns the error if generating the VCL failed with an error
* `/config`: returns the generated VCL
* `/stats`: returns the output of `varnishstat`
* `/logs`: returns a streaming response of `varnishlog`

Because of the circular relationship noted above, this can't be done on the application that Varnish is forwarding to.
It needs to be run on a separate application container.

To access the Varnish endpoint:
- Connect to your cluster [using ssh](/development/ssh/_index.md) or through the CLI: `platform ssh -p <project id>`,
- Display the [relationships array](../app/app-reference.md#relationships) with `echo $PLATFORM_RELATIONSHIPS | base64 -d | jq '.'`,
- Query Varnish with `curl varnishstats.internal:8081/stats`, for example, to access the statistics directly. Be sure to update the request according to the name of the relationship.
