# Going Live - Example

In this short section we will give you a  very simple, typical example. More involved use-cases (such as site with many domains or multiple applications are simply variations on this).

Suppose your project ID is `abc123` in the US region, and you've registered `mysite.com`.  You want `www.mysite.com` to be the "real" site and `mysite.com` to redirect to it.

## Configure `routes.yaml`

First, configure your `routes.yaml` file like so:

```yaml
"https://www.{default}/":
  type: upstream
  upstream: "app:http"

"https://{default}/":
  type: redirect
  to: "https://www.{default}/"
```

That will result in two domains being created on Platform.sh: `master-def456-abc123.us.platform.sh` and `www---master-def456-abc123.us.platform.sh`.  The former will automatically redirect to the latter.  In the `routes.yaml` file, `{default}` will automatically be replaced with `master-def456-abc123.us.platform.sh`.  In domain prefixes (like `www`), the `.` will be replaced with `---`.

### Set your domain

Now, add a single domain to your Platform.sh project for `mysite.com`.  

Using the CLI type:

```platform domain:add mysite.com```
```platform domain:add www.mysite.com```

You can also use the UI for that.

As soon as you do, Platform.sh will no longer serve `master-def456-abc123.us.platform.sh` at all.  Instead, `{default}` in `routes.yaml` will be replaced with `mysite.com` anywhere it appears when generating routes to respond to. 

### Configure your DNS provider

On your DNS provider, you would create two CNAMEs:

`mysite.com` should be an ALIAS/CNAME/ANAME  to `master-def456-abc123.us.platform.sh`.
`www.mysite.com` should be a CNAME to `master-def456-abc123.us.platform.sh`.

>  Both point to the same name. See the note above regarding how different registrars handle dynamic apex domains.

### Result

So you would understand what is happening under the hood.

An incoming request for `mysite.com` will result in the following:

1. Your browser asks the DNS network for `mysite.com`'s DNS A record (the IP address of this host).  It responds with "it's an alias for `www.master-def456-abc123.us.platform.sh`" (the CNAME) which itself resolves to the A record with IP address "1.2.3.4"  (Or whatever the actual address is). By default DNS requests by browsers are recursive, so there is no performance penalty for using CNAMEs.
3. Your browser sends a request to `1.2.3.4` for domain `mysite.com`.
4. Your router responds with an HTTP 301 redirect to `www.mysite.com` (because in our `routes.yaml` we defined such a redirect).
5. Your browser looks up `www.mysite.com` and, as above, gets an alias for `www.master-def456-abc123.us.platform.sh`, which is IP 1.2.3.4.
6. Your browser sends a request to `1.2.3.4` for domain `www.mysite.com`.  Your router passes the request through to your application which in turn responds with whatever it's supposed to do.

On subsequent requests, your browser will know to simply connect to `1.2.3.4` for domain `www.mysite.com` and skip the rest.  The entire process takes only a few milliseconds.
