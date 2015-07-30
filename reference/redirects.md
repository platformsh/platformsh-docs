
# Redirects

Managing redirection rules is a common requirement for web applications, especially those that have been around for a while and do not want to lose the benefit of the rich incoming links that they gathered over time.

Redirection rules on Platform.sh can be managed in three different ways:


## Whole-route redirects

In the [`.platform/routes.yaml`](routes-yaml.html) file, you can configure routes that are pure redirects.

A typical use case for this type of route is adding or removing a `www.` prefix to your domain, like this:

```yaml
http://{default}/:
    type: redirect
    to: http://www.{default}/
```


## Partial redirects

In the [`.platform/routes.yaml`](routes-yaml.html) file, you can also add redirect rules to any existing route:

```yaml
http://{default}/:
  # [...]
  redirects:
    expires: 1d
    paths:
      "/from": { "to": "http://example.com/" }
```

This format is much richer, and works with any type of route, including a route that is served directly by an application.

Two keys are available under `redirects`:

 * `expires`: optional, the duration the redirect will be cached;
 * `paths`: the paths to apply redirections to.

Each rule in `paths` is made of a key, that is a string or a PCRE regular expression to match the request path against, and a value object made of the following keys:

 * `to`: required, a partial (`"/toto"` or `"//toto"`) or full URL (`"http://example.com/"`);
 * `regexp`: optional, determines if the path is a regular expression. (Defaults to `false`.)
 * `prefix`: optional, determines if the redirect applies to just the path, or to every children of the path too. (Defaults to `true` if regexp is `false`, not supported when regexp is `true`.)
 * `append_suffix`: optional, determines if the suffix is carried over with the redirect (Defaults to `true` if regexp is `false`, not supported when regexp is `true`.)
 * `code`: optional, defaults to `302` (Can be one of `301`, `302`, `307`, `308`);
 * `expires`: optional, the duration the redirect will be cached, if not present the value at the top level will be take.


## Application-driven redirects

If none of the two other options satisfy your redirection plan, feel free to implement redirects directly in your application. If sent with the appropriate caching headers, it would be almost as efficient as Platform.sh integrated options.
