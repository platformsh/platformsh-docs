---
title: "HTTP Headers"
weight: 8
description: |
  {{% vendor/name %}} adds a number of HTTP headers to both inbound and outbound messages. Most of your own headers are passed through untouched, but a short list of headers is overwritten or removed so your app can trust them.
sidebarTitle: "Headers"
---

{{% description %}}

## Request headers

{{% vendor/name %}} adds the following HTTP headers to give the application information about the connection. These are stable and may be examined by the application as necessary.

* `X-Forwarded-Proto`: The protocol forwarded to the application, for example: `http`, `https`.
* `X-Client-IP`: The remote IP address of the request.
* `X-Client-SSL`: Set "on" only if the client is using SSL connection, otherwise the header isn't added.
* `X-Original-Route`: The route in `{{< vendor/configfile "routes" >}}` which is used currently, for example: `https://{default}/`.
* `X-Forwarded-For`: The client IP appended to any value sent by the client. When the request comes through a CDN that {{% vendor/name %}} supports, the header is replaced with the end-client IP instead.

## Headers overwritten or removed from requests

{{% vendor/name %}} passes your application's request headers through, with the exceptions below. These headers are set from values {{% vendor/name %}} determines itself, so a client can't spoof them and your application can trust them.

| HTTP header | What happens |
| ----------- | ------------ |
| `Client-Cdn`, `Client-Country`, `Client-Abuse-Score`, `Client-Asn` | Overwritten with the [classification data](#classification-data-headers) computed for the request, or removed when no data is available. Values sent by the client are always discarded. |
| `X-Forwarded-Proto`, `X-Client-IP`, `X-Client-SSL`, `X-Original-Route` | Overwritten with the values described in [request headers](#request-headers). |
| `Host` | Overwritten with the host {{% vendor/name %}} matched the request on, which mitigates a class of attacks based on the `Host` header. |
| `X-Client-Verify`, `X-Client-DN`, `X-Client-Cert` | Any value the client sends is discarded. On HTTPS requests, `X-Client-Verify` is set to `SUCCESS` or `NONE`, and `X-Client-DN` and `X-Client-Cert` are added only when a client certificate was validated on a route that uses [mTLS](/define-routes/https.md#enable-mtls). On plain HTTP requests, none of the three are sent. |
| `Proxy` | Always removed, to protect applications affected by [httpoxy](https://httpoxy.org). |
| `Authorization` | Removed on routes protected by [HTTP access control](/environments/http-access-control.md), because {{% vendor/name %}} consumes the credentials itself. |
| `Connection`, `Keep-Alive`, `Proxy-Authenticate`, `Proxy-Authorization`, `TE`, `Trailers`, `Transfer-Encoding`, `Upgrade` | Not forwarded, as these hop-by-hop headers apply to a single connection. Protocol upgrades such as [WebSocket](/define-routes/_index.md#websocket-routes) requests keep them. |

Repeated headers are also normalized into a single value. Most are joined with a comma and a space, `Cookie` is joined with a semicolon and a space, and headers that aren't lists, such as `Content-Type` or `Authorization`, keep only their first value.

## Response headers

{{% vendor/name %}} adds a number of response headers automatically to assist in debugging connections. These headers should be treated as a semi-private API. Do not code against them, but they may be inspected to help determine how {{% vendor/name %}} handled the request to aid in debugging.

- `X-Platform-Cache`: Either `HIT` or `MISS` to indicate if the router in your cluster served the response from its own cache or if the request was passed through to the application.
- `X-Platform-Cluster`: The ID of the cluster that received the request. The cluster name is formed from the project ID and environment ID.
- `X-Platform-Processor`: The ID of the container that generated the response. The container ID is the cluster ID plus the container name.
- `X-Platform-Router`: The ID of the router that served the request. The router ID is the processor ID of the router container, specifically.
- `X-Debug-Info`: This is a header added by the edge layer. It doesn't contain any sensitive information or anything that could be misused. It has no relation to the PHP debugging tool [Xdebug](https://xdebug.org).

## Headers overwritten or removed from responses

Your application's response headers reach the client unchanged, apart from the following.

| HTTP header | What happens |
| ----------- | ------------ |
| `Server` | Always removed, so the response doesn't advertise the software serving it. |
| `X-Accel-Expires`, `X-Accel-Redirect`, `X-Accel-Limit-Rate`, `X-Accel-Buffering`, `X-Accel-Charset` | Removed and ignored. These control {{% vendor/name %}}'s own infrastructure, so your application can't use them. |
| `Surrogate-Control` | Removed on routes with [server-side includes](/define-routes/ssi.md) enabled, since {{% vendor/name %}} acts on it. |
| `Strict-Transport-Security` | Overwritten when [HSTS](/define-routes/https.md#enable-http-strict-transport-security-hsts) is configured on the route. |
| `X-Robots-Tag` | Overwritten with `noindex, nofollow` when [search engine visibility](/environments/search-engine-visibility.md) is restricted on the environment. |
| `Connection`, `Keep-Alive`, `Proxy-Authenticate`, `Proxy-Authorization`, `TE`, `Trailers`, `Transfer-Encoding`, `Upgrade` | Not forwarded, as these hop-by-hop headers apply to a single connection. Responses to protocol upgrades keep them. |

Repeated response headers are normalized the same way as request headers, so send a single `Content-Type` or `Location` rather than several. `Set-Cookie` is the exception and keeps every value you send.

{{% vendor/name %}} also ignores `Expires` when deciding whether to cache a response. The header still reaches the client, but use `Cache-Control` to control [caching](/define-routes/cache.md).

## Classification data headers

{{% vendor/name %}} sends classification data to your backend system through the following HTTP headers. Each of them is set from {{% vendor/name %}}'s own data, or removed when there's no data for the request, so you can rely on their values even if a client sends its own.

| HTTP header          | Type    | Description                                                                                               |
| -------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `Client-Cdn`         | string  | When a CDN that is supported by {{% vendor/name %}} is used, this header displays its name (Fastly, Cloudflare, or Cloudfront). |
| `Client-Country`     | string  | The two-character ISO 3166-1 country code of the end-client IP (after CDN handling for the CDNs that {{% vendor/name %}} supports).<BR/> The geolocation data sent through this header is provided by [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data).|
| `Client-Abuse-Score` | integer | The abuse score of the end-client IP. A score >= 100 indicates a near certainty that the request comes from an abusive IP. The score can also be negative, so parse it as a signed integer rather than assuming it starts at zero. <BR/> The abuse data sent through this header is provided by [AbuseIPDB](https://www.abuseipdb.com/). |
| `Client-Asn`         | integer | The Autonomous System number of the end-client IP. <BR/> The geolocation data sent through this header is provided by [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data).|

## Custom headers

Apart from those listed above, your application is responsible for setting its own response headers.

You can also [add headers to static files](/create-apps/web/custom-headers.md).
