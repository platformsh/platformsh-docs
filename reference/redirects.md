# Redirects

Managing redirection rules is a common requirement for web applications, especially in cases where you do not want to lose incoming links that have changed or been removed over time.

You can manage redirection rules on your Platform.sh projects in three different ways:


## Whole-route redirects

In the [`.platform/routes.yaml`](routes-yaml.html) file you can configure routes whose sole purpose is to redirect.

A typical use case for this type of route is adding or removing a `www.` prefix to your domain, like this:

```yaml
http://{default}/:
    type: redirect
    to: http://www.{default}/
```


## Partial redirects

In the [`.platform/routes.yaml`](routes-yaml.html) file you can also add redirect rules to any existing route:

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

 * `expires`: optional, the duration the redirect will be cached. Examples of valid values include `3600s`, `1d`, `2w`, `3m`.
 * `paths`: the paths to apply redirections to.

Each rule in `paths` is defined by its key describing the expression to match against the
request path and a value object describing both the destination to redirect to and
details about how to handle the redirection. The value object is defined with the following
keys:

 * `to`: required, a partial (`"/destination"` or `"//destination"`) or full URL (`"http://example.com/"`).
 * `regexp`: optional, specifies whether the path key should be interpreted as a PCRE regular expression. Defaults to `false`.
 * `prefix`: optional, specifies whether we should redirect both the path and all its children (`true`) or only the path itself (`false`). Defaults to `true`, but not supported if `regexp` is `true`. For example,

   ```yaml
   http://{default}/:
     # [...]
     redirects:
       paths:
         "/from": { "to": "http://example.com/", partial: true }
   ```
   with `partial` set to `true`, both `/from` and `/from/child/path` will redirect. If `partial` is set to `false` then only `/from` trigger a redirect.
 * `append_suffix`: optional, determines if the suffix is carried over with the redirect. Defaults to `true`, but not supported if `regexp` is `true` or if `prefix` is `false`. Re-using the example from above, if `true` then `/from/child/path` would redirect to `http://example.com/child/path`, otherwise `/from/child/path` would redirect to `http://example.com/`.
 * `code`: optional, HTTP status code. Valid status codes are `301`, `302`, `307`, and `308`. Defaults to `302`.
 * `expires`: optional, the duration the redirect will be cached for. Defaults to the `expires` value defined directly under the `redirects` key, but can be fine-tuned at the path level.

## Application-driven redirects

If none of the above options satisfy your redirection needs, you can still
implement redirects directly in your application. If sent with the appropriate
caching headers, it would be almost as efficient as the options provided by
Platform.sh.

