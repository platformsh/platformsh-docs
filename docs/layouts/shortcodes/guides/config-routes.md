The `routes.yaml` file controls the [routing and caching]({{ relref . "/define-routes/_index.md" }})
for all HTTP requests sent to your app.
Typically you just route all incoming requests to your one app container, where your site lives,
but many more elaborate configurations are possible.

The two most important parts to configure are the main route itself and its caching rules.
A route can have a placeholder of `{default}`,
which is replaced with a branch-specific generated domain name or, in production, your configured domain name.

The route then has an `upstream`, which is the name of the container that it should forward requests to.
Most of the time, you want your app's `name`.

You can (and should) enable the [HTTP cache]({{ relref . "/define-routes/cache.md" }}).
The router includes a basic HTTP cache that obeys the HTTP cache headers produced by your app.
However, by default HTTP caches includes all cookies in the cache key.
So if you have any cookies at all, you can't cache the site.
The `cookies` key allows you to select which cookies should matter for the cache
Generally, you just want the user session cookie, which is included in the example for {{ .Get "name" }}.
You may need to add other cookies depending on what additional modules you have installed.

Routes can also be [HTTP redirects]({{ relref . "/define-routes/redirects.md" }}), either fully or partially.
In the following example, all requests to `www.{default}` are redirected to the equivalent URL without `www`.
You could configure it the other way around if you want.
More complex redirects are also possible.

Don't worry about unencrypted HTTP routes.
All requests on Platform.sh are TLS-enabled and HTTP requests are automatically redirected to HTTPS.

If you don't include a `routes.yaml` file, a single default route is deployed.
This is equivalent to the following:

``` {location=".platform/routes.yaml"}
https://{default}/:
  type: upstream
  upstream: <APP_NAME>:http
```

Where `<APP_NAME>` is the `name` you've defined in your [app configuration](/create-apps/app-reference.md).

You can also create other routes as you like:

{{ $file := printf "static/files/fetch/routesyaml/%s" (.Get "template" ) }}
{{ highlight ( readFile $file ) "yaml" ""}}
