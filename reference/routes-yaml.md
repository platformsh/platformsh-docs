# `.platform/routes.yaml`
## Configure Routes

Platform.sh allows you to define the routes that will serve your
environments. 

A route describes how an incoming URL is going to be processed by
Platform.sh. The routes are stored into a `routes.yaml` file which
should be added inside the `.platform` folder at the root of your Git
repository.

As you may know, Platform.sh is capable of both managing production
environments, as of generating on-the-fly testing, development
and staging environments. This single configuration file covers
all of this.

If you don't have a `.platform` folder, you need to create one and create the 
`routes.yaml` file:

```bash
$ mkdir .platform
$ touch .platform/routes.yaml
```
## Route templates

The yaml file is composed of a list of templated routes, and their 
configuration. A route  template can look like this: `http://www.{default}/` or 
`https://{default}/blog` where `{default}` will be the fully qualified domain 
name configured for the project. So if our domain would be `example.com` these 
routes will get resolved to : `http://www.example.com/` and 
`https://example.com/blog` for live environment (the Master). 

Platform.sh will also generate for every active environment urls that allow you 
to test that environment, here `{default}` will be replaced with 
`[branch]-[project-id].[region].platform.sh` so for a project with id 
`mswy7hzcuhcjw` on a branch called `refactorcss` hosted in the `us` cluser we 
will get: `http://www-refactorcss-mswy7hzcuhcjw.us.platform.sh/` and 
`https://refactorcss-mswy7hzcuhcjw.us.platform.sh/blog` 

> **note** Platform.sh also supports multiple applications per
> project. Each project has single `routes.yaml` file that defines
> which request will be routed to which application.

## Route configuration
Each route can be configured separately its has the following properties

* `type` can be:
  * `upstream` serves an application
    * It will then also have an `upstream` property which will be the name of 
    the application (as defined in `.platform.app.yaml`) followed by ":php" (see
     examples below).
  * `redirect` redirects to another route
    * It will then be followed by `to` property, this is an HTTP redirection to 
    another route that will be identified by its template (see examples below).
* `cache` controls [caching for the route](cache.html).
* `ssi` controls whether Server Side Includes are enabled.
* `redirects` controls [redirect rules](redirects.html) associated with the route.

> **note** for the moment the upstream is always of this form, ending with 
> ":php" in the  future Platform.sh will support multiple endpoints per 
> application. 


## Routes examples
Here is an example of a `.platform/routes.yaml` file:

```yaml
"http://{default}/":
  type: upstream
  upstream: "frontend:php"
"http://www.{default}/":
  type: redirect
  to: "http://{default}/"
```

In this example we will route both the naked domain, and the www (www being 
redirected to the naked domain) subdomain to an application  we called 
"frontend". We are not doing any HTTPS here. 

In the following example we are not redirecting from the www to the naked domain 
but serving from both:

```yaml
"http://{default}/":
    type: upstream
    upstream: "php:php"

"http://www.{default}/":
    type: upstream
    upstream: "php:php"
```

And here is an example wildcard configuration (see below for details on wildcard
routes):

```yaml
"http://*.{default}/":
    type: upstream
    upstream: "php:php"
```

You can see the [Configuring Multiple 
Applications](/user_guide/reference/platform-app-yaml-multi-app.md) section for a  detailed
 view of how this works with multiple applications in the same project.
 
In the following example we are redirecting the naked domain to http, and http 
to https which isour default. So everything will be served from the naked domain
 with HTTPS. We also activate caching, deactivate SSI (server side includes).

```yaml
http://www.{default}/:
  to: https://{default}/
  type: redirect
http://{default}/:
  to: https://{default}/
  type: redirect
https://{default}/:
  cache:
    cookies:
    - '*'
    default_ttl: 0
    enabled: true
    headers:
    - Accept
    - Accept-Language
  ssi:
    enabled: false
  type: upstream
  upstream: php:php
```

## Configuring routes on the Web Interface

For your convenience routes can also be configured using the web interface in
the [routes section ](overview/web-ui/configure-environment.html#routes) of the 
environment settings .

## CLI Access

You can get a list of the configured routes for an environment by running 
`$ platform  environment:routes`

![Platform Routes Cli](/images/platform-routes-cli.png)

##Defaults
If you do not have a `routes.yaml` file the following default one will be loaded:

```yaml
"http://{default}/":
    type: upstream
    upstream: "php:php"
    cache:
        enabled: true
    ssi:
        enabled: false

"http://www.{default}/":
    type: redirect
    to: "http://{default}/"
```

## Wildcard routes

Platform.sh supports wildcard routes so you can map multiple subdomains to the
same application. This works both for redirect an upstream routes. You can 
simply prefix the route with an `*` (for example `*.example.com`) and 
www.example.com, blog.example.com, us.example.com will all get routed to the
same endpoint. 

For your live environment this would function as a catch-all domain.

For environments that are not mapped to a domain (basically anything else than
a live master) we will also be able to handle this. Here is how:

Let's imagine we have a project on the eu cluster  who's id is 
vmwklxcpbi6zq and we created a branch called "add-theme". Platform.sh will
automatically be able to route to this environment the url 
`http://add-theme-vmwklxcpbi6zq.eu.platform.sh/`. If for example we also defined
a `http://www.{default}/` route, you could visit the following url to see
`http://www---add-theme-vmwklxcpbi6zq.eu.platform.sh/` the same environment. 
 
> **note** notice the triple dash `---` we use as a separator for the subdomain
> this is what replaces the dot `.`.

With a wildcard route this means that you could put anything before the triple 
dashes. In our case if we have a `http://*.{default}/` route, both
`http://foo---add-theme-vmwklxcpbi6zq.eu.platform.sh/` and 
`http://bar---add-theme-vmwklxcpbi6zq.eu.platform.sh/` would work just fine.

If you examine the routes of your application (for example by running
`echo $PLATFORM_ROUTES |base64 --decode` in an SSH session on your environment).
You will see a route such as `https://*---add-theme-vmwklxcpbi6zq.eu.platform.sh/`

[You can find detailed information about caching here](/user_guide/reference/cache.html).