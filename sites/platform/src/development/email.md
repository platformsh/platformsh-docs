---
title: Send email from your {{% vendor/name %}} environment using an SMTP proxy
weight: 9
sidebarTitle: Email
description: Configure outgoing email for your {{% vendor/name %}} environment, improve deliverability with SPF and DKIM, and send test messages using the built-in SMTP proxy.
keywords:
  - send email
  - SMTP proxy
  - outgoing email
  - SPF
  - DKIM
---

You can configure your {{% vendor/name %}} environments to send emails through an SMTP proxy.

Emails aren't guaranteed to be deliverable and you can't white-label them.
The SMTP proxy is intended as a zero-configuration, best-effort service.

{{< note >}}

Each preview environment (a development or staging environment) has its own SendGrid sub-user.
The 12,000 email credits per calendar month limit applies individually per environment, not as a shared pool across your project.

{{< /note >}}

## 1. Turn on outgoing email

You can turn on outgoing email for each environment.
By default, email is turned on for your Production environment and blocked for other environments.

To turn it on for a specific environment, follow these steps:

{{< codetabs >}}

+++
title=In the Console
+++

1. Select the project.
2. Select the environment from the **Environment** menu.
3. Click {{< icon settings >}} **Settings**.
4. On the **General** tab, select the **Enable outgoing emails** checkbox.

To turn off outgoing email, clear the **Enable outgoing emails** checkbox.

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

## 2. (Recommended) Improve deliverability

Improve deliverability of your email with [Sender Policy Framework (SPF)](https://www.twilio.com/docs/sendgrid/glossary/spf).
If you don't have an SPF record, add the following `TXT` record to your domain's DNS records:

```txt
v=spf1 include:sendgrid.net -all
```

Having several, conflicting `TXT` records isn't supported due to [rfc4408 section 3.1.2](https://datatracker.ietf.org/doc/html/rfc4408#section-3.1.2).

If you already have an SPF record, add SendGrid to your existing record.

## 3. (Optional) Validate your email

You can request DomainKeys Identified Mail (DKIM) validation for your domain.

DKIM improves your delivery rate as an email sender.
Learn more about [how DKIM works](https://www.twilio.com/docs/sendgrid/glossary/dkim).

To have DKIM enabled for your domain:

1. Open a [support ticket](/learn/overview/get-support.md) and request the following, replacing `{{< variable "SENDER_EMAIL_ADDRESS" >}}` with the address you send from:

   ```
   subject: DKIM record

   Hello,

   I'd like to request DKIM records to be generated for project {{< variable "PROJECT_ID" >}}. Emails are sent from the address {{< variable "SENDER_EMAIL_ADDRESS" >}}.

   Kind regards
   ```

   {{< note >}}

   The DKIM domain might not be the same as your site domain (but it can be).
   DKIM needs to be generated on the domain of the `SENDER_EMAIL_ADDRESS` you provide above (the *sender* address), not necessarily your site's domain.
   For example, if `SENDER_EMAIL_ADDRESS` is `noreply@media.yourdomain.com`, request DKIM for `media.yourdomain.com`, not `yourdomain.com`.

   Make sure you've sent at least one email before requesting DKIM.

   {{< /note >}}

2. Add the `CNAME` and `TXT` records from the support team's reply to your domain's DNS configuration.

   The reply looks similar to the following:

   ```txt
   em1._domainkey.yourdomain.com        CNAME   em1.domainkey.u99999999.wl999.sendgrid.net
   em12._domainkey.yourdomain.com       CNAME   em12.domainkey.u99999999.wl999.sendgrid.net
   em9999.yourdomain.com        CNAME   u99999999.wl999.sendgrid.net

   yourdomain.com       TXT     v=spf1 include:em9999.yourdomain.com
   ```

   This `TXT` record replaces the generic one from [step 2](#2-recommended-improve-deliverability) — as part of DKIM setup, SendGrid provides a unique SPF record for your domain instead of the generic one.

   Checks for the expected DNS records run every 15 minutes. After SendGrid detects the records, it confirms them automatically — you don't need to take any further action.

   {{< note >}}

   SendGrid rotates DKIM keys on an internal schedule that it doesn't publish.
   It offers no manual rotation option, so the process is entirely transparent to you.

   {{< /note >}}

## 4. Test the email service

To test the email service, use the [CLI](/administration/cli/_index.md) to connect to your app by running `{{% vendor/cli %}} ssh`.
Run the following command:

```bash
printf "From: {{< variable "SENDER_EMAIL_ADDRESS" >}}\nSubject: Test \nThis is a test message" | /usr/sbin/sendmail {{< variable "RECIPIENT_EMAIL_ADDRESS" >}}
```

Replace the variables with actual email addresses as in the following example:

```bash
printf "From: someone@example.com\nSubject: Test \nThis is a test message" | /usr/sbin/sendmail someone@example.net
```

Check the recipient's inbox, including the spam folder — the test message should arrive within a few minutes.

{{% note theme="warning" %}}

When sending emails from your project, **use an address from your sender domain, not an unrelated domain**.
This domain requirement applies even if you don't enable DKIM.
If you do enable DKIM, use the same domain you used for the DKIM request.
Otherwise, the message will be flagged as a spoofing attempt and not be sent.

Also, **make sure to test with real email addresses**. If you send emails to fake domains (such as `example.com`), they fail and hurt your sending reputation. Make sure your test emails are deliverable.

{{< /note >}}

## 5. Send email from your app

You can use `/usr/sbin/sendmail` on your app container to send emails as with the example in the previous step.
Or use the `PLATFORM_SMTP_HOST` environment variable in your SMTP configuration.

When outgoing emails are on, `PLATFORM_SMTP_HOST` is the address of the SMTP host that should be used.
When outgoing emails are off, the variable is empty.

When using `PLATFORM_SMTP_HOST`, send email through port 25 (often the default).
Your emails are proxied through the {{% vendor/name %}} SMTP host and encrypted over port 465
before being sent to the outside world.

The precise way to send email depends on the language and framework you use.
The following examples show PHP and Java.

{{< codetabs >}}

+++
title=PHP
+++

To send email in PHP, you can use the built-in [`mail()` function](https://www.php.net/manual/en/function.mail.php).
The PHP runtime is configured to send email automatically with the correct configuration.
This works even for libraries such as PHPMailer, which uses the `mail()` function by default.

**The `From` header is required**. Your email isn't sent if the header is missing.

Beware of potential security problems when using the `mail()` function.
If you use any input from users in the `$additional_headers` or `$additional_params` parameters,
be sure to sanitize it first.

<--->

+++
title=Java
+++

JavaMail is a Java API used to send and receive email through SMTP, POP3, and IMAP.
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
Remember that TCP port 25 is blocked for security reasons.
Use port 465 or 587 instead to send email to your own external email server.
