---
title: Send E-mail
weight: 8
sidebarTitle: E-mail
description: See how to send emails from Platform.sh environments.
---

You can configure your Platform.sh environments to send emails via a SendGrid-based SMTP proxy.
This option is off by default for new environments.

Each Platform.sh project is provisioned as a SendGrid sub-account.
You can use `/usr/sbin/sendmail` on your app container to send emails with the assigned SendGrid sub-account.
Alternatively, you can use the `PLATFORM_SMTP_HOST` environment variable in your SMTP configuration.

Emails aren't guaranteed to be deliverable and you can't white-label them.
The SMTP proxy is intended as a zero-configuration, best-effort service.

If you need more options, use your own SMTP server or email delivery service provider.
Bear in mind that TCP port 25 is blocked for security reasons.
Use TCP port 465 or 587 instead.

{{< note>}}

To improve email deliverability with the SMTP proxy, you can follow SendGrid's SPF setup guidelines
by including the following TXT record in your domain's DNS records:

```txt
>v=spf1 include:sendgrid.net -all
```

{{< /note >}}

## Email domain validation

{{< tiered-feature "Enterprise and Elite" >}}

Enterprise and Elite customers can request for DomainKeys Identified Mail (DKIM) to be enabled on their domain.

DKIM improves the delivery rate as an email sender and can be enabled on Dedicated and Grid sites.

### Enable DKIM on your domain

To have DKIM enabled for your domain:

1. Open a support ticket with the domain where you want DKIM.
2. Update your DNS configuration with the `CNAME` and `TXT` records that you get in the ticket.

Checks for the expected DNS records run every 15 minutes before validation.

{{< note>}}

The TXT record to include your account ID (see [SendGrid's SPF guidelines](https://docs.sendgrid.com/ui/account-and-settings/spf-records))
looks similar to the following:

```txt
>v=spf1 include:u17504801.wl.sendgrid.net -all
```

{{< /note >}}

## Allow/disallow outgoing email

You can allow or disallow outgoing emails for each environment.
By default, they are allowed on your production environment and disallowed elsewhere.

To change whether they are allowed, follow these steps:



{{< codetabs >}}

---
title=In the console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project with the given environment.</li>
  <li>From the <strong>Environment</strong> menu, select the environment.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>In the row with <strong>Outgoing emails</strong>, click <strong>Edit {{< icon chevron >}}</strong>.</li>
  <li>Select or clear the <strong>Email sending</strong> checkbox.</li>
</ol>

<--->

---
title=Using the CLI
file=none
highlight=false
---

To allow emails, run the following command:

```bash
platform environment:info -e <ENVIRONMENT_NAME> enable_smtp true
```

To disallow emails, replace `true` with `false`.

{{< /codetabs >}}

Changing the setting rebuilds the environment.

## SMTP host address

When outgoing emails are allowed,
the `PLATFORM_SMTP_HOST` environment variable has the address of the SMTP host that should be used.
When outgoing emails are disallowed, the variable is empty.

## Ports

- Port 465 and 587 should be used to send email to your own external email server.
- Port 25 should be used to send through `PLATFORM_SMTP_HOST` (this is the default in most mailers).

Your emails are proxied through the Platform.sh SMTP host and encrypted over port 465 before being sent to the outside world.

## Testing the email service

Before testing that the email service is working, make sure that:

- Emails are [allowed](#allowdisallow-outgoing-email) on the environment.
- The environment has been [redeployed](./troubleshoot.md#force-a-redeploy).
- You have accessed the environment using SSH and verified that the `PLATFORM_SMTP_HOST` environment variable is visible.

To test the email service, first connect to your cluster through [SSH](./ssh/_index.md)
using the [CLI](./cli/_index.md) command `platform ssh`.
Run the following command):

```bash
php -r 'mail("<RECIPIENT_EMAIL_ADDRESS>", "test message", "just testing", "From: <SENDER_EMAIL_ADDRESS>");'
```

After a couple of minutes, you should receive the "test message" in your inbox.

## Sending email in PHP

To send email in PHP, you can use the built-in `mail()` function.
The PHP runtime is configured to send email automatically via the assigned SendGrid sub-account.
Note that the `From` header is required.
Your email isn't sent if that header is missing.

Beware of potential security problems when using the `mail()` function.
These arise when using user-supplied input in the `$additional_parameters` parameter.
See the [PHP `mail()` documentation](http://php.net/manual/en/function.mail.php) for more information.

## Sending email in Java

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
