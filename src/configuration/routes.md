---
search:
    keywords: ['routes', 'routing', 'routes.yaml', '.platform/routes.yaml']
---

# Configure Routes

Platform.sh allows you to define the routes used in your environments.

A route describes how an incoming HTTP request is going to be processed by Platform.sh. The routes are defined using `.platform/routes.yaml` file in your Git repository.

If you don't have one, use the commands below to create it:

```bash
$ mkdir .platform
$ touch .platform/routes.yaml
```

![Routes](/images/config_diagrams/routes.svg)

## Route templates

The YAML file is composed of a list of routes and their configuration. A route can either be an absolute URL or a URL template that looks like: `http://www.{default}/` or `https://{default}/blog` where `{default}` will be substituted by the default fully qualified domain name configured in the project. So if your default domain is `example.com`, these routes will be resolved to `http://www.example.com/` and `https://example.com/blog` in the master environment.

Platform.sh will also generate a domain for every active development environment.  It will receive a domain name based on the region, project ID, branch name, and a per-environment random string. The domain name itself is not guaranteed stable, although the pattern is consistent.

> **note**
> Platform.sh supports running multiple applications per environment. The `.platform/routes.yaml` file defines how to route requests to different applications.

## Route configuration

Each route can be configured separately. It has the following properties

* `type` can be:
  * `upstream` serves an application
    * It will then also have an `upstream` property which will be the name of the application (as defined in `.platform.app.yaml`), followed by ":http" (see examples below).
  * `redirect` redirects to another route
    * It will then be followed by a `to` property, this defines a HTTP 301 redirect to any URL or another route (see examples below).
* `cache` controls [caching behavior of the route](/configuration/routes/cache.html).
* `ssi` controls whether Server Side Includes are enabled. For more information: see [SSI](/configuration/routes/ssi.html).
* `redirects` controls [redirect rules](/configuration/routes/redirects.html) associated with the route.

![Routes files](/images/config_diagrams/routes2.svg)

> **note**
> For the moment, the value of upstream is always in the form: `<application-name>:http`.  `<application-name>` is the `name` defined in `.platform.app.yaml` file.  `:php` is a deprecated application endpoint; use `:http` instead.  In the future, Platform.sh will support multiple endpoints per application.

## Route limits

Although there is no fixed limit on the number of routes that can be defined, there is a cap on the size of generated route information.
This limitation comes from the Linux kernel, which caps the size of environment variables.
The kernel limit on environment variables is 32 pages. Each page is 4k on x86 processors, resulting in a maximum environment variable length of 131072 bytes.
If your `routes.yaml` file would result in too large of a route information value it will be rejected.

The full list of generated route information is often much larger than what is literally specified in the `routes.yaml` file.  For example, by default all HTTPS routes will be duplicated to create an HTTP redirect route.  Also, the `{all}` placeholder will create two routes (one HTTP, one HTTPS) for each domain that is configured.

