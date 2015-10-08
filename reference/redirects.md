# Redirects

Managing redirection rules is a common requirement for web applications,
especially in cases where you do not want to lose incoming links that have
changed or been removed over time. You can manage redirection rules on your
Platform.sh projects in two different ways, which we describe here. If neither
of these options satisfy your redirection needs, you can still implement redirects
directly from within your application, which if implemented with the appropriate caching headers
would be almost as efficient as using the configuration options provided by Platform.sh.

## Whole-route redirects

Using whole-route redirects, you can define very basic routes in your [`.platform/routes.yaml`](routes-yaml.html)
file whose sole purpose is to redirect. A typical use case for this type of route is adding or removing a `www.`
prefix to your domain, as the following example shows:

```yaml
http://{default}/:
    type: redirect
    to: http://www.{default}/
```

## Partial redirects

In the [`.platform/routes.yaml`](routes-yaml.html) file you can also add partial redirect rules
to existing routes:

```yaml
http://{default}/:
  # [...]
  redirects:
    expires: 1d
    paths:
      "/from": { "to": "http://example.com/" }
      "/regexp/(.*)/matching": { "to": "http://example.com/$1", regexp: true }
```

This format is more rich and works with any type of route, including routes served directly by the application.

Two keys are available under `redirects`:

 * `expires`: optional, the duration the redirect will be cached. Examples of valid values include `3600s`, `1d`, `2w`, `3m`.
 * `paths`: the paths to apply redirections to.

Each rule under `paths` is defined by its key describing the expression to match against the
request path and a value object describing both the destination to redirect to with
detail on how to handle the redirection. The value object is defined with the following
keys:

 * `to`: required, a partial (`"/destination"` or `"//destination"`) or full URL (`"http://example.com/"`).
 * `regexp`: optional, defaults to `false`. Specifies whether the path key should be interpreted as
   a PCRE regular expression. In the following example, a request to `http://example.com/regexp/a/b/c/match`
   would redirect to `http://example.com/a/b/c`:

   ```yaml
   http://{default}/:
     type: upstream
     redirects:
       paths:
         "/regexp/(.*)/match":
            to: "http://example.com/$1"
            regexp: true
   ```

 * `prefix`: optional, specifies whether we should redirect both the path and all its children or just the path itself. Defaults to `true`, but not supported if `regexp` is `true`. For example,

   ```yaml
   http://{default}/:
     type: upstream
     redirects:
       paths:
         "/from":
            to: "http://{default}/to"
            partial: true
   ```
   with `partial` set to `true`, `/from` will redirect to `/to` and `/from/another/path` will redirect to `/to/another/path`.
   If `partial` is set to `false` then `/from` will trigger a redirect, but `/from/another/path` will not.
 * `append_suffix`: optional, determines if the suffix is carried over with the redirect. Defaults to `true`, but not supported if `regexp` is `true` or if `prefix` is `false`.
   If we redirect with `append_suffix` set to `false`, for example, then the following

   ```yaml
   http://{default}/:
     type: upstream
     redirects:
       paths:
         "/from":
            to: "http://{default}/to"
            append_suffix: false
   ```
   would result in `/from/path/suffix` redirecting to just `/to`. If `append_suffix` was left on its default value of `true`, then `/from/path/suffix` would have redirected to `/to/path/suffix`.
 * `code`: optional, HTTP status code. Valid status codes are `301`, `302`, `307`, and `308`. Defaults to `302`.
 * `expires`: optional, the duration the redirect will be cached for. Defaults to the `expires` value defined directly under the `redirects` key, but at this level we can fine-tune the expiration of individual partial redirects:

   ```yaml
   http://{default}/:
     type: upstream
     redirects:
       expires: 1d
       paths:
         "/from": { "to": "http://example.com/" }
         "/here": { "to": "http://example.com/there", "expires": "2w" }
   ```
   In this example, redirects from `/from` would be set to expire in one day, but redirects from `/here` would
   expire in two weeks.


## Application-driven redirects

If neither of the above options satisfy your redirection needs, you can still
implement redirects directly in your application. If sent with the appropriate
caching headers, this is nearly as efficient as implementing the redirect through
one of the two configurations described above. Implementing application-driven
redirects depends on your own code or framework and is beyond the scope of this
documentation.

