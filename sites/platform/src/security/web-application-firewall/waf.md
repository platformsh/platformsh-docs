---
title: "{{% vendor/name %}} WAF"
description: Learn how the WAF can help protect your site from distributed denial of service (DDoS) attacks.
weight: 1
banner:
    type: tiered-feature
---

Enterprise and Elite projects on {{% vendor/name %}} come with a web application firewall (WAF) at no additional cost.
This WAF monitors requests to your app and blocks suspicious ones.

All traffic to {{% vendor/name %}} endpoints is also filtered
using a system that takes into account traffic patterns and abuse scores.

{{% note %}}
The {{% vendor/name %}} WAF is not configurable.
If you are looking for more advanced, configurable options that can be added to the {{% vendor/name %}} WAF, see [the Fastly Next-Gen WAF](/security/web-application-firewall/fastly-waf).
{{% /note %}}

## CRLF injection prevention

Carriage return and line feed (CRLF) injection occurs when an attacker injects a CRLF character sequence to manipulate HTTP requests.
CRLF injection can lead to [request smuggling](#request-smuggling),
[header injection](#header-injection), and [response splitting](#response-splitting) attacks.

To protect your app from such attacks, the WAF detects and blocks requests containing CRLF character sequences.

### Request smuggling

When a frontend server forwards HTTP requests to a backend server,
it usually sends a series of requests at once.
The backend server then parses the request headers
to determine where one request ends and the next one begins.

The [HTTP protocol](https://tools.ietf.org/html/rfc2616) provides two different headers
to specify where an HTTP request ends: `Content-Length` and `Transfer-Encoding`.

When the frontend and backend servers don’t agree on which header they should interpret as the end of a request,
attackers can smuggle requests. If a malicious request is injected, the backend server may misinterpret the boundaries
of the individual requests within the concatenated request, thereby processing a request differently from what was
intended. This can lead to various security risks such as data leakage, privilege escalation, and even remote code
execution.

The WAF detects and blocks requests that contain [both the `Content-Length` and `Transfer-Encoding` headers](#content-length-and-transfer-encoding-headers-together).
It also detects and blocks requests that include **both** of the following features of an attempt to inject a malicious request:

- A [CRLF character](#crlf-injection-prevention) or `http/\d`
- An `HTTP` or `WEBDAV` method name

### Header injection

During a header injection attack, the attacker tricks your app
into inserting extra HTTP headers into legitimate HTTP responses.
These attacks can happen when HTTP response headers are generated based on user input.

Header injection attacks can have various impacts,
including cookie injection, [cross-origin resource sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) header injection,
and bypassing your content security policy.
Such attacks enable [response splitting](#response-splitting),
which in turn can lead to [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting),
web cache poisoning, and so on.

The WAF detects header injection attempts occurring through the payload and the header itself.
By [blocking requests containing CRLF](#crlf-injection-prevention) character sequences,
the WAF prevents malicious data from being returned in a response header and interpreted by the client.

### Response splitting

When a user makes an HTTP request, the web server usually returns a single HTTP response.
But when an attacker succeeds in [injecting headers](#header-injection),
they can launch a [response splitting attack](https://www.cs.montana.edu/courses/csci476/topics/http_response_splitting.pdf).

During a response splitting attack, the attacker uses CRLF characters to inject additional HTTP responses into legitimate user requests.
This enables further attacks such as [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting),
web cache poisoning, browser cache poisoning, and cross-user attacks.

As the WAF [blocks requests containing CRLF](#crlf-injection-prevention) character sequences,
your app is protected from response splitting attacks.

## HTTP protocol enforcement

In addition to protecting your site against [CRLF injection-related](#crlf-injection-prevention) attacks,
the WAF implements additional rules to enforce the HTTP protocol.

### Uniform Resource Identifier (URI) syntax

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) defines the generic syntax for URIs.
When the WAF detects a URI with incorrect syntax, the incoming connection is terminated.
The request is then reconstructed on the internal {{% vendor/name %}} network,
enforcing the valid format in transit.

### File upload limit

The WAF enforces a file upload limit.
By default, this limit is set at 250&nbsp;MB.

You can customize the file upload limit by amending your [app configuration](../../create-apps/_index.md).
In the [`web.locations` dictionary](/create-apps/app-reference/single-runtime-image.md#locations),
add your desired value for the `max_request_size` property.

### File extension restriction

The WAF enforces any file extension restriction you may have defined in your [app configuration](../../create-apps/_index.md).

To set up a file extension restriction,
adjust the [`web.locations` dictionary](/create-apps/app-reference/single-runtime-image.md#locations).
Set up [rules](/create-apps/app-reference/single-runtime-image.md#rules) to allow only certain file extensions on a given path.

### Disallowed requests and headers

#### `GET` requests with a body

The [HTTP specification](https://tools.ietf.org/html/rfc2616) allows for `GET` requests to have a body.
This enables attackers to try and force a request body on unsuspecting applications,
which could result in a [request smuggling attack](#request-smuggling).

To prevent such attacks, when the WAF detects a `GET` request,
it scans the request for a potential `Content-Length` or `Transfer-Encoding` header.

If one of those headers is found and the payload isn't `0` or empty,
all body-related headers are removed from the request.
The request is then passed through otherwise unaltered.

#### `Content-Length` and `Transfer-Encoding` headers together

According to the [HTTP specification](https://tools.ietf.org/html/rfc2616),
requests mustn't contain [both a `Content-Length` and a `Transfer-Encoding` header](https://tools.ietf.org/html/rfc7230#section-3.3.2).
This rule helps protect apps from [request smuggling](#request-smuggling).

The WAF detects and blocks requests featuring both headers
and forces requests to use [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
only on the internal {{% vendor/name %}} network.

#### Missing or empty `host` headers

As [routes are mapped](../../define-routes/_index.md) based on host names,
the {{% vendor/name %}} WAF blocks requests with an empty or absent `host` header.

#### Other restricted HTTP headers

The following headers are disallowed: `Connection`, `Proxy-Authorization`, `TE`, and `Upgrade`.

## Slowloris DDoS attack prevention

Slowloris DDoS attacks use partial HTTP requests to open connections between a single computer and a targeted web server.
These connections are then kept open for as long as possible to overwhelm the web server.

While Apache web servers are vulnerable to Slowloris attacks, Nginx servers aren't.
Since {{% vendor/name %}} router services use Nginx processes,
your projects are protected against such attacks.
