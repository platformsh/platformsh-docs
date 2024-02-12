---
title: Redirects
description: |
  Managing redirection rules is a common requirement for web applications, especially in cases where you do not want to lose incoming links that have changed or been removed over time.
---

{{% description %}}

You can manage redirection rules on your {{% vendor/name %}} projects in two different ways, which we describe here. If neither of these options satisfy your redirection needs, you can still implement redirects directly from within your application, which if implemented with the appropriate caching headers would be almost as efficient as using the configuration options provided by {{% vendor/name %}}.

## Whole-route redirects

Using whole-route redirects, you can define very basic routes in your [`{{< vendor/configfile "routes" >}}`](./_index.md) file whose sole purpose is to redirect. A typical use case for this type of route is adding or removing a `www.` prefix to your domain, as the following example shows:

{{< version/specific >}}
<!-- Platform.sh configuration-->
```yaml
https://{default}/:
    type: redirect
    to: https://www.{default}/
```
<--->
<!-- Upsun configuration -->
```yaml
routes:
    https://{default}/:
        type: redirect
        to: https://www.{default}/
```
{{< /version/specific >}}

## Partial redirects

In the [`{{< vendor/configfile "routes" >}}`](./_index.md) file you can also add partial redirect rules to existing routes:

{{< version/specific >}}
<!-- Platform.sh configuration-->
```yaml
https://{default}/:
    # ...
    redirects:
        expires: 1d
        paths:
            '/from':
                to: 'https://example.com/'
            '^/foo/(.*)/bar':
                to: 'https://example.com/$1'
                regexp: true
```
<--->
<!-- Upsun configuration -->
```yaml
routes:
    https://{default}/:
        # ...
        redirects:
            expires: 1d
            paths:
                '/from':
                    to: 'https://example.com/'
                '^/foo/(.*)/bar':
                    to: 'https://example.com/$1'
                    regexp: true
```
{{< /version/specific >}}

This format is richer and works with any type of route, including routes served directly by the application.

Two keys are available under `redirects`:

| Key                | Required | Description |
| ------------------ | -------- | ----------- |
| `expires`          | No       | The duration the redirect is cached. Examples of valid values include `3600s`, `1d`, `2w`, `3m`. |
| `paths`            | Yes      | The paths to be redirected |

Each rule under `paths` is defined by a key describing:
- The expression to match against the request path
- A value object describing both the destination to redirect to, with detail on how to handle the redirection

The value object is defined with the following keys:

