---
title: Configure HTTP access control
description: Learn how to control access to.a given environment using HTTP methods.
keywords:
  - basic authentication
---

When developing your site, you might want to hide your development environments from outside viewers.
Or you may find you have performance issues from [excessive bot access](https://community.platform.sh/t/diagnosing-and-resolving-issues-with-excessive-bot-access/792).
You can control access either with a username and password or by allowing/denying specific IP addresses or networks.
This setting applies to the entire environment.

The settings for a specific environment are inherited by all of its children.
So if you have a `staging` environment and you [branch environments from it](../other/glossary.md#branch),
all of the environments branched from it inherit the same authentication information.

Changing access control triggers a new deploy of the current environment.
The changes don't propagate to child environments until they're [redeployed manually](../development/troubleshoot.md#force-a-redeploy).

## Use a username and password

You can set up one or more combinations of a username and password.
To add a username and password, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

- Select the project where you want to add login details.
- From the **Environment** menu, select an environment.
- Click {{< icon settings >}} **Settings**.
- In the row with **HTTP access control**, click **Edit {{< icon chevron >}}**.
- Click **+ Add Login**.
- Enter the username (login) and password into the given fields.
- Click **Save**.

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform environment:http-access -e <ENVIRONMENT_NAME> --auth <USERNAME>:<PASSWORD>
```

For example, to add the username `name` with the password `12321` to the `test` environment, run:

```bash
platform environment:http-access -e test --auth name:12321
```

{{< /codetabs >}}

## Filter IP addresses

You can control access to environments by allowing or denying specific IP addresses or ranges of IP addresses.
The addresses should be in the [CIDR format](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).
Both`4.5.6.7` and `4.5.6.0/8` are accepted formats.

Note that `allow` entries should come before `deny` entries in case they both match.

For example, the following configuration allows only the IP `198.51.100.0` to access your website.

```txt
198.51.100.0 allow
0.0.0.0/0 deny
```

To control access based on IP address, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

- Select the project where you want to control access.
- From the **Environment** menu, select the environment to control.
- Click {{< icon settings >}} **Settings**.
- In the row with **HTTP access control</strong>, click <strong>Edit {{< icon chevron >}}**.
- Enter the IP addresses or ranges into the **IP addresses** field. Put one address or range per line, followed by a space and then `allow` or `deny`.
- Click **Save**.

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform environment:http-access -e <ENVIRONMENT_NAME> --access allow:<IPS_TO_ALLOW> --access deny:<IPS_TO_DENY>
```

{{< /codetabs >}}
