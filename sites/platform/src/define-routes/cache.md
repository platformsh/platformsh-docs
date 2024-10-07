---
title: HTTP cache
weight: 2
description: |
  {{% vendor/name %}} supports HTTP caching at the server level. Caching is enabled by default, but is only applied to `GET` and `HEAD` requests.
---

{{% description %}}

The cache can be controlled using the `cache` key in your `{{< vendor/configfile "routes" >}}` file.

If a request can be cached, {{% vendor/name %}} builds a cache key from several request properties and stores the response associated with this key.
When a request comes with the same cache key, the cached response is reused.

When caching is on...

* you can configure cache behavior for different location blocks in your `{{< vendor/configfile "app" >}}`;
* the router respects whatever cache headers are sent by the application;
* cookies bypass the cache;
* responses with the `Cache-Control` header set to `Private`, `No-Cache`, or `No-Store` aren't cached.

You should _not_ use the {{% vendor/name %}} HTTP cache if you're using [Varnish](../add-services/varnish.md) or an external CDN
such as [Fastly](../domains/cdn/fastly.md) or [Cloudflare](../domains/cdn/cloudflare.md).
Mixing cache services together most likely results in caches that are stale and can't be cleared.
For more details, see [best practices on HTTP caching](/learn/bestpractices/http-caching.md).

## Basic usage

The HTTP cache is enabled by default, however you may wish to override this behavior.

To configure the HTTP cache, add a `cache` key to your route. You may like to start with the defaults:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  upstream: myapp:http
  cache:
    enabled: true
    default_ttl: 0
    cookies: ['*']
    headers: ['Accept', 'Accept-Language']
```

## Example

In this example, requests are cached based on the URI, the `Accept` header, `Accept-Language` header, and `X-Language-Locale` header.
Any response that lacks a `Cache-Control` header is cached for 60 seconds.
The presence of any cookie in the request disables caching of that response.

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  upstream: myapp:http
  cache:
    enabled: true
    headers: ['Accept', 'Accept-Language', 'X-Language-Locale']
    cookies: ['*']
    default_ttl: 60
```

## How it works

### The cache key

If a request can be cached, {{% vendor/name %}} builds a cache key from several request properties and stores the response associated with this key. When a request comes with the same cache key, the cached response is reused.

There are two parameters that let you control this key: `headers` and `cookies`.

The default value for these keys are the following:

```yaml {configFile="routes"}
https://{default}/:
  # ...
  cache:
    enabled: true
    cookies: ['*']
    headers: ['Accept', 'Accept-Language']
```

### Duration

The cache duration is decided based on the `Cache-Control` response header value. If no `Cache-Control` header is in the response, then the value of `default_ttl` key is used.

### Conditional requests

Conditional requests using `If-Modified-Since` and `If-None-Match` are both supported. The web server doesn't honor the `Pragma` request header.

### Cache revalidation

When the cache is expired (indicated by `Last-Modified` header in the response) the web server sends a request to your application with `If-Modified-Since` header.

If the `If-None-Match` header is sent in the conditional request when `Etag` header is set in the cached response, your application can extend the validity of the cache by replying `HTTP 304 Not Modified`.

### Flushing

The HTTP cache doesn't support a complete cache flush, but you can invalidate the cache by setting `cache: false`. Alternatively, the cache clears on a rebuild, so triggering a rebuild (pushing a new commit) effectively causes a complete cache flush.

## Cache configuration properties

### `enabled`

Turns the cache on or off for a route.

{{< note title="none">}}
**Type:** Boolean

**Required:** Yes

