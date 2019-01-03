Varnish HTTP Proxy (alpha)

Varnish is a popular HTTP proxy server, often used for caching.  It is usually not needed on Platform.sh, as each project's router provides an HTTP cache already and most more advanced use cases will use a CDN instead, both of which render Varnish redundant.

However, it is possible to configure a Varnish instance as part of an application if Varnish-specific functionality is needed.

## Supported versions

* 5.2

## How it works

All incoming requests still go through the the environment's router first.  When using Varnish, a Varnish service sits between the router and the application server or servers.

```
web -> router -> varnish -> application
                         -> application2
```

## Configuration

### Add a Varnish service

Add the following to your `.platform/services.yaml` file:

```yaml
varnish:
    type: varnish:5.2
    relationships:
        app: 'app:http'
    configuration:
        vcl: !include
            type: string
            path: config.vcl
```

In the `relationships` block, define a relationship to the application container (here `app`) using the `http` endpoint, and name the relationship the same.  That allows Varnish to talk to the application container.

There is no default VCL file provided.  The configuration block is required, and must reference a VCL file (here `config.vcl`).  The file name is relative to the `.platform` directory.

### Create a VCL template file

The VCL file you provide has three specific requirements over and above the VCL syntax itself.

1) You MUST NOT define a `vcl_init()` function.  Platform.sh will auto-generate that function based on the relationships you define.  In particular, it will define a "backend" for each relationship defined in `services.yaml`, named the same as the relationship.
2) You MUST NOT include the preamble at the beginning of the file, specifying the VCL version or imports.  That will be auto-generated as well.
3) You MUST specify the backend to use in `vcl_recv()`.  If you have a single app container/relationship/backend, it's just a single line.  If you want to split requests to different relationships/backends based on some rule then the logic for doing so should be incorporated into the `vcl_recv()` function.

The absolute bare minimum VCL file is:

```
sub vcl_recv {
    set req.backend_hint = app.backend();
}
```

Where `app` is the name of the relationship defined in `services.yaml`.  (If the relationship was named differently, use that name instead.)

If you have multiple applications fronted by the same Varnish instance then you will need to include logic to determine to which application a request is forwarded.  For example:

```
sub vcl_recv {
    if (req.url ~ "^/foo/") {
        set req.backend_hint = app.backend();
    } else {
        set req.backend_hint = app2.backend();
    }
}
```

This configuration will direct all requests to a URL beginning with a `/foo/` path to the application on the relationship `app`, and all other requests to the application on the relationship `app2`.

Besides that, the VCL file, including the `vcl_recv()` function, can be arbitrarily complex to suit the needs of the project.  See the [Varnish documentation](https://varnish-cache.org/docs/index.html) for more details on the functionality offered by Varnish.

> **note**
> A misconfigured VCL file can result in incorrect, often mysterious and confusing behavior.  Platform.sh does not provide support for VCL configuration options beyond the basic connection logic documented here.

### Route incoming requests to Varnish

To enable Varnish now, edit the `.platform/routes.yaml` file to point to the Varnish service you just created.  You also need to disable the router cache as it is now entirely redundant with Varnish.

For example:

```yaml
"https://{default}/":
    type: upstream
    upstream: "varnish:http"
    cache: 
        enabled: false
```

That will map all incoming requests to the Varnish service rather than the application.  Varnish will then, based on the VCL file, forward requests to the application as appropriate.

### Expose Varnish to the application

In some situations it is necessary for the application container to send messages to the Varnish server directly, such as for forced cache purge situations.  In that case you will also need to add a relationship from the application to the Varnish service.  That is the same as any other relationship in `.platform.app.yaml`:

```yaml
relationships:
    varnish: `varnish:http`
```

(Assuming your service is named `varnish` in `services.yaml`.)

Your application will then be able to send HTTP requests to the Varnish instance using the credentials provided in that relationship.
