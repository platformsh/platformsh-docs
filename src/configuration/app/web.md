# Web

Every application container includes a single web server process (currently Nginx), behind which runs your application.  The `web` key configures the web server, including what requests should be served directly (such as static files) and which should be passed to your application.  The server is extremely flexible, which means that some configurations will be more involved than others.  Additionally, defaults may vary somewhat between different language base images (specified by the `type` key of `.platform.app.yaml`).

The first section on this page explains the various options the file supports.  If you prefer, the later sections include various example configurations to demonstrate common patterns and configurations.

You can also examine the `.platform.app.yaml` files of the provided project templates for various common Free Software applications.  See the various language pages for an index of available examples.

The `web` key defines how the application is exposed to the web (in HTTP). Here we tell the web application how to serve content, including static files, front-controller scripts, index files, index scripts, and so on. We support any directory structure, so the static files can be in a subdirectory and the `index.php` file can be further down.

## Commands

The `commands` key defines the command to launch the application.  For now there is only a single command, `start`, but more will be added in the future.

The `start` key specifies the command to use to launch your application.  That could be running a uwsgi command for a Python application or a unicorn command for a Ruby application, or simply running your compiled Go application.  If the command specified by the `start` key terminates it will be restarted automatically.

```yaml
web:
    commands:
        start: 'uwsgi --ini conf/server.ini'
```

On PHP containers this value is optional and will default to starting PHP-FPM (i.e. `/usr/sbin/php-fpm7.0` on PHP7 and `/usr/sbin/php5-fpm` on PHP5).  On all other containers it should be treated as required.  It can also be set explicitly on a PHP container in order to run a dedicated process such as [React PHP](https://github.com/platformsh/platformsh-example-reactphp) or [AmPHP](https://github.com/platformsh/platformsh-example-amphp). 

Setting `start` to `null` will result in no additional process being started at all.  That can be useful for a container that is only serving static files, as no resources will be consumed by an unused background process.

```yaml
web:
    commands:
        start: null
```

## Upstream

`upstream` specifies how the front server will connect to your application (the process started by `commands.start` above).  It has two keys:

* `socket_family`:
    Default: `tcp`. Describes whether your application will listen on a Unix socket (`unix`) or a TCP socket (`tcp`).
* `protocol`:
    Specifies whether your application is going to receive incoming requests over HTTP (`http`) or FastCGI (`fastcgi`). The default varies depending on which application runtime you're using. Other values will be supported in the future.

On a PHP container with FPM there is almost never a reason to set the `upstream` explicitly, as the defaults are already configured properly for PHP-FPM.  On all other containers the default is `tcp` and `http`.

```yaml
web:
    upstream:
        socket_family: tcp
        protocol: http
```

The above configuration (which is the default on non-PHP containers) will forward connections to the process started by `commands.start` as a raw HTTP request to a TCP port, as though the process were listening to the incoming request directly.

### Socket family

If the `socket_family` is set to `tcp`, then your application should listen on the port specified by the `PORT` environment variable.

If the `socket_family` is set to `unix`, then your application should open the unix socket file specified by the `SOCKET` environment variable. 

If your application isn't listening at the same place that the runtime is sending requests, you'll see *502 Bad Gateway* errors when you try to connect to your web site.



> **Note**
> Gzip compression is enabled only for serving precompressed static files with the ".gz" filename extension.
> However, dynamic content is not automatically compressed due to a [well known security issue](https://en.wikipedia.org/wiki/BREACH_%28security_exploit%29).



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
