---
title: Web application firewall (WAF)
sidebarTitle: WAF
description: |
    Enterprise and Elite projects on Platform.sh come with a Web application firewall (WAF) at no additional cost. This WAF monitors requests to your application and blocks suspicious ones. It helps protect your application from attacks such as distributed denial of service (DDos) attacks.
tier:
  - Enterprise
  - Elite
---

{{% description %}}

## HTTP protocol attacks

The Platform.sh WAF implements request filtering rules for common security vulnerabilities on the HTTP protocol. 

### Request smuggling

When a frontend server forwards HTTP requests to a backend server,
it usually sends a series of requests at once.
The backend server then parses the request headers
to determine where one request ends and the next one begins.

The [HTTP protocol](https://tools.ietf.org/html/rfc2616) provides two different headers
to specify where an HTTP request ends: `Content-Length` and `Transfer-Encoding`. 

When the frontend and backend servers don’t agree on which header
they should interpret as the end of a request, attackers can smuggle requests.
If a malicious request is mistakenly included in a legitimate request,
the attacker can bypass the app’s security methods and access sensitive information.

The Platform.sh WAF detects and blocks requests that contain [both the `Content-Length` and `Transfer-Encoding` headers](#ban-on-use-of-content-length-and-transfer-encoding-together).
It also detects and blocks requests that include other features of an attempt to inject a malicious request.
These features are the following:

- a carriage return line feed (CRLF) character or `http/\d`
- and an `HTTP` or `WEBDAV` method name

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

The Platform.sh WAF detects header injection attempts occurring through the payload and the header itself.
Requests containing CRLF characters are blocked so that malicious data isn't returned in a response header
and interpreted by the client.
The Platform.sh WAF also detects `\r` and `n` characters in `GET` request argument values.

### Response splitting

When a user makes an HTTP request, the web server usually returns a single HTTP response.
But when an attacker succeeds in [injecting headers](#header-injection),
they can launch a [response splitting attack](https://www.cs.montana.edu/courses/csci476/topics/http_response_splitting.pdf).

During a response splitting attack, the attacker uses CRLF characters to inject additional HTTP responses into legitimate user requests.
This enables further attacks such as [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting),
web cache poisoning, browser cache poisoning, and cross-user attacks.

To protect your site from response splitting attacks,
the Platform.sh WAF detects and blocks requests containing CRLF characters.

## HTTP protocol enforcement

In addition to protecting your site against [common security vulnerabilities](#http-protocol-attacks),
the Platform.sh WAF implements additional rules to enforce the HTTP protocol. 

### Uniform Resource Identifier (URI) syntax enforcement

[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) defines the generic syntax for URIs.
When the Platform.sh WAF detects a URI with incorrect syntax, the incoming connection is terminated.
The request is then reconstructed on the internal network,
enforcing the valid format in transit.

### Ban on GET requests with a body

The [HTTP specification](https://tools.ietf.org/html/rfc2616) allows for `GET` requests to have a body.
This enables attackers to try and force a request body on unsuspecting applications. 

To prevent such attacks, when the Platform.sh WAF detects a `GET` request, 
it scans the request for a potential `Content-Length` or `Transfer-Encoding` header.

If one of those headers is found and the payload isn't `0` or empty,
all body-related headers are removed from the request.
The request is then passed through otherwise unaltered.

### Ban on use of `Content-Length` and `Transfer-Encoding` together

Per the HTTP specification, requests mustn't contain [both a `Content-Length` and a `Transfer-Encoding` header](https://tools.ietf.org/html/rfc7230#section-3.3.2).
This rule helps protect apps from [request smuggling](#request-smuggling). 

The Platform.sh WAF detects and blocks requests featuring both headers,
and forces requests to use [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)
only on the internal network. 

### Missing/empty host headers

As [routes are mapped](../define-routes/_index.md) based on host names,
the Platform.sh WAF blocks requests with an empty or absent `host` header.

### File upload limit

The Platform.sh WAF enforces a file upload limit.
By default, this limit is set at 250&nbsp;MB.

You can customize the file upload limit by amending your [app configuration](../create-apps/_index.md).
In the [`web.locations` dictionary](../create-apps/app-reference.md#locations), 
add your desired value for the `max_request_size` property.

### File extension restriction

The Platform.sh WAF enforces any file extension restriction you may have defined in your [app configuration](../create-apps/_index.md).

To set up a file extension restriction, 
adjust the [`web.locations` dictionary](../create-apps/app-reference.md#locations).
Set up [rules](../create-apps/app-reference.md#rules) to allow only certain file extensions on a given path.

### Restricted HTTP headers

The following headers are disallowed: `Connection`, `Proxy-Authorization`, `TE`, and `Upgrade`.

### Slowloris DoS attacks

Slowloris DDoS attacks use partial HTTP requests to open connections between a single computer and a targeted web server.
These connections are then kept open for as long as possible to overwhelm the web server.

While Apache web servers are vulnerable to Slowloris attacks, Nginx servers aren't.
Since Platform.sh router services use Nginx processes,
your projects are protected against such attacks.