<!-- shortcode start {{ .Name }} -->
{{ $name := .Get "name" }}
## Define routes

All HTTP requests sent to your app are controlled through the routing and caching you define in a `{{ partial "vendor/configfile" (dict "context" . "config" "routes") }}` file.

The two most important options are the main route and its caching rules.
A route can have a placeholder of `{default}`,
which is replaced by your domain name in production and environment-specific names for your preview environments.
The main route has an `upstream`, which is the name of the app container to forward requests to.

You can enable [HTTP cache]({{ relref . "/define-routes/cache.md" }}).
The router includes a basic HTTP cache.
By default, HTTP caches includes all cookies in the cache key.
So any cookies that you have bust the cache.
The `cookies` key allows you to select which cookies should matter for the cache.{{ if or (eq $name "WordPress") (eq $name "TYPO3") (eq $name "Drupal")}}
Generally, you want the user session cookie, which is included in the example for {{ $name }}.
You may need to add other cookies depending on what additional modules you have installed.{{ end }}

You can also set up routes as [HTTP redirects]({{ relref . "/define-routes/redirects.md" }}).
In the following example, all requests to `www.{default}` are redirected to the equivalent URL without `www`.
HTTP requests are automatically redirected to HTTPS.

If you don't include a `{{ partial "vendor/configfile" (dict "context" . "config" "routes") }}` file, a single default route is used.
This is equivalent to the following:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  upstream: <APP_NAME>:http
```

Where `<APP_NAME>` is the `name` you've defined in your [app configuration](#configure-apps-in-platformappyaml).

The following example presents a complete definition of a main route for a {{ $name }} app:

```bash {configFile="routes"}
{{ readFile ( printf "static/files/fetch/routesyaml/%s" (.Get "template" ) ) }}
```
<!-- shortcode end {{ .Name }} -->
