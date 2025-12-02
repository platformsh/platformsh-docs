---
title: Set custom headers on static content
sidebarTitle: Custom headers
description: Set custom headers for your static content such as custom content-types or limits to cross-origin usage.
---

When your app responds to dynamic requests, it can generate headers on the fly.
To set headers for static content, add them in [your `web` configuration](/create-apps/app-reference/single-runtime-image.md#web).

You might want to do so to add custom content-type headers, limit what other sites can embed your content,
or allow cross origin requests.

Say you want to limit most files to be embedded only on your site, but you want an exception for Markdown files.
And you want to serve both Markdown and [AAC](https://en.wikipedia.org/wiki/Advanced_Audio_Coding) files with the
correct content types to avoid
[MIME sniffing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#mime_sniffing).

Start by defining a header for files in general:

```yaml {configFile="app"}
web:
  locations:
    "/":
      ...
      # Apply rules to all static files (dynamic files get rules from your app)
      headers:
        X-Frame-Options: SAMEORIGIN
```

This sets the `X-Frame-Options` header to `SAMEORIGIN` for all static files.
Now your files can only be embedded within your site.

Now set up an exception for Markdown (`*.md`) files using a [rule](/create-apps/app-reference/image-properties/web.md#rules):

```yaml {configFile="app"}
web:
  locations:
    "/":
      #...
      rules:
        \.md$:
          headers:
            Content-Type: "text/markdown; charset=UTF-8"
```

This rule sets an explicit content type for files that end in `.md`.  Because specific rules override the general
heading configuration, Markdown files don't get the `X-Frame-Options` header set before.

{{< note theme="info" title="Setting charset" >}}

By default, [HTTP charset parameters](https://www.w3.org/International/articles/http-charset/index.en) are not sent to the response.
If not set, modern browsers will detect `ISO-8859-1` and likely default to `windows-1252` as this has 32 more international characters.

To set the HTTP charset parameters to your desired charset, you can add ``; charset=UTF-8`` in the `Content-Type` parameters.

{{< /note >}}

Now set a rule for AAC files.

```yaml {configFile="app"}
web:
  locations:
    "/":
      ...
      rules:
        \.aac$:
          headers:
            X-Frame-Options: SAMEORIGIN
            Content-Type: audio/aac
```

This rule sets an explicit content type for files that end in `.aac`. It repeats the rule for `X-Frame-Options` because
the `headers` block here overrides the more general configuration.

So now you have three header configurations:

* `X-Frame-Options: SAMEORIGIN` **and** `Content-Type: audio/aac` for AAC files
* Only `Content-Type: text/markdown` for Markdown files
* Only `X-Frame-Options: SAMEORIGIN` for everything else

## Cross origin requests

To allow cross origin requests, add a `Access-Control-Allow-Origin` header to responses.
You can do so for specific origins or for all origins with a wildcard.

```yaml {configFile="app"}
web:
  locations:
    "/":
      ...
      # Apply rules to all static files (dynamic files get rules from your app)
      headers:
        Access-Control-Allow-Origin: "*"
```

If you use the wildcard value, the headers are modified for each request in the following ways:

* The value of the `Access-Control-Allow-Origin` header is set to the value of the `Origin` request header.
* The `Vary` header is included with a value of `Origin`. See why in the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#access-control-allow-origin).

This is done so that credentialed requests can be supported.
They would otherwise fail CORS checks if the wildcard value is used.

## `Strict_Transport_Security` header

The `Strict_Transport_Security` header returns a value of `max-age=0`
unless you enable [HTTP Strict Transport Security (HSTS)](https://fixed.docs.upsun.com/define-routes/https.html#enable-http-strict-transport-security-hsts)
in your [routes configuration](/define-routes/_index.md).

Note that once HSTS is enabled, configuration capabilities depend
on the [HSTS properties](https://fixed.docs.upsun.com/define-routes/https.html#enable-http-strict-transport-security-hsts)
set in your routes configuration.
For example, the `max-age` value is set to `31536000` by {{% vendor/name %}} and can't be customized.
