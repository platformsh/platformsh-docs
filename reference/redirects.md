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
      "/regexp/(.*)/matching": { "to": "http://example.com/$1", regexp: true }
```

This format is much richer and works with any type of route, including routes served directly by the application.

Two keys are available under `redirects`:

 * `expires`: optional, the duration the redirect will be cached;
 * `paths`: the paths to apply redirections to.

Each rule in `paths` is made of a key, which is a string or a PCRE regular
expression to match the request path against, and a value object made of the
following keys:

 * `to`: required, a partial (`"/destination"` or `"//destination"`) or full URL (`"http://example.com/"`)
 * `regexp`: optional, determines if the path is a regular expression. Defaults to `false`.
 * `prefix`: optional, determines whether we redirect both the path and all its children (`true`) or only the path by itself (`false`). Defaults to `true`, but not supported if regexp is enabled.

   ```yaml
   http://{default}/:
     # [...]
     redirects:
       paths:
         "/from": { "to": "http://example.com/", partial: true }
   ```
   With `partial` set to `true`, both `/from` and `/from/child/path` will redirect. If `partial` is set to `false` then only `/from` will be matched for redirection. 

 * `append_suffix`: optional, determines if the suffix is carried over with the redirect. Defaults to `true`, but not supported if `regexp` is `true` or if `prefix` is `false`. Re-using the example from above, if `true` then `/from/child/path` would redirect to `http://example.com/child/path`, otherwise `/from/child/path` would redirect to `http://example.com/`.
 * `code`: optional, defaults to `302` (Can be one of `301`, `302`, `307`, `308`)
 * `expires`: optional, the duration the redirect will be cached (defaults to the `expires` value defined directly under the `redirects` key.)

## Application-driven redirects

If none of the above options satisfy your redirection needs, you can still
implement redirects directly in your application. If sent with the appropriate
caching headers, it would be almost as efficient as the options provided by
Platform.sh.