**Values**
* `true`: enable the cache for this route [default, but only if the `cache` key isn't actually specified]
* `false`: disable the cache for this route
{{< /note >}}

### `headers`

Adds specific header fields to the cache key, enabling caching of separate responses for those headers.

For example, if the `headers` key is the following, {{% vendor/name %}} caches a different response for each value of the `Accept` HTTP request header only:

```yaml {configFile="routes"}
https://{default}/:
  # ...
  cache:
    enabled: true
    headers: ["Accept"]
```

{{< note title="none">}}
**Type:** List

**Values:**
* `['Accept', 'Accept-Language']`: Cache on Accept & Accept-Language [default]
{{< /note >}}

#### Header behaviors

The cache is only applied to `GET` and `HEAD` requests. Some headers trigger specific behaviors in the cache.

Header field | Cache behavior
-------------|----------------
`Cache-Control`|Responses with the `Cache-Control` header set to `Private`, `No-Cache`, or `No-Store` aren't cached. All other values override `default_ttl`.
`Vary`|A list of header fields to be taken into account when constructing the cache key. Multiple header fields can be listed, separated by commas. The Cache key is the union of the values of the Header fields listed in Vary header, and whatever is listed in the `{{< vendor/configfile "routes" >}}` file.
`Set-Cookie`|Not cached
`Accept-Encoding`, `Connection`, `Proxy-Authorization`, `TE`, `Upgrade`|Not allowed, and throws an error
`Cookie`|Not allowed, and throws an error. Use the `cookies` value, instead.
`Pragma`|Ignored

A full list of HTTP headers is available on [Wikipedia](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields).

### `cookies`

The `cookies` key allows you to define a list of cookies you want to include in the cache key, if any.

| Possible values          | Description                                                                           | Default |
|--------------------------|---------------------------------------------------------------------------------------|---------|
| `['*']`                  | Any request with a cookie bypasses the cache.</br></br> Note that this is achieved by {{% vendor/name %}} adding the `X-Platform-Cache: BYPASS` HTTP header in the router, and that the same behaviour applies if the `Set-Cookie` header is present. | Yes |
| `[]`                     | Ignore all cookies.                                                                   | No |
|`['cookie_1','cookie_2']` | A list of allowed cookies to include in the cache key. All other cookies are ignored. | No |

#### Example with a single value

With the following configuration, the cache key depends on the value of the `foo` cookie in the request.
Other cookies are ignored.

```yaml {configFile="routes"}
https://{default}/:
  # ...
  cache:
    enabled: true
    cookies: ["foo"]
```

#### Example with a regular expression

A cookie value can also be a regular expression.
An entry that begins and ends with a `/` is interpreted as a PCRE regular expression to match the cookie name.
For example:

```yaml {configFile="routes"}
https://{default}/:
  # ...
  cache:
    enabled: true
    cookies: ['/^SS?ESS/']
```

This configuration causes all cookies beginning with `SESS` or `SSESS` to be part of the cache key, as a single value.
Other cookies are ignored for caching.

If your site uses a session cookie as well as third-party cookies, say from an analytics service,
this is the recommended approach.

### `default_ttl`

Defines the default time-to-live for the cache, in seconds, for non-static responses, when the response doesn't specify one.

The cache duration is decided based on the `Cache-Control` response header value. If no `Cache-Control` header is in the response, then the value of `default_ttl` is used. If the application code returns a `Cache-Control` header or if your `{{< vendor/configfile "app" >}}` file is configured to set a cache lifetime, then this value is ignored in favor of the application headers.

The `default_ttl` only applies to **non-static responses**, that is, those generated by your application.

To set a cache lifetime for static resources configure that in your [app configuration](/create-apps/app-reference/single-runtime-image.md#locations).
All static assets have a Cache-Control header with a max age defaulting to 0 (which is the default for `expires`).

{{< note title="none">}}
**Type:** integer

**Values:**
* `0`: Do not cache [default]. This prevents caching, _unless_ the response specifies a `Cache-Control` header value.
{{< /note >}}

## Debugging

{{% vendor/name %}} adds an `X-Platform-Cache` header to each request which show whether your request is a cache `HIT`, `MISS` or `BYPASS`. This can be useful when trying to determine whether it's your application, the HTTP cache, or another proxy or CDN which isn't behaving as expected.

If in doubt, disable the cache using `cache: false`.

## Advanced caching strategies

### Cache per route

If you need fine-grained caching, you can set up caching rules for several routes separately:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  upstream: myapp:http
  cache:
    enabled: true

https://{default}/foo/:
  type: upstream
  upstream: myapp:http
  cache:
    enabled: false

https://{default}/foo/bar/:
  type: upstream
  upstream: myapp:http
  cache:
    enabled: true
```

With this configuration, the following routes are cached:

-   `https://{default}/`
-   `https://{default}/foo/bar/`
-   `https://{default}/foo/bar/baz/`

And the following routes are **not** cached:

-   `https://{default}/foo/`
-   `https://{default}/foo/baz/`

{{< note >}}
Regular expressions in routes are **not** supported.
{{< /note >}}

### Allowing only specific cookies

Some applications use cookies to invalidate cache responses, but expect other cookies to be ignored.
This is a case of allowing only a subset of cookies to invalidate the cache.

```yaml {configFile="routes"}
https://{default}/:
  # ...
  cache:
    enabled: true
    cookies: ["MYCOOKIE"]
```

### Cache HTTP and HTTPS separately using the `Vary` header

Set the Vary header to `X-Forwarded-Proto` [custom request header](/development/headers.md) to render content based on the request protocol (i.e. HTTP or HTTPS). By adding `Vary: X-Forwarded-Proto` to the response header, HTTP and HTTPS content would be cached separately.

### Cache zipped content separately

Use `Vary: Accept-Encoding` to serve different content depending on the encoding. Useful for ensuring that gzipped content isn't served to clients that can't read it.
