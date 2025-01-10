---
title: Redirects
description: |
  Managing redirection rules is a common requirement for web applications, especially in cases where you do not want to lose incoming links that have changed or been removed over time.
---

{{% description %}}

You can manage redirection rules on your {{% vendor/name %}} projects in two different ways, which we describe here. If neither of these options satisfy your redirection needs, you can still implement redirects directly from within your application, which if implemented with the appropriate caching headers would be almost as efficient as using the configuration options provided by {{% vendor/name %}}.

## Whole-route redirects

Using whole-route redirects, you can define very basic routes in your [`{{< vendor/configfile "routes" >}}`](./_index.md) file whose sole purpose is to redirect. A typical use case for this type of route is adding or removing a `www.` prefix to your domain, as the following example shows:

```yaml {configFile="routes"}
https://{default}/:
  type: redirect
  to: https://www.{default}/
```

## Partial redirects

In the [`{{< vendor/configfile "routes" >}}`](./_index.md) file you can also add partial redirect rules to existing routes:

```yaml {configFile="routes"}
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

This format is richer and works with any type of route, including routes served directly by the application.

Two keys are available under `redirects`:

| Key                | Required | Description |
| ------------------ | -------- | ----------- |
| `expires`          | No       | The duration the redirect is cached. Examples of valid values include `3600s`, `1d`, `2w`, `3m`.</br> To disable caching for all your redirects, set `expires` to `0`. You can also [disable caching on a specific redirect](#disable-caching-on-your-redirects). |
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
| `code`             | No       | n/a     | HTTP status code. Valid status codes are `301`, `302`, `307`, and `308`. Defaults to `302`. [More information](#specify-a-http-status-code). |
| `expires`          | No       | Defaults to the `expires` value defined directly under the `redirects` key, but can be fine-tuned. To [disable caching on a specific redirect](#disable-caching-on-your-redirects), set `expires` to `0`. | The duration the redirect is cached for. [More information](#manage-caching).

To set up partial redirects, you can use regular expressions (`regexp`).</br>
Alternatively, and in many cases, you can use the `prefix` and/or `append_suffix` keys to achieve the same results.</br>
Here are some examples to illustrate this and help you choose a method for your partial redirects:

{{< codetabs >}}

+++
title= `regexp`
+++

Consider this `regexp` redirect:

```yaml
'^/from(/.*|)$':
  regexp: true
  to: https://example.com/to$1
```

It achieves the same result as this basic redirect:

```yaml
'/from':
  to: https://example.com/to
```

<--->

+++
title= `prefix`
+++

Consider this redirect using `prefix`:
```yaml
'/from':
  to: https//example.com/to
  prefix: false
```

It achieves the same result as this `regexp` redirect:

```yaml
'^/from$':
  regexp: true
  to: https://example.com/to
```

<--->

+++
title= `append_suffix`
+++

Consider this redirect using `append_suffix`:

```yaml
'/from':
    to: https//example.com/to
    append_suffix: false
```

It achieves the same result as this `regexp` redirect:

```yaml
'^/from(/.*|)$':
    regexp: true
    to: https://example.com/to
```

{{< /codetabs >}}

{{% note theme="warning" title="Warning" %}}

If you're using `regexp` in a redirect, you can't also use `prefix` and `append_suffix`.
Likewise, if you're using `prefix` and `append_suffix`, you can't also use `regexp`.

{{% /note %}}

### Redirects using regular expressions

You can use regular expressions to configure your redirects.

In the following example, a request to `https://example.com/foo/a/b/c/bar` redirects to `https://example.com/a/b/c`:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    paths:
      '^/foo/(.*)/bar':
        to: 'https://example.com/$1'
        regexp: true
