---
title: Serve static sites
sidebarTitle: Static site
description: Serve completely static sites like in this example.
---

Static site generators are a popular way to create fast sites.
Because there's no need to wait for responses from servers, the sites may load faster.

As an example, this documentation is built using a tool called Hugo and served by Platform.sh as a static site.
You can see the [entire repository on GitHub](https://github.com/platformsh/platformsh-docs),
including its [app configuration](https://github.com/platformsh/platformsh-docs/blob/main/docs/.platform.app.yaml).

The following example goes through serving a basic static site.

## Define the location of the static files

Most of the time, your static site generator outputs built static files to a specific directory.
It might default to something like `build` or `public`, though you can usually set it as you like.

Start by defining this location as the root for your static site.

```yaml {location=".platform.app.yaml"}
web:
    location:
        '/':
            root: 'public'
```

This means the `public` directory is treated as the root of your website.
So a request to `https://example.com/example.png` looks for `/public/example.png` in your code.

## Define the starting place

You want to define where requests to the root domain are sent.
Do this by defining the index page for your site.

```yaml {location=".platform.app.yaml"}
web:
    location:
        '/':
            ...
            index: ['index.html']
```

This defines what file is served when any directory is requested.
So a request for `https://example.com/example/` looks for `https://example.com/example/index.html`.

## Allow static but not dynamic files

For static sites, you want only scripts that are run client side (JavaScript)
and not scripts on the server (PHP, Python, and so on).
So prevent server-side scripts but still enable files that don't match a specific rule.

```yaml {location=".platform.app.yaml"}
web:
    location:
        '/':
            ...
            scripts: false
            allow: true
```

## Create cache rules

You want to create sensible rules for caching requests for your static files.
For example, you may be publishing new content regularly but not updating images or site files much.

In that case, you might want to cache the text files for a day
but all image files for a longer time for better performance.

```yaml {location=".platform.app.yaml"}
web:
    location:
        '/':
            ...
            expires: 24h
            rules:
                \.(css|js|gif|jpe?g|png|svg)$:
                    expires: 4w
```

## Conserve the server

Because your site is completely static, it doesn't need the server to be running.
Set a background process that blocks the server and conserves resources:

```yaml {location=".platform.app.yaml"}
web:
    commands:
        start: sleep infinity
```

You can also use this place to start small programs,
such as a [script to handle 404 errors](https://community.platform.sh/t/custom-404-page-for-a-static-website/637).

## Complete example

```yaml {location=".platform.app.yaml"}
web:
    location:
        '/':
            # The public directory of the application relative to its root
            root: 'public'
            # The files to look for when serving a directory
            index: ['index.html']
            # Disable server-side scripts
            scripts: false
            allow: true
            # Set caching policy
            expires: 24h
            rules:
                \.(css|js|gif|jpe?g|png|svg)$:
                    expires: 4w
                    
web:
    commands:
        # Run a no-op process that uses no CPU resources since this is a static site
        start: sleep infinity
```
