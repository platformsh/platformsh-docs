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

Emails from Platform.sh are sent via a Mandrill-based SMTP proxy. Each
Platform.sh project is provisioned as a Mandrill sub-account. Note that Mandrill sub-accounts are capped at 12k emails per month.

> **see also**
> [Configure outgoing emails via the Web Interface](../overview/web-ui/configure-environment.html#settings)
