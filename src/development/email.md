# Sending E-Mail

By default only the master environment can send emails. For the non-master environments, you can configure outgoing emails via the [Web Interface](/administration/web/configure-environment.html#settings).

Emails from Platform.sh are sent via a SendGrid-based SMTP proxy. Each Platform.sh project is provisioned as a SendGrid sub-account. These SendGrid sub-accounts are capped at 12k emails per month. You can use `/usr/sbin/sendmail` on your application container to send emails with the assigned SendGrid sub-account. Alternatively, you can use the `PLATFORM_SMTP_HOST` environment variable to use in your SMTP configuration.

We do not guarantee the deliverability of emails, and we do not support white-labeling them. Our SMTP proxy is intended as a zero-configuration, best effort service. If needed, you can instead use your own SMTP server or email delivery service provider. In that case, please bear in mind that TCP port 25 is blocked for security reasons; use TCP port 465 or 587 instead.

> **note**
>
> You may follow the [SPF setup guidelines on SendGrid](https://sendgrid.com/docs/glossary/spf/) to improve email deliverability with our SMTP proxy.

## Enabling/disabling email

Email support can be enabled/disabled per-environment. By default, it is enabled on the `master` environment and disabled elsewhere. That can be toggled in through the web UI or via the command line, like so:

```bash
platform environment:info enable_smtp true

platform environment:info enable_smtp false
```

When SMTP support is enabled the environment variable `PLATFORM_SMTP_HOST` will be populated with the address of the SMTP host that should be used. When SMTP support is disabled that environment variable will be empty.

> **note**
>
> Changing the SMTP status will not take effect immediately. You will need to issue a new _build_, not just a new deploy, for the changes to take effect.

## Sending email in PHP

When you send email, you can simply use the built-in `mail()` function in PHP. The PHP runtime is configured to send email automatically via the assigned SendGrid sub-account. Note that the `From` header is required; email will not send if that header is missing.

Beware of the potential security problems when using the `mail()` function, which arise when using user-supplied input in the fifth (`$additional_parameters`) argument. See the [PHP `mail()` documentation](http://php.net/manual/en/function.mail.php) for more information.

### SwiftMailer

In Symfony, if you use the default `SwiftMailer` service, we recommend the following settings in your `app/config/parameters.yaml`:

```yaml
parameters:
  mailer_transport: smtp
  mailer_host: "%env(PLATFORM_SMTP_HOST)%"
  mailer_user: null
  mailer_password: null
```

If you are using a file spool facility, you will probably need to setup a read/write mount for it in `.platform.app.yaml`, for example:

```yaml
mounts:
  "app/spool":
    source: local
    source_path: spool
```
