# HTTPS

## Let's Encrypt

All environments on Platform.sh support both HTTP and HTTPS automatically.  Production SSL certificates are provided by [Let's Encrypt](https://letsencrypt.org/).  You may alternatively provide your own SSL certificate from a 3rd party issuer of your choice at no charge from us.

> **note**
> Let's Encrypt certificate renewals are attempted each time your environment is deployed. If your project does not receive regular code commits, you will need to manually issue a re-deployment to ensure the certificate remains valid. We suggest that you do so when your project doesn't receive any updates for over 1 month. This can be done by pushing a code change via git or issuing the following command from your **local** environment:
> ```sh
> platform variable:set -W _redeploy "$(date)"
> ```
> This command sets a [variable](/development/variables.html) for the current branch with the key `_redeploy`. The value is the current date and time. You can inspect this variable to know when the last the re-deployment was triggered.
>
> Alternatively, see the [section below](#automatic-certificate-renewal) on automatically redeploying the site in order to renew the certificate.

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

## TLS configuration

Optionally, it's possible to further refine how secure TLS connections are handled on your cluster via the `tls` route property.

```yaml
https://{default}/:
    type: upstream
    upstream: app:http
    tls:
        # ...
```

### `min_version`

Setting a minimum version of TLS will cause the server to automatically reject any connections using an older version of TLS.  While the vast majority of modern browsers will default to TLS 1.2, there are some older browsers that still use insecure older versions of TLS.  Rejecting older versions with known security vulnerabilities is necessary for some security compliance processes.

```yaml
tls:
    min_version: TLSv1.2
```

The above configuration will result in requests using TLS 1.1, TLS 1.0, or older SSL versions to be rejected.  Legal values are `TLSv1.0`, `TLSv1.1`, and `TLSv1.2`.

Note that if multiple routes for the same domain have different `min_version`s specified, the highest specified will be used for the whole domain.

### `strict_transport_security`

HTTP Strict Transport Security (HSTS) is a mechanism for telling browsers to use HTTPS exclusively with a particular website.  You can toggle it on for your site at the router level without having to touch your application, and configure it's behavior from `routes.yaml`.

```yaml
tls:
    strict_transport_security:
        enabled: true
        include_subdomains: true
        preload: true
```

There are three sub-properties for the `strict_transport_security` property:

* `enabled`: Can be `true`, `false`, or `null`.  Defaults to `null`.  If `false`, the other properties wil be ignored.
* `include_subdomains`: Can be `true` or `false`.  Defaults to `false`. If `true`, browsers will be instructed to apply HSTS restrictions to all subdomains as well.
* `preload`: Can be `true` or `false`.  Defaults to `false`.  If `true`, Google and others may add your site to a lookup reference of sites that should only ever be connected to over HTTPS.  Many although not all browsers will consult this list before connecting to a site over HTTP and switch to HTTPS if instructed.  Although not part of the HSTS specification it is supported by most browsers.

If enabled, the `Strict-Transport-Security` header will always be sent with a lifetime of 1 year.  The [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) has more detailed information on HSTS.

Note: If multiple routes for the same domain specify different HSTS settings, the entire domain will still use a shared configuration.  Specifically, if any route on the domain has `strict_transport_security.enabled` set to `false`, HSTS will be disabled for the whole domain.  Otherwise, it will be enabled for the whole domain if at least one such route has `enabled` set to `true`.  As this logic may be tricky to configure correctly we strongly recommend picking a single configuration for the whole domain and adding it on only a single route.

### Client authenticated TLS

In some non-browser applications (such as mobile applications, IoT devices, or other restricted-client-list use cases), it is beneficial to restrict access to selected devices using TLS.  This process is known as client-authenticated TLS, and functions effectively as a more secure alternative to HTTP Basic Auth.

By default, any valid SSL cert issued by one of the common certificate issuing authorities will be accepted.  Alternatively, you can restrict access to SSL certs issued by just those certificate authorities you specify, including a custom authority.  (The latter is generally only applicable if you are building a mass-market IoT device or similar.)  To do so, set `client_authentication` required and then provide a list of the certificates of the certificate authorities you wish to allow.

```yaml
tls:
    client_authentication: "require"
    client_certificate_authorities:
        - !include
            type: string
            path: file1.key
        - !include
            type: string
            path: file2.key
```

In this case, the key files are resolved relative to the `.platform` directory.  Alternatively, the keys can be specified inline in the file:

```yaml
tls:
    client_authentication: "require"
    client_certificate_authorities:
        - |
            -----BEGIN CERTIFICATE-----
            ### Several lines of random characters here ###
            -----END CERTIFICATE-----
        - |
            -----BEGIN CERTIFICATE-----
            ### Several lines of different random characters here ###
            -----END CERTIFICATE-----
```

## Automatic certificate renewal

It is possible to set a variable from a cron task, which in turn will cause the site to redeploy.  If the Let's Encrypt certificate is due to expire in less than one month it will automatically renew at that time.  That makes it feasible to set up auto-renewal of the Let's Encrypt certificate.  The caveat is that, like any deploy, there is a very brief downtime (a few seconds, usually) so it's best to do during off-hours.

You will first need to install the CLI in your application container.  See the section on [API tokens](/gettingstarted/cli/api-tokens.md) for instructions on how to do so.

Once the CLI is installed and an API token configured you can add a cron task to run once a month and set a placeholder variable.  For example:

```yaml
crons:
    renewcert:
        # Force a redeploy at 10 am (UTC) on the 3rd of every month.
        spec: '0 10 3 * *'
        cmd: |
            if [ "$PLATFORM_BRANCH" = master ]; then
                platform variable:set _redeploy "$(date)" --yes --no-wait
            fi
```

The above cron task will run on the 3rd of the month at 10 am (UTC), and, if the current environment is the master branch, it will run `platform variable:set` on the current project and environment.  The `--yes` flag will skip any user-interaction.  The `--no-wait` flag will cause the command to complete immediately rather than waiting for the snapshot to complete.  We recommend adjusting the cron schedule to whenever is off-peak time for your site, and to a random day within the month.

> **warning**
>
> It is very important to include the `--no-wait` flag.  If you do not, the cron process will block waiting on the deployment to finish, but the deployment will be blocked by the running cron task.  That will take your site offline until you log in and manually terminate the running cron task.  You want the `--no-wait` flag.  We're not joking.

The certificate will not renew unless it has less than one month remaining, so forcing a deploy more than once a month is pointless.  As the redeploy does cause a momentary pause in service we recommend running during non-peak hours for your site.