```

The following special arguments in the `to` statement are available when `regexp` is set to `true`:

- `$is_args` evaluates to `?` or empty string
- `$args` evaluates to the full query string if any
- `$arg_foo` evaluates to the value of the query parameter `foo`
- `$uri` evaluates to the full URI of the request.

### Redirects using `prefix` and `append_suffix`

Instead of using regular expressions to configure your redirects,
you might want to use the `prefix` and `append_suffix` keys.

{{% note theme="warning" title="Warning" %}}

If you're using `regexp` in a redirect, you can't also use `prefix` and `append_suffix`.
Likewise, if you're using `prefix` and `append_suffix`, you can't also use `regexp`.

{{% /note %}}

When set to `true`, which is their default value, `prefix` and `append_suffix` are equivalent.
For example:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    paths:
      '/from':
        to: 'https://{default}/to'
        prefix: true
```
```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    paths:
      '/from':
        to: 'https://{default}/to'
        append_suffix: true
```

With both configurations:

- `/from` redirects to `/to`
- `/from/some/path` redirects to `/to/some/path`

However, when set to `false`, `prefix` and `append_suffix` behave differently.
For example, with the following configuration:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    paths:
      '/from':
        to: 'https://{default}/to'
        prefix: false
```

A request to `/from/` redirects to `/to/some/path`, but a request to `/from/some/path` does not.

And with the following configuration:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    paths:
      '/from':
        to: 'https://{default}/to'
        append_suffix: false
```

A request to `/from/some/path` (and any path after `/from`) redirects to just `/to`.

### Specify a HTTP status code

To set a specific HTTP status code for your redirect, use the `codes` key:

```yaml {configFile="routes"}
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

In this example, redirects from `/from` use a `308` HTTP status code,
while redirects from `/here` default to `302` ("found", as long as the resource is indeed found as a result from the redirect).

### Manage caching

You can [set an expiration time on your redirects](#set-an-expiration-time-on-your-redirects)
or even [disable caching](#disable-caching-on-your-redirects) on them.

#### Set an expiration time on your redirects

You can specify how long you want your redirects to be cached for.
To do so, use the `expires` key under the `redirects` key.

In the following example, all redirects are cached for two weeks:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    expires: 2w
    paths:
      '/from':
        to: 'https://example.com/'
      '/here':
        to: 'https://example.com/there'
```

If you want to set a different expiration time for a specific redirect,
use the same `expires` key, but under the `paths` key.

In the following example:

- The first redirect uses the default expiration time set on all redirects
  and is cached for two weeks
- The second redirect ignores the default expiration time set on all redirects,
  and is cached for three days instead

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    expires: 2w
    paths:
      '/from':
        to: 'https://example.com/'
      '/here':
        to: 'https://example.com/there'
        expires: 3d
```

{{% note %}}
You can set an expiration time on a specific redirect (under the `paths` key)
even if you haven't defined a default expiration time on all your redirects (under the `redirects` key).

The expiration time you set on a specific redirect (under the `paths` key) overwrites any default expiration time
you may have set on all your redirects (under the `redirects` key).
{{% /note %}}

#### Disable caching on your redirects

To disable caching on all your redirects, set the `expires` key to `0` under the `redirects` key:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    expires: 0
    paths:
      '/from':
        to: 'https://example.com/'
      '/here':
        to: 'https://example.com/there'
```

To disable caching on a specific redirect only,
set the `expires` key to `0` under the relevant path in the `paths` section.

In the following example, caching is disabled on the second redirect only:

```yaml {configFile="routes"}
https://{default}/:
  type: upstream
  # ...
  redirects:
    paths:
      '/from':
        to: 'https://example.com/'
      '/here':
        to: 'https://example.com/there'
        expires: 0
```

## Other redirects

### Application-driven redirects

If neither whole-route or partial redirects satisfy your redirection needs,
you can still implement redirects directly in your application.
If sent with the appropriate caching headers,
this is nearly as efficient as implementing the redirect through one of the two configurations described above.
Implementing application-driven redirects depends on your own code or framework and is beyond the scope of this documentation.

### Query-strings based redirects

{{% vendor/name %}} **does not** support redirects based on query strings.

If you want to redirect based on query strings, this logic has to be implemented by your application.
