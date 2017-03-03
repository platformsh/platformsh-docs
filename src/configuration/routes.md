---
search:
    keywords: ['routes', 'routing', 'routes.yaml', '.platform/routes.yaml']
---

# Configure Routes

Platform.sh allows you to define the routes used in your environments.

A route describes how an incoming HTTP request is going to be processed by
Platform.sh. The routes are defined using `.platform/routes.yaml` file
in your Git repository.

If you don't have one, use the commands below to create it:

```bash
$ mkdir .platform
$ touch .platform/routes.yaml
```

## Route templates

The YAML file is composed of a list of routes and their configuration.
A route can either be an absolute URL or a URL template that looks like:
`http://www.{default}/` or `https://{default}/blog` where `{default}`
will be substituted by the default fully qualified domain name configured
in the project. So if your default domain is `example.com`, these
routes will be resolved to `http://www.example.com/` and
`https://example.com/blog` in the master environment.

Platform.sh will also generate a domain for every active development environment.
It will receive a domain name based on the region, project ID, branch name, and 
a per-environment random string. The domain name itself is not guaranteed stable,
although the pattern is consistent.

> **note**
> Platform.sh supports running multiple applications per environment.
> The `.platform/routes.yaml` file defines how to route requests to
> different applications.

## Route configuration

Each route can be configured separately. It has the following properties

* `type` can be:
  * `upstream` serves an application
    * It will then also have an `upstream` property which will be the name of
      the application (as defined in `.platform.app.yaml`),
      followed by ":http" (see examples below).
  * `redirect` redirects to another route
    * It will then be followed by a `to` property, this defines a HTTP 301
      redirect to any URL or another route (see examples below).
* `cache` controls [caching behavior of the route](/configuration/routes/cache.html).
* `ssi` controls whether Server Side Includes are enabled.
  For more information: see [SSI](/configuration/routes/ssi.html).
* `redirects` controls [redirect rules](/configuration/routes/redirects.html) associated with the
  route.

> **note**
> For the moment, the value of upstream is always in the form: `<application-name>:http`.
> `<application-name>` is the `name` defined in `.platform.app.yaml` file.
> `:php` is a deprecated application endpoint; use `:http` instead.
> In the future, Platform.sh will support multiple endpoints per application.

## Routes examples

Here is an example of a `.platform/routes.yaml` file:

```yaml
"http://{default}/":
  type: upstream
  upstream: "app:http"
"http://www.{default}/":
  type: redirect
  to: "http://{default}/"
```

In this example, we will route both the apex domain and the www subdomain to an
application we called "app", the www subdomain being redirected to the
apex domain. Note, we also generate HTTPS routes automatically using the
configuration of each HTTP route.

In the following example, we are not redirecting from the www subdomain to the
apex domain but serving from both:

```yaml
"http://{default}/":
    type: upstream
    upstream: "app:http"

"http://www.{default}/":
    type: upstream
    upstream: "app:http"
```

The server in the former example will respond directly to a request in the form
`http://example.com/hello`. And, it will issue a HTTP 301 redirect from
`http://www.example.com/foo/bar` to `http://example.com/foo/bar`, which is not
the case in the latter example.

Here is an example of using wildcard configuration (see details on [wildcard
routes](#wildcard-routes)):

```yaml
"http://*.{default}/":
    type: upstream
    upstream: "app:http"
```

You can see the [Configuring Multiple Applications](/configuration/app/multi-app.md)
section for a detailed view on how to define routes that work with
**multiple applications in the same project**. Also, look at the
[redirects](/configuration/routes/redirects.md) section for details on how you can set up complex
redirection rules including **partial redirects**.

### HTTPS

All environments on Platform.sh support both HTTP and HTTPS automatically.  Production SSL certificates are provided by [Let's Encrypt](https://letsencrypt.org/).  You may alternatively provide your own SSL certificate from a 3d party issuer of your choice at no charge from us.

Platform.sh recommends using HTTPS requests for all sites exclusively.  Doing so provides better security, access to certain features that web browsers only permit over HTTPS, and access to HTTP/2 connections on all sites which can greatly improve performance.

How HTTPS redirection is handled depends on the routes you have defined.  Platform.sh recommends specifying all HTTPS routes in your `routes.yaml` file.  That will result in all pages being served over SSL, and any requests for an HTTP URL will automatically be redirected to HTTPS.

```yaml
"https://{default}/":
    type: upstream
    upstream: "app:http"

"https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

Specifying only HTTP routes will result in duplicate HTTPS routes being created automatically, allowing the site to be served from both HTTP and HTTPS without redirects.

Although Platform.sh does not recommend it, you can also redirect HTTPS requests to HTTP explicitly to serve the site over HTTP only.  The use cases for this configuration are few.

```yaml
"http://{default}/":
    type: upstream
    upstream: "app:http"

"http://www.{default}/":
    type: redirect
    to: "http://{default}/"

"https://{default}/":
    type: redirect
    to: "http://{default}/"

"https://www.{default}/":
    type: redirect
    to: "http://{default}/"
```

Of course, more complex routing logic is possible if the situation calls for it.  However, we recommend defining HTTPS routes exclusively.

## Configuring routes on the Web Interface

Routes can also be configured using the web interface in
the [routes section](/administration/web/configure-environment.html#routes)
of the environment settings. If you have edited the routes via the web interface,
you will have to `git pull` the updated `.platform/routes.yaml` file from us.

## CLI Access

You can get a list of the configured routes of an environment by running
`platform environment:routes`.

![Platform Routes CLI](/images/platform-routes-cli.png)

## Wildcard routes

Platform.sh supports wildcard routes, so you can map multiple subdomains to the
same application. This works both for redirect and upstream routes. You can
simply prefix the route with a star (`*`), for example `*.example.com`, and
HTTP request to `www.example.com`, `blog.example.com`, `us.example.com` will all get
routed to the same endpoint.

For your master environment, this would function as a catch-all domain.

For development environments, we will also be able to handle this. Here is how:

Let's say we have a project on the EU cluster whose ID is "vmwklxcpbi6zq" and we created a branch called "add-theme". It's environment name will be similar to `add-theme-def123`.  The generated apex domain of this environment will be `add-theme-def123-vmwklxcpbi6zq.eu.platform.sh`. If we have a `http://*.{default}/` route defined, the generated route will be `http://*---add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/`. This means you could put any subdomain before the triple dashes to reach your application. HTTP request to both `http://foo---add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/` and `http://bar---add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/` URLs will be routed to your application properly. However, request to `http://*---add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/` will not be routed since it is not a legitimate domain name.

> **note**
> Triple dash (`---`) is used as a separator for the subdomain in development
> environments. It replaces the dot (`.`).

## WebSocket routes

To use WebSocket on a route, `cache` must be disabled because WebSocket is
incompatible with buffering, which is a requirement of caching on our router.
Here is an example to define a route that serves WebSocket:

```yaml
"http://{default}/ws":
    type: upstream
    upstream: "app:http"
    cache:
        enabled: false
```
