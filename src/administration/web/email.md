# Sending E-Mail

By default only the master environment can send emails.
For the non-master environments, you can configure outgoing emails via the
[Web Interface](../overview/web-ui/configure-environment.html#settings).

Emails from Platform.sh are sent via a SendGrid-based SMTP proxy.
Each Platform.sh project is provisioned as a SendGrid sub-account.
These SendGrid sub-accounts are capped at 12k emails per month.
You can use `/usr/sbin/sendmail` on your application container to send emails
with the assigned SendGrid sub-account.

We do not guarantee the deliverability of emails, and we do not support white-labeling of them.  Our SMTP proxy is intended as a zero-configuration, best effort service.  If needed, you can instead use your own SMTP server or email delivery service provider. In that case, please bear in mind that TCP port 25 is blocked for security reasons; use TCP port 465 or 587 instead.

> **note**:
> You may follow the
> [SPF setup guidelines on SendGrid](https://sendgrid.com/docs/Glossary/spf.html)
> to improve email deliverability with our SMTP proxy.

## Sending email in PHP

When you send email, you should use the built-in `mail()` function in PHP.
The PHP runtime is configured to send email via the assigned SendGrid sub-account.

In Symfony, if you use the default `SwiftMailer`,
you should set the followings in your `app/config/parameters.yaml`:

```yaml
parameters:
  mailer_transport: mail
  mailer_host: null
  mailer_user: null
  mailer_password: null
```

If you are using a file spool facility, you will probably need
to setup a read/write mount for it in `.platform.app.yaml`

```yaml
mounts:
    "/app/spool": "shared:files/spool"
```
