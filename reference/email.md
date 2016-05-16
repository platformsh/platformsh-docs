# Sending E-Mail

By default only the master environment can send emails and there is no
need to additionally configure your web application to enable that. For
the non-master environment this feature can be enabled by using the
Platform CLI.

For example, in case you want to enable sending emails for your
non-master environment use this command:

```
$ platform environment:metadata enable_smtp true
```

Emails from Platform.sh are sent via a SendGrid-based SMTP proxy. Each
Platform.sh project is provisioned as a SendGrid sub-account. Note that SendGrid
sub-accounts are capped at 12k emails per month.

>**note:** 
> When you send email you should use the `mail` facility. There is no SMTP 
> server running on localhost.

>**note:**
> If you need to adopt SPF for improving email deliverability,
> please read [SPF setup guidelines on SendGrid](https://sendgrid.com/docs/Glossary/spf.html).

For example for Symfony, if you use the default SwiftMailer you
should set in your `app/config/parameters.yaml`:

```yaml
parameters:
  mailer_transport: mail
  mailer_host: null
  mailer_user: null
  mailer_password: null
```

Also note that if you are using a file spool facility you will probably need 
to setup a read/write mount for it in `.platform.app.yaml`

```yaml
mounts:
    "/app/spool": "shared:files/spool"
```


> **see also**
> [Configure outgoing emails via the Web Interface](../overview/web-ui/configure-environment.html#settings)