| Key                | Required | Default |Description |
| ------------------ | -------- | ----------- | ------------- |
| `to`               | Yes      | n/a     | A relative URL - `'/destination'`, or absolute URL - `'https://example.com/'`. |
| `regexp`           | No       | `false` | Specifies whether the path key should be interpreted as a PCRE regular expression. If you use a capturing group, the replace field (`$1`) has to come after a slash (`/`). [More information](#redirects-using-regular-expressions).|
| `prefix`           | No       | `true`, but not supported if `regexp` is `true` | Specifies whether both the path and all its children or just the path itself should be redirected. [More information](#redirects-using-prefix-and-append_suffix).|
| `append_suffix`    | No       | `true`, but not supported if `regexp` is `true` or if `prefix` is `false`  | Determines if the suffix is carried over with the redirect. [More information](#redirects-using-prefix-and-append_suffix).|
| `code`             | No       | n/a     | HTTP status code. Valid status codes are `301`, `302`, `307`, and `308`. Defaults to `302`. [More information](#using-codes). |
| `expires`          | No       | Defaults to the `expires` value defined directly under the `redirects` key, but can be fine-tuned. | The duration the redirect is cached for. [More information](#using-expires).

### Redirects using regular expressions

You can use regular expressions to configure your redirects.

In the following example, a request to `https://example.com/foo/a/b/c/bar` redirects to `https://example.com/a/b/c`:

{{< version/specific >}}
<!-- Platform.sh configuration-->
   ```yaml
   https://{default}/:
       type: upstream
       # ...
       redirects:
           paths:
               '^/foo/(.*)/bar':
                   to: 'https://example.com/$1'
                   regexp: true
   ```
<--->
<!-- Upsun configuration -->
   ```yaml
   routes:
       https://{default}/:
           type: upstream
           # ...
           redirects:
               paths:
                   '^/foo/(.*)/bar':
                       to: 'https://example.com/$1'
                       regexp: true
   ```
{{< /version/specific >}}

Note that special arguments in the `to` statement are also valid when `regexp` is set to `true`:

- `$is_args` evaluates to `?` or empty string
- `$args` evaluates to the full query string if any
- `$arg_foo` evaluates to the value of the query parameter `foo`
- `$uri` evaluates to the full URI of the request.

### Redirects using `prefix` and `append_suffix`

Instead of using regular expressions to configure your redirects,
you might want to use the `prefix` and `append_suffix` keys to achieve the same results.

{{% note theme="warning" title="Warning" %}}

If you're using `regexp` in a redirect, you can't also use `prefix` and `append_suffix`.
Likewise, if you're using `prefix` and `append_suffix`, you can't also use `regexp`.

{{% /note %}}

In the following example:

{{< version/specific >}}
<!-- Platform.sh configuration-->
   ```yaml
   https://{default}/:
       type: upstream
       # ...
       redirects:
           paths:
               '/from':
                    to: 'https://{default}/to'
                    prefix: true
   ```
<--->
<!-- Upsun configuration -->
   ```yaml
   routes:
       https://{default}/:
           type: upstream
           # ...
           redirects:
               paths:
                   '/from':
                        to: 'https://{default}/to'
                        prefix: true
   ```
{{< /version/specific >}}

With `prefix` set to `true`:
- `/from` redirects to `/to`
- `/from/another/path` redirects to `/to/another/path`

If `prefix` were set to `false`, then `/from` would redirect, but `/from/another/path` wouldn't.

In the following example:

{{< version/specific >}}
<!-- Platform.sh configuration-->
   ```yaml
   https://{default}/:
       type: upstream
       # ...
       redirects:
           paths:
               '/from':
                    to: 'https://{default}/to'
                    append_suffix: false
   ```
<--->
<!-- Upsun configuration -->
   ```yaml
   routes:
       https://{default}/:
           type: upstream
           # ...
           redirects:
               paths:
                   '/from':
                        to: 'https://{default}/to'
                        append_suffix: false
   ```
{{< /version/specific >}}

With `append_suffix` set to `false`, `/from/path/suffix` redirects to just `/to`.

If `append_suffix` were set to `true`, then `/from/path/suffix` would redirect to `/to/path/suffix`.

### Further examples

#### Using `codes`

In the following example using the `codes` key:

{{< version/specific >}}
<!-- Platform.sh configuration-->
```yaml
https://{default}/:
    type: upstream
    # ...
    redirects:
        paths:
            '/from':
                to: 'https://example.com/'
                code: 308
            '/here':
                to: 'https://example.com/there'
   ```
<--->
<!-- Upsun configuration -->
```yaml
routes:
    https://{default}/:
        type: upstream
        # ...
        redirects:
            paths:
                '/from':
                    to: 'https://example.com/'
                    code: 308
                '/here':
                    to: 'https://example.com/there'
```
{{< /version/specific >}}

Redirects from `/from` use a `308` HTTP status code, but redirects from `/here` default to `302`.

#### Using `expires`

The `expires` key defaults to the `expires` value defined directly under the `redirects` key.
However, at this level the expiration of individual partial redirects can be fine-tuned:

{{< version/specific >}}
<!-- Platform.sh configuration-->
   ```yaml
   https://{default}/:
       type: upstream
       # ...
       redirects:
           expires: 1d
           paths:
               '/from':
                   to: 'https://example.com/'
               '/here':
                   to: 'https://example.com/there'
                   expires: 2w
   ```
<--->
<!-- Upsun configuration -->
   ```yaml
   routes:
       https://{default}/:
           type: upstream
           # ...
           redirects:
               expires: 1d
               paths:
                   '/from':
                       to: 'https://example.com/'
                   '/here':
                       to: 'https://example.com/there'
                       expires: 2w
   ```
{{< /version/specific >}}

In the above example, redirects from `/from` are set to expire in one day, but redirects from `/here` are set to expire in two weeks.

## Application-driven redirects

If neither whole-route or partial redirects satisfy your redirection needs,
you can still implement redirects directly in your application.
If sent with the appropriate caching headers,
this is nearly as efficient as implementing the redirect through one of the two configurations described above.
Implementing application-driven redirects depends on your own code or framework and is beyond the scope of this documentation.

## Query-strings based redirect are unsupported

{{% vendor/name %}} does not support redirects based on query strings.

If you want to redirect based on query strings, this logic has to be implemented by your application.
