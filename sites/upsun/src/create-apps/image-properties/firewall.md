---
title: "`firewall`"
weight: 4
description: A firewall dictionary that defines the outbound firewall rules for the application.
---

{{% description %}}

Optional in [single-runtime](/create-apps/app-reference/single-runtime-image.md#primary-application-properties) and [composable](/create-apps/app-reference/composable-image.md#primary-application-properties) images.

This property enables you to set limits in outbound traffic from your app with no impact on inbound requests.

The `outbound` key is required and contains one or more rules.
The rules define what traffic is allowed; anything unspecified is blocked.

Each rule has the following properties where at least one is required and `ips` and `domains` can't be specified
together:

| Name      | Type                | Default         | Description                                                                                                                                                                                                             |
|-----------|---------------------|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ips`     | `string` array  | `["0.0.0.0/0"]` | IP addresses in [CIDR notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). See a [CIDR format converter](https://www.ipaddressguide.com/cidr).                                                      |
| `domains` | `string` array  |                 | [Fully qualified domain names](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) to specify specific destinations by hostname.                                                                                 |
| `ports`   | `integer` array |                 | Ports from 1 to 65535 that are allowed. If any ports are specified, all unspecified ports are blocked. If no ports are specified, all ports are allowed. Port `25`, the SMTP port for sending email, is always blocked. |

The default settings would look like this:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'python:{{% latest "python" %}}'
    source:
      root: "/"
    firewall:
      outbound:
        - ips: [ "0.0.0.0/0" ]
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack: 
      runtimes: [ "python@{{% latest python %}}" ]
    firewall:
      outbound:
        - ips: [ "0.0.0.0/0" ]
```

{{< /codetabs >}}



### Support for rules

Where outbound rules for firewalls are supported in all environments.

### Multiple rules

Multiple firewall rules can be specified.
In such cases, a given outbound request is allowed if it matches _any_ of the defined rules.

So in the following example requests to any IP on port 80 are allowed
and requests to 1.2.3.4 on either port 80 or 443 are allowed:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'python:{{% latest "python" %}}'
    source:
      root: "/"
    firewall:
      outbound:
        - ips: [ "1.2.3.4/32" ]
          ports: [ 443 ]
        - ports: [ 80 ]
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack: 
      runtimes: [ "python@{{% latest python %}}" ]
    firewall:
      outbound:
        - ips: [ "1.2.3.4/32" ]
          ports: [ 443 ]
        - ports: [ 80 ]
```

{{< /codetabs >}}


### Outbound traffic to CDNs

Be aware that many services are behind a content delivery network (CDN).
For most CDNs, routing is done via domain name, not IP address,
so thousands of domain names may share the same public IP addresses at the CDN.
If you allow the IP address of a CDN, you are usually allowing many or all of the other customers hosted behind that
CDN.

### Outbound traffic by domain

You can filter outbound traffic by domain.
Using domains in your rules rather than IP addresses is generally more specific and secure.
For example, if you use an IP address for a service with a CDN,
you have to allow the IP address for the CDN.
This means that you allow potentially hundreds or thousands of other servers also using the CDN.

An example rule filtering by domain:

{{< codetabs >}}

+++
title=Single-runtime image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: 'python:{{% latest "python" %}}'
    source:
      root: "/"
    firewall:
      outbound:
        - protocol: tcp
          domains: [ "api.stripe.com", "api.twilio.com" ]
          ports: [ 80, 443 ]
        - protocol: tcp
          ips: [ "1.2.3.4/29","2.3.4.5" ]
          ports: [ 22 ]
```

<--->

+++
title=Composable image
+++

```yaml {configFile="app"}
applications:
  {{% variable "APP_NAME" %}}:
    type: "composable:{{% latest composable %}}"
    source:
      root: "/"
    stack: 
      runtimes: [ "python@{{% latest python %}}" ]
    firewall:
      outbound:
        - protocol: tcp
          domains: [ "api.stripe.com", "api.twilio.com" ]
          ports: [ 80, 443 ]
        - protocol: tcp
          ips: [ "1.2.3.4/29","2.3.4.5" ]
          ports: [ 22 ]
```

{{< /codetabs >}}


#### Determine which domains to allow

To determine which domains to include in your filtering rules,
find the domains your site has requested the DNS to resolve.
Run the following command to parse your server’s `dns.log` file
and display all Fully Qualified Domain Names that have been requested:

```bash
awk '/query\[[^P]\]/ { print $6 | "sort -u" }' /var/log/dns.log
```

The output includes all DNS requests that were made, including those blocked by your filtering rules.
It doesn't include any requests made using an IP address.

Example output:

```bash
facebook.com
fastly.com
upsun.com
www.google.com
www.upsun.com
```



