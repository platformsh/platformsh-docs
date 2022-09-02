---
title: Set custom headers on static content
sidebarTitle: Custom headers
description: Set custom headers for your static content such as custom content-types or limits to cross-origin usage.
---

When your app responds to dynamic requests, it can generate headers on the fly.
To set headers for static content, add them in [your `web` configuration](../app-reference.md#web).

You might want to do so to add custom content-type headers, limit what other sites can embed your content,
or allow cross origin requests.

Say you want to limit most files to be embedded only on your site,
but you want an exception for MP3 files.
And you want to serve both MP3 and MP4 files with the correct content types to avoid [MIME sniffing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#mime_sniffing).

Start by defining a header for files in general:

```yaml {location=".platform.app.yaml"}
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

Now set up an exception for MP3 files using a [rule](../app-reference.md#rules):

```yaml {location=".platform.app.yaml"}
web:
    locations:
        "/":
            ...
            rules:
                \.mp3$:
                    headers:
                      Content-Type: audio/mpeg
```

This rule sets an explicit content type for files that end in `.mp3`.
Because specific rules override the general heading configuration,
MP3 files don't get the `X-Frame-Options` header set before.

Now set a rule for MP4 files.

```yaml {location=".platform.app.yaml"}
web:
    locations:
        "/":
            ...
            rules:
                \.mp4$:
                    headers:
                        X-Frame-Options: SAMEORIGIN
                        Content-Type: video/mp4
```

This rule sets an explicit content type for files that end in `.mp4`.
It repeats the rule for `X-Frame-Options`
because the `headers` block here overrides the more general configuration.

So now you have three header configurations:

* `X-Frame-Options: SAMEORIGIN` **and** `Content-Type: video/mp4` for MP4 files
* Only `Content-Type: audio/mpeg` for MP3 files
* Only `X-Frame-Options: SAMEORIGIN` for everything else

## Cross origin requests

To allow cross origin requests, add a `Access-Control-Allow-Origin` header to responses.
You can do so for specific origins or for all origins with a wildcard.

```yaml {location=".platform.app.yaml"}
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
