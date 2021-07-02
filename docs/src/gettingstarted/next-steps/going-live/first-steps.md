---
title: "First steps"
weight: 1
toc: false
aliases:
  - "/gettingstarted/going-live/first-steps.html"
---

Before you take your site live, there are a few steps that will help you prepare the project.

1. **Register your domain and choose a suitable DNS provider**

    If you plan on serving exclusively from a subdomain such as the historically common `www.` subdomain, you will be able use any DNS provider that supports CNAME records. If you wish to use the apex domain, eg. `https://site.com`, with no `www.` subdomain, choose one of the specialized DNS providers that allow you to use [ALIAS or ANAME records](/domains/steps/dns.md). Make sure to do this before moving on to the next steps, as the CLI will reject attempts to add domains that do not allow CNAMEs.

2. **Test your routes**

    Test your application and make sure that all of your routes are functioning as you intended. Consult the [routes](/configuration/routes/_index.md) documentation as well to verify that your `routes.yaml` has been properly written.

    If any [access restrictions](/administration/web/configure-environment.md#http-access-control) have been enabled during development, be sure to remove them as well.

3. **(Optional) Obtain 3rd party SSL if needed**

    Let's Encrypt SSL certificates are automatically issued for Platform.sh projects at no charge to you. If you instead would like to use a [3rd party SSL certificate](/domains/steps/tls.md), make sure that you have purchased it and that it is active prior to going live.

    Additionally, if your application uses [wildcard routes](/domains/steps/tls.md), it will require custom certificates for them. You can manually generate the custom certificates through Let's Encrypt or purchase them separately. We can not automate the generation of these since Let's Encrypt does not support [HTTP challenge](https://letsencrypt.org/docs/challenge-types/) for wildcard certificates.

After you have gone through the following checklist your application is ready to be taken live!

{{< guide-buttons next="I'm ready to go live">}}
