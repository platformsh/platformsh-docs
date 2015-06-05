# Cache

## Enable HTTP caching

### Rationale

Many hosting solutions are adding an additional layer (Varnish...) to
handle caching. Platform.sh allows you to enable HTTP caching right at
the web server level.

If you disable caching, Platform.sh serves the files that are stored in
the application directly. For example with Drupal, this means that all
HTTP requests will bootstrap Drupal and query the database. When the
cache is enabled, if the page has been stored in the Nginx cache, it
won't access Drupal.

### Reference

Cache is enabled by default in your `.platform/routes.yaml` file. This
is an example:

```bash
http://{default}/:
    type: upstream
    upstream: php:php
    cache:
        enabled: true
        headers: [ "Accept", "Accept-Language", "X-Language-Locale" ]
        cookies: ["*"]
        default_ttl: 60
```

#### Routes

If you need fine-grained caching, you can set up caching rules for
several routes separately.

Here is an example:

```yaml
http://{default}/:
  type: upstream
  upstream: php:php
  cache:
    enabled: true

http://{default}/foo/:
  type: upstream
  upstream: php:php
  cache:
    enabled: false

http://{default}/foo/bar/:
  type: upstream
  upstream: php:php
  cache:
    enabled: true
```

With this configuration, the following routes are cached:

-   `http://{default}/`
-   `http://{default}/foo/bar/`
-   `http://{default}/foo/bar/baz/`

And the following routes are **not** cached:

-   `http://{default}/foo/`
-   `http://{default}/foo/baz/`

> **note**

> Regular expressions in routes are **not** supported.

#### Cache duration

The cache duration is decided based on the `Cache-Control` response
header value. If no `Cache-Control` header is in the response, then the
`default_ttl` key is used.

#### Cache key

To decide how to cache a response, Platform.sh will build a cache key
depending on several factors and store the response associated with this
key. When a request comes with the same cache key, the response will be
reused. It is similar to the `Vary` header in purpose.

Some parameters let you change this cache key: the `headers` key and the
`cookies` key.

The default value for these keys are the following:

```yaml
cache:
  enabled: true
  headers: ["Accept-Language", "Accept"]
  cookies: ["*"]
```

#### Keys

##### `enabled`

When set to `true`, enable the cache for this route. When set to
`false`, disable the cache for this route.

##### `headers`

The `headers` key defines on which values the cache key must depend.

For example, if the `headers` key is the following:

```yaml
cache:
  enabled: true
  headers: ["Accept"]
```

Then Platform.sh will cache a different response for each value of the
`Accept` HTTP header.

##### `cookies`

The `cookies` key define on which values the cache key must depend.

For example:

```yaml
cache:
  enabled: true
  cookies: ["foo"]
```

The cache key will depend on the value of the `foo` cookie in the
request.

A special case exists if the `cookies` key has the `["*"]` value: it
means that any request with a cookie will bypass the cache. This is the
default value.

##### `default_ttl`

If the response does not have a `Cache-Control` header, the
`default_ttl` key is used to define the cache duration, in seconds. The
default value is `0`.

