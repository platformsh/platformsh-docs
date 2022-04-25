---
title: Configure HTTP access control
description: Learn how to control access to.a given environment using HTTP methods.
---

When developing your site, you might want to hide your development environments from outside viewers.
Or you may find you have performance issues from [excessive bot access](https://community.platform.sh/t/diagnosing-and-resolving-issues-with-excessive-bot-access/792).
You can control access either with a username and password or by allowing/denying specific IP addresses or networks.

The settings for a specific environment are inherited by all of its children.
So if you have a `staging` environment and you [branch environments from it](../../other/glossary.md#branch),
all of the environments branched from it inherit the same authentication information.

Changing access control triggers a new deploy of the current environment.
The changes don't propagate to child environments until they're [redeployed manually](../../development/troubleshoot.md#force-a-redeploy).

## Use a username and password

You can set up one or more combinations of a username and password.
To add a username and password, follow these steps:

{{< codetabs >}}

---
title=In the console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project where you want to add login details.</li>
  <li>From the <strong>Environment</strong> menu, select an environment.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>In the row with <strong>HTTP access control</strong>, click <strong>Edit {{< icon chevron >}}</strong>.</li>
  <li>Click <strong>+ Add Login</strong>.</li>
  <li>Enter the username (login) and password into the given fields.</li>
  <li>Click <strong>Save</strong>.</li>
</ol>

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
title=In the console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project where you want to control access.</li>
  <li>From the <strong>Environment</strong> menu, select the environment to control.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>In the row with <strong>HTTP access control</strong>, click <strong>Edit {{< icon chevron >}}</strong>.</li>
  <li>Enter the IP addresses or ranges into the <strong>IP addresses</strong> field. Put one address or range per line, followed by a space and then <code>allow</code> or <code>deny</code>.</li>
  <li>Click <strong>Save</strong>.</li>
</ol>

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
