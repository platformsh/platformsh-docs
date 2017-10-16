# HTTPS

All environments on Platform.sh support both HTTP and HTTPS automatically.  Production SSL certificates are provided by [Let's Encrypt](https://letsencrypt.org/).  You may alternatively provide your own SSL certificate from a 3rd party issuer of your choice at no charge from us.

> **note**
> Let's Encrypt certificate renewals are attempted each time your environment is deployed. If your project does not receive regular code commits, you will need to manually issue a re-deployment to ensure the certificate remains valid. We suggest that you do so when your project doesn't receive any updates for over 1 month. This can be done by pushing a code change via git or issuing the following command from your **local** environment:
> ```
> NOW=$(date +"%F_%H:%M:%S") && platform variable:set -W -y force-le-renewal $NOW
> ```
> This command sets a [variable](/development/variables.html) for the current branch with the key `force-le-renewal`. The value is the current date and time. You can inspect this variable to know when the last the re-deployment was triggered.

Platform.sh recommends using HTTPS requests for all sites exclusively.  Doing so provides better security, access to certain features that web browsers only permit over HTTPS, and access to HTTP/2 connections on all sites which can greatly improve performance.

How HTTPS redirection is handled depends on the routes you have defined.  Platform.sh recommends specifying all HTTPS routes in your `routes.yaml` file.  That will result in all pages being served over SSL, and any requests for an HTTP URL will automatically be redirected to HTTPS.

```yaml
"https://{default}/":
    type: upstream
    upstream: "app:http"

"https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

Specifying only HTTP routes will result in duplicate HTTPS routes being created automatically, allowing the site to be served from both HTTP and HTTPS without redirects.

Although Platform.sh does not recommend it, you can also redirect HTTPS requests to HTTP explicitly to serve the site over HTTP only.  The use cases for this configuration are few.

```yaml
"http://{default}/":
    type: upstream
    upstream: "app:http"

"http://www.{default}/":
    type: redirect
    to: "http://{default}/"

"https://{default}/":
    type: redirect
    to: "http://{default}/"

"https://www.{default}/":
    type: redirect
    to: "http://{default}/"
```

Of course, more complex routing logic is possible if the situation calls for it.  However, we recommend defining HTTPS routes exclusively.
