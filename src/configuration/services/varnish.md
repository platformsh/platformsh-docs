Varnish HTTP Proxy (alpha)

Varnish is a popular HTTP proxy server, often used for caching.  It is usually not needed on Platform.sh, as each project's router provides an HTTP cache already and most more advanced use cases will use a CDN instead, both of which render Varnish redundant.

However, it is possible to configure a Varnish instance as part of an application if Varnish-specific functionality is needed.

> **note**
> This functionality is considered beta and may evolve in the future. It is usable but the configuration options may change.  We will endeavor to provide ample warning should that be the case.

## Supported versions

* 5.1-rc

## How it works

All incoming requests still go through the the environment's router first.  When using Varnish, a varnish service sits between the router and the application server.  Only one application server is supported behind a given Varnish instance.  That means a multi-application project that wants to use Varnish for different backends would need to use multiple Varnish services and route to one or the other at the router layer.

Note that if you are using both Varnish and [PageSpeed](/configuration/services/pagespeed.md), we recommend putting PageSpeed behind Varnish.  That is:

```text
router -> varnish -> pagespeed -> application
```

In that case, modify the instructions below to give Varnish the PageSpeed service name instead of the application name.

## Usage example

### Add a Varnish service

Add the following to your `.platform/services.yaml` file:

```yaml
varnish:
    type: varnish:5.1-rc
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

The VCL file itself needs to be configured with the relationship information to connect to the backend application.  As that is not known in advance the VCL file is actually processed and deployment time as a template, using the Python [Jinja2](http://jinja.pocoo.org/docs/2.10/) template engine.  

The most important templated variable provided is `relationships`, which is a Python dict in the same format as at runtime, containing the relationship data that corresponds to the relationships array in the `services.yaml` file.  That dict can be iterated over using the Jinja2 template syntax to produce a functional VCL file.

The following example shows the most common configuration.  In many cases it can be used verbatim, but is not a complete VCL.  You are responsible for writing the remainder of the VCL based on your application's needs.

```text
vcl 4.0;
import std;
import directors;

# Default backend definition. Points to the application container.
{% for relationship in relationships %}
{% for instance in relationship.instances %}
backend {{relationship.name}}_{{loop.index}} {
    .host = "{{instance.host}}";
    .port = "{{instance.port}}";
}
{% endfor %}
{% endfor %}

# Access control list for PURGE requests.
# Here you need to put the IP address of your web server
acl purge {
    {% for relationship in relationships %}
    {% for instance in relationship.instances %}
        "{{instance.host}}";
    {% endfor %}
    {% endfor %}
}

sub vcl_init {
    {% for relationship in relationships %}
    new {{relationship.name}} = directors.random();
    {% for instance in relationship.instances %}
    {{relationship.name}}.add_backend({{relationship.name}}_{{loop.index}}, 1.0);
    {% endfor %}
    {% endfor %}
}

# Your VCL configuration here.
```

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

