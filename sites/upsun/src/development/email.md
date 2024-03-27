---
title: Send email
weight: 9
sidebarTitle: Email
description: Send email from your {{% vendor/name %}} environments.
---

You can configure your {{% vendor/name %}} environments to send emails via an SMTP proxy.

Emails aren't guaranteed to be deliverable and you can't white-label them.
The SMTP proxy is intended as a zero-configuration, best-effort service.

{{< note >}}

All preview environments are limited to 12,000 email credits per calendar month.

{{< /note >}}

## 1. Turn on outgoing email

You can turn on outgoing email for each environment.
By default, email is turned on for your Production environment and blocked for other environments.

To turn it on for a specific environment, follow these steps:

{{< codetabs >}}

+++
title=In the Console
+++

- Select the project with the given environment.
- From the **Environment** menu, select the environment.
- Click {{< icon settings >}} **Settings**.
- In the row with **Outgoing emails**, click **Edit {{< icon chevron >}}**.
- Select the **Email sending** checkbox.

To turn off outgoing email, clear the **Email sending** checkbox.

<--->

+++
title=Using the CLI
+++

To turn on outgoing email, run the following command:

```bash
{{% vendor/cli %}} environment:info --environment {{< variable "ENVIRONMENT_NAME" >}} enable_smtp true
```

To turn off outgoing email, replace `true` with `false`.

{{< /codetabs >}}

Changing the setting rebuilds the environment.

## 2. Recommended: Improve deliverability

Improve deliverability of your email with [Sender Policy Framework (SPF)](https://docs.sendgrid.com/ui/account-and-settings/spf-records).
If you don't have an SPF record, add the following `TXT` record to your domain's DNS records:

```txt
v=spf1 include:sendgrid.net -all
```

Having several, conflicting `TXT` records isn't supported due to [rfc4408 section 3.1.2](https://datatracker.ietf.org/doc/html/rfc4408#section-3.1.2).

If you already have an SPF record, please add SendGrid into your existing record.

## 3. (Optional) Validate your email

You can request for DomainKeys Identified Mail (DKIM) to be enabled on your domain.

DKIM improves your delivery rate as an email sender.
Learn more about [how DKIM works](https://docs.sendgrid.com/glossary/dkim).

To have DKIM enabled for your domain:

1. Open a [support ticket](/learn/overview/get-support) with the domain where you want DKIM.
2. Update your DNS configuration with the `CNAME` and `TXT` records that you get in the ticket.

Checks for the expected DNS records run every 15 minutes before validation.

The `TXT` record looks similar to the following:

```txt
v=spf1 include:u17504801.wl.sendgrid.net -all
```

## 4. Test the email service

To test the email service, use the [CLI](../administration/cli/_index.md) to connect to your app by running `{{% vendor/cli %}} ssh`.
Run the following command:

```bash
printf "From: {{< variable "SENDER_EMAIL_ADDRESS" >}}\nSubject: Test \nThis is a test message" | /usr/sbin/sendmail {{< variable "RECIPIENT_EMAIL_ADDRESS" >}}
```

Replace the variables with actual email addresses as in the following example:

```bash
printf "From: someone@example.com\nSubject: Test \nThis is a test message" | /usr/sbin/sendmail someone@example.net
```

In a little while, the test message should arrive at the recipient address.

Be careful to test with real email addresses.
If you send emails to fake domains (such as `example.com`), they fail and hurt your sending reputation.
Make sure your test emails are deliverable.

## 5. Send email from your app

You can use `/usr/sbin/sendmail` on your app container to send emails as with the example in the previous step.
Or use the `PLATFORM_SMTP_HOST` environment variable in your SMTP configuration.

When outgoing emails are on, `PLATFORM_SMTP_HOST` is the address of the SMTP host that should be used.
When outgoing emails are off, the variable is empty.

When using `PLATFORM_SMTP_HOST`, send email through port 25 (often the default).
Your emails are proxied through the {{% vendor/name %}} SMTP host and encrypted over port 465
before being sent to the outside world.

The precise way to send email depends on the language and framework you use.
See some examples for given languages.

{{< codetabs >}}

+++
title=PHP
+++

To send email in PHP, you can use the built-in [`mail()` function](https://www.php.net/manual/en/function.mail.php).
The PHP runtime is configured to send email automatically with the correct configuration.
This works even for libraries such as PHPMailer, which uses the `mail()` function by default.

Note that the `From` header is required.
Your email isn't sent if that header is missing.

Beware of potential security problems when using the `mail()` function.
If you use any input from users in the `$additional_headers` or `$additional_params` parameters,
be sure to sanitize it first.

<--->

+++
title=Java
+++

JavaMail is a Java API used to send and receive email via SMTP, POP3, and IMAP.
JavaMail is built into the [Jakarta EE](https://jakarta.ee/) platform, but also provides an optional package for use in Java SE.

[Jakarta Mail](https://projects.eclipse.org/projects/ee4j.mail) defines a platform-independent and protocol-independent framework to build mail and messaging applications.

The following example sends email using Jakarta Mail:

```java
import sh.platform.config.Config;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class JavaEmailSender {

    private static final Logger LOGGER = Logger.getLogger(JavaEmailSender.class.getName());

    public void send() {
        Config config = new Config();
        String to = "";//change accordingly
        String from = "";//change accordingly
        String host = config.getSmtpHost();
        //or IP address
        //Get the session object
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", host);
        Session session = Session.getDefaultInstance(properties);

        //compose the message
        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject("Ping");
            message.setText("Hello, this is example of sending email  ");

            // Send message
            Transport.send(message);
            System.out.println("message sent successfully....");

        } catch (MessagingException exp) {
            exp.printStackTrace();
            LOGGER.log(Level.SEVERE, "there is an error to send an message", exp);
        }
    }
}

```

Guides on using JavaMail:

- [Send email with HTML formatting and attachments](https://mkyong.com/java/java-how-to-send-email/)
- [JavaMail API](https://javaee.github.io/javamail/)

{{< /codetabs >}}

## Alternative: Use a different email server

If you need more options, use your own SMTP server or email delivery service provider.
Bear in mind that TCP port 25 is blocked for security reasons.
Use port 465 or 587 instead to send email to your own external email server.
