# Sending E-Mail

By default only the master environment can send emails.
For the non-master environments, you can configure outgoing emails via the
[Web Interface](../overview/web-ui/configure-environment.html#settings).

Emails from Platform.sh are sent via a SendGrid-based SMTP proxy.
Each Platform.sh project is provisioned as a SendGrid sub-account.
These SendGrid sub-accounts are capped at 12k emails per month.
You can use `/usr/sbin/sendmail` on your application container to send emails
with the assigned SendGrid sub-account.

Alternatively, you may use your own SMTP server.
In this case, use port 465 / 587 since port 25 is blocked for security reasons.

> **note**:
> If you need to adopt SPF for improving email deliverability, please read
> [SPF setup guidelines on SendGrid](https://sendgrid.com/docs/Glossary/spf.html).

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
