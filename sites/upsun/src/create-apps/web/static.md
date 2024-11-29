---
title: Serve static sites
sidebarTitle: Static sites
description: Serve completely static sites
---

Static site generators are a popular way to create fast sites.
Because there's no need to wait for responses from servers, the sites may load faster.

To learn how to serve your static site using {{% vendor/name %}},
you can start with the required [minimal app configuration](#minimal-app-configuration) and build on it,
or jump straight to an [example of a complete configuration](#complete-example-configuration).

## Minimal app configuration

To successfully serve a static site using {{% vendor/name %}},
you need to set up a minimal app configuration similar to the following:

```yaml {configFile="app"}
applications:
  myapp:
    # The type of the application to build.
    type: "nodejs:{{% latest "nodejs" %}}"
    source:
      root: "/"
    # The web key configures the web server running in front of your app.
    web:
      locations:
        /:
          # Static site generators usually output built static files to a specific directory.
          # Define this directory (must be an actual directory inside the root directory of your app)
          # as the root for your static site.
          root: "public"
          # Files to consider when serving a request for a directory.
          index:
            - index.html
```

See more information on the required minimal settings:
- [Top-level properties](/create-apps/app-reference/single-runtime-image#primary-application-properties).
- [`web` property](/create-apps/app-reference/single-runtime-image.md#web).
- [`locations` properties](/create-apps/app-reference/single-runtime-image.md#locations).

## Add more features

### Allow static files but not dynamic files on PHP containers

If you have a PHP container,
you might want to enable client-side scripts but disable server-side scripts.

To enable static files that don't match any rule while disabling server-side scripts on a PHP container,
use the following configuration:

```yaml {configFile="app"}
applications:
  myapp:
    # The type of the application to build.
    type: "nodejs:{{% latest "nodejs" %}}"
    source:
      root: "/"
    web:
      locations:
        '/':
          ...
          scripts: false
          allow: true
```

See more information on [`locations` properties](/create-apps/app-reference/single-runtime-image.md#locations).

### Create cache rules

You can create sensible cache rules to improve performance.
For example, if you publish new content regularly without updating images or site files much,
you might want to cache text files for a day but all image files for longer.

To do so, use a configuration similar to the following:

```yaml {configFile="app"}
applications:
  myapp:
    # The type of the application to build.
    type: "nodejs:{{% latest "nodejs" %}}"
    source:
      root: "/"
    web:
      locations:
        '/':
          ...
          expires: 24h
          rules:
            \.(css|js|gif|jpe?g|png|svg)$:
              expires: 4w
```

You can also set a `Cache-Control` header in your rules.
```yaml {configFile="app"}
applications:
  myapp:
    web:
      locations:
        '/':
          ...
          expires: 24h
          rules:
            \.(css|js|gif|jpe?g|png|svg)$:
            headers:
              Cache-Control: "public, max-age=2419200, immutable"
```

If `expires` and a `Cache-Control` header are set, the rule ignores the `expires` and sets only the `Cache-Control` header. For this reason, make sure
to add a `max-age` value, in seconds, for the `Cache-Control` header.

### Conserve the server

Because your site is completely static, it doesn't need the server to be running.
To set a background process that blocks the server and conserves resources,
use the following configuration:

```yaml {configFile="app"}
applications:
  myapp:
    # The type of the application to build.
    type: "nodejs:{{% latest "nodejs" %}}"
    source:
      root: "/"
    web:
      commands:
        start: sleep infinity
```

You can also use this place to start small programs,
such as a [script to handle 404 errors](https://community.platform.sh/t/custom-404-page-for-a-static-website/637).

## Complete example configuration

```yaml {configFile="app"}
applications:
  myapp:
    # The type of the application to build.
    type: "python:{{% latest "python" %}}"
    source:
      root: "/"
    web:
      locations:
        '/':
          # The public directory of the application relative to its root
          root: 'public'
          # The files to look for when serving a directory
          index:
            - 'index.html'
          # Disable server-side scripts
          scripts: false
          allow: true
          # Set caching policy
          expires: 24h
          rules:
            \.(css|js|gif|jpe?g|png|svg)$:
              expires: 4w

      commands:
        # Run a no-op process that uses no CPU resources since this is a static site
        start: sleep infinity
```
