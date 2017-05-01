# Web

The `web` key defines how the application is exposed to the web (in HTTP). Here we tell the web application how to serve content, including static files, front-controller scripts, index files, index scripts, and so on. We support any directory structure, so the static files can be in a subdirectory and the `index.php` file can be further down.

> **Note**
> Gzip compression is enabled only for serving precompressed static files with the ".gz" filename extension.
> However, dynamic content is not automatically compressed due to a [well known security issue](https://en.wikipedia.org/wiki/BREACH_%28security_exploit%29).

It has the following subkeys:

## Commands

The `commands` key defines the command to launch the application.

It has a few subkeys listed below:

* `start`: The command used to launch the application. This can be a string or *null* if the application is only made of static files. On PHP containers this value is optional and will default to starting PHP-FPM (i.e. `/usr/sbin/php-fpm7.0` on PHP7 and `/usr/sbin/php5-fpm` on PHP5).

*Example*

```yaml
web:
    commands:
        start: 'uwsgi --ini conf/server.ini'
```

## Upstream

`upstream` is an optional key that describes how your application listens to requests and what protocol it speaks.

The following subkeys can be defined:
* `socket_family`:
    Default: `tcp`. Describes whether your application will listen on a Unix socket (`unix`) or a TCP socket (`tcp`).
* `protocol`:
    Specifies whether your application is going to receive incoming requests over HTTP (`http`) or FastCGI (`fastcgi`). The default varies depending on which application runtime you're using. Other values will be supported in the future.


*Example*

```yaml
web:
    upstream:
        socket_family: tcp
        protocol: http
```

The above block will instruct the container to pass incoming requests to your application as straight HTTP over a TCP socket.

### Socket family

The value of the `socket_family` key controls whether your application will
receive requests over a Unix socket or a network socket.

If it's set to `unix`, the runtime will set the `SOCKET` environment variable
to contain the path to the socket where you should configure your application to
listen.

If it's set to `tcp`, the runtime will set the `PORT` environment variable with
the port where you should configure your application to listen.

If your application isn't listening at the same place that the runtime is
sending requests, you'll see *502 Bad Gateway* errors when you try to
connect to your web site.

## Locations

The `locations` key allows you to provide specific parameters for different URL prefixes. Each entry's key is an absolute URI path (with leading `/`) and its value includes the configuration directives for that path.  That is, if your domain is `example.com` then `'/'` means "requests for `example.com/`", while `'/admin'` means "requests for `example.com/admin`".

*Example*

```yaml
web:
    locations:
        '/':
            ...
        '/sites/default/files':
            ...
```

It has a few subkeys listed below:

* `root`:
    The folder from which to serve static assets for this location
    relative to the application root. The application root is the directory
    in which the `.platform.app.yaml` file is located.  Typical values for this
    property include `public` or `web`.  Setting it to `''` is not recommended,
    and its behavior may vary depending on the type of application.  Absolute
    paths are not supported.
* `passthru`:
    Whether to forward disallowed and missing resources from this location to
    the application and can be true, false or an absolute URI path (with leading
    `/`). The default value is `false`. For non-PHP applications it will
    generally be just `true` or `false`.  In a PHP application this will typically
    be the front controller such as `/index.php` or `/app.php`.  This entry
    works similar to `mod_rewrite` under Apache.  Note: If the value of
    `passthru` does not begin with the same value as the location key it is
    under, the passthru may evaluate to another entry. That may be useful when
    you want different cache settings for different paths, for instance, but
    want missing files in all of them to map back to the same front controller.
    See the example block below.
* `index`:
    The file or files to consider when serving a request for a directory and can
    be a file name, an array of file names, or *null*. (Typically `index.html`).
    Note that in order for this to work, access to the static file(s) named
    must be allowed by the `allow` or `rules` keys for this location.
* `expires`:
    How long to allow static assets from this location to be cached (this
    enables the `Cache-Control` and `Expires` headers) and can be a time or *-1*
    for no caching (default). Times can be suffixed with "ms" (milliseconds), "s"
    (seconds), "m" (minutes), "h" (hours), "d" (days), "w" (weeks), "M"
    (months, 30d) or "y" (years, 365d).
* `scripts`:
    Whether to allow loading scripts in that location (*true* or *false*).
* `allow`:
    Whether to allow serving files which don't match a rule (*true* or *false*,
    default: *true*).
* `rules`:
    Specific overrides for a specific location. The key is a PCRE (regular
    expression) that is matched against the full request path. Below is a list of
    example regular expressions that you could use to provide rules:
    *\\.css$,\\.js$,\\.gif$,\\.jpe?g$,\\.png$,\\.tiff?$,\\.wbmp$,\\.ico$,\\.jng$,\\.bmp$,\\.svgz?$,\\.midi?$,\\.mpe?ga$,\\.mp2$,\\.mp3$,\\.m4a$,\\.ra$,\\.weba$,\\.3gpp?$,\\.mp4$,\\.mpe?g$,\\.mpe$,\\.ogv$,\\.mov$,\\.webm$,\\.flv$,\\.mng$,\\.asx$,\\.asf$,\\.wmv$,\\.avi$,\\.ogx$,\\.swf$,\\.jar$,\\.ttf$,\\.eot$,\\.woff$,\\.otf$,/robots\\.txt$*.

## [Example] A basic `web` block for PHP

```yaml
web:
    locations:
        '/':
            root: 'public'
            passthru: '/index.php'
            index:
                - index.php
            # No caching for static files.
            # (Dynamic pages use whatever cache headers are generated by the program.)
            expires: -1
            scripts: true
            allow: true
            rules:
                # Disallow .mp4 files specifically.
                \.mp4$:
                    allow: false
                    expires: -1
        # Set a 5 min expiration time for static files here; a missing URL
        # will passthru to the '/' location above and hit the application
        # front-controller.
        '/images':
            expires: 300
            passthru: true
            allow: false
            rules:
                # Only allow static image files from the images directory.
                '\.(jpe?g|png|gif|svgz?|ico|bmp)$':
                    allow: true
```

## [Example] Advanced rewrite rules

Rules blocks support regular expression capture groups that can be referenced in a passthru command.  For example, the following configuration will result in requests to `/project/123` being seen by the application as a request to `/index.php?projectid=123` without causing a redirect.  Note that query parameters present in the request are unaffected and will, unconditionally, appear in the request as seen by the application.

```yaml
web:
    locations:
        '/':
            root: 'public'
            passthru: '/index.php'
            index:
                - index.php
            scripts: true
            allow: true
            rules:
                '^/project/(?<projectid>.*)$':
                    passthru: '/index.php?projectid=$projectid'
```

## Top level document roots

Platform.sh requires that the document root not be at the root of the project.  It is important for security that
private file mounts are not web-accessible.