As a general rule we recommend keeping the defined routes under 100.  Should you find your `routes.yaml` file rejected due to an excessive size the best alternative is to move any redirect routes to the application rather than relying on the router, or collapsing them into a [regular expression-based redirect](/configuration/routes/redirects.md#partial-redirects) within a route definition.

Let's Encrypt also limits an environment to 100 configured domains.  If you try to add more than that some of them will fail to get an SSL certificate.

## Routes examples

Here is an example of a basic `.platform/routes.yaml` file:

```yaml
"https://{default}/":
  type: upstream
  upstream: "app:http"
"https://www.{default}/":
  type: redirect
  to: "https://{default}/"
```

In this example, we will route both the apex domain and the www subdomain to an [application called "app"](/configuration/app/name.md), the www subdomain being redirected to the apex domain using an HTTP 301 `Moved Permanently` response.

In the following example, we are not redirecting from the www subdomain to the apex domain but serving from both:

```yaml
"https://{default}/":
    type: upstream
    upstream: "app:http"

"https://www.{default}/":
    type: upstream
    upstream: "app:http"
```

## Route placeholders

You can configure any number of domains on a project when you are ready to make it live.  Only one of them may be set as the "default" domain.  In the `routes.yaml` file a route can be defined either literally or using one of two special placeholders: `{default}` and `{all}`.

The magic value `{default}` will be replaced with the production domain name configured as the default on your account in the production branch.  In a non-production branch it will be replaced with the project ID and environment ID so that it is always unique.

The magic value `{all}` will be replaced by all of the domain names configured on the account. That is, if two domains `example1.com` and `example2.com` are configured, then a route named `https://www.{all}/` will result in two routes in production: `https://www.example1.com` and `https://www.example2.com`.  That can be useful in cases when a single application is serving two different websites simultaneously.  In a non-production branch it will be replaced with the project ID and environment ID for each domain, in the same fashion as a static route below.

If there are no domains defined on a project (as is typical in development before launch) then the `{all}` placeholder will behave exactly like the `{default}` placeholder.

It's also entirely possible to use an absolute URL in the route. In that case, it will be used as-is in a production environment.  On a development environment it will be mangled to include the project ID and environment name.  For example:

```yaml
"https://www.example.com/":
    type: upstream
    upstream: "app:http"
"https://blog.example.com/":
    type: upstream
    upstream: "blog:http"
```

In this case, there are two application containers `app` and `blog`.  In a production environment, they would be accessible at `www.example.com` and `blog.example.com`, respectively.  On a development branch named `sprint`, however, they would be accessible at URLs something like:

```bash
https://www.example.com.sprint-7onpvba-tvh56f275i3um.eu-2.platformsh.site/
https://blog.example.com.sprint-7onpvba-tvh56f275i3um.eu-2.platformsh.site/
```

If your project involves only a single apex domain with one app or multiple apps under subdomains, it's generally best to use the `{default}` placeholder.  If you are running [multiple applications](/configuration/app/multi-app.md) on different apex domains then you will need to use a static domain for all but one of them.

## Configuring routes on the Web Interface

Routes can also be configured using the web interface in the [routes section](/administration/web/configure-environment.html#routes) of the environment settings. If you have edited the routes via the web interface, you will have to `git pull` the updated `.platform/routes.yaml` file from us.

## CLI Access

You can get a list of the configured routes of an environment by running `platform environment:routes`.

![Platform Routes CLI](/images/platform-routes-cli.png)

## Wildcard routes

Platform.sh supports wildcard routes, so you can map multiple subdomains to the same application. This works both for redirect and upstream routes. You can simply prefix the route with a star (`*`), for example `*.example.com`, and HTTP request to `www.example.com`, `blog.example.com`, `us.example.com` will all get routed to the same endpoint.

For your master environment, this would function as a catch-all domain once you [added the parent domain](/administration/web/configure-project.md#domains) to the project settings.

For development environments, we will also be able to handle this. Here is how:

Let's say we have a project on the EU cluster whose ID is "vmwklxcpbi6zq" and we created a branch called "add-theme". It's environment name will be similar to `add-theme-def123`.  The generated apex domain of this environment will be `add-theme-def123-vmwklxcpbi6zq.eu.platform.sh`. If we have a `http://*.{default}/` route defined, the generated route will be `http://*.add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/`. This means you could put any subdomain before the left-most `.` to reach your application. HTTP request to both `http://foo.add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/` and `http://bar.add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/` URLs will be routed to your application properly. However, request to `http://*.add-theme-def123-vmwklxcpbi6zq.eu.platform.sh/` will not be routed since it is not a legitimate domain name.

Be aware, however, that Let's Encrypt does not support wildcard certificates.  That means if you want to use a wildcard route and protect it with SSL you will need to provide a [custom SSL certificate](/golive/steps.md#ssl-in-production).

> **note**
> In projects created before November 2017 the `.` in subdomains was replaced with a triple dash (`---`).  It was switched to preserve `.` to simplify SSL handling and improve support for longer domains.  If your project was created before November 2017 then it will still use `---` to the left of the environment name.  If you wish to switch to dotted-domains please file a support ticket and we can do that for you.  Be aware that doing so may change the domain name that your production domain name should CNAME to.

## WebSocket routes

To use WebSocket on a route, `cache` must be disabled because WebSocket is incompatible with buffering, which is a requirement of caching on our router.  Here is an example to define a route that serves WebSocket:

```yaml
"https://{default}/ws":
    type: upstream
    upstream: "app:http"
    cache:
        enabled: false
```

## Order of precedence of the routes

When you have more than one route declared you have to keep in mind the order of precedence.
The YAML file is parsed in the order of the declaration and a rule coming next may overwrite a preceding rule.

In the example below:

```yaml
"https://www.domain1.com":
    type: redirect
    to: "https://www.domain2.com"

"https://www.{all}/":
    type: upstream
    upstream: "app:http"
```

when asking for the URL `https://www.domain1.com` there will be no redirect applied as the first half of the file would suggest but rather an application hit and the second rule will also match and override the fist rule.

To have `https://www.domain1.com` redirected to `https://www.domain2.com` you would need to change the order of the rules like this:
```yaml
"https://www.{all}/":
    type: upstream
    upstream: "app:http"
    
"https://www.domain1.com":
    type: redirect
    to: "https://www.domain2.com"

```

