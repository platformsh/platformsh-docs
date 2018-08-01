# Going Live - Pre-Launch Checklist

Before you can take your site live there are a few preparation steps to take.

<!--toc-->

## 1. Register a domain name with a supported provider

You have a domain name registered for your site with a Registrar of your choice. The registrar must allow you to use CNAMEs for your domain.  (Some registrars may call these Aliases or similar.). If your domain is currently active elsewhere, the Time-To-Live (TTL) on your domain is set to the lowest possible value in order to minimize transition time.

> **note**
> You will not be able to use a `A` record. Verify your DNS provider supports CNAMES. (If it does not you will want to run away from it anyway). Also you will be much happier if it supports Apex domains (more in the next chapter).

## 2. Test your site!

Make sure your site is running and configured as you want it to be, on your master branch.  In particular, see the [Routes documentation](/configuration/routes.md). You will need your routes configured appropriately before you begin.  Make sure you have turned off [basic-authentication](/administration/web/configure-environment.md) if it was turned on during development.

## 3. Optionally obtain a 3rd party SSL certificate

Platform.sh automatically provides SSL certificates for all sites issued by [Let's Encrypt](https://letsencrypt.org/) at no charge.  In most cases this is sufficient and no further action is necessary.  However, if you want to use a 3rd party SSL certificate to encrypt your production site you can obtain one from any number of 3rd party SSL issuers.  Platform.sh does not charge for using a 3rd party SSL certificate, although the issuer may.

Platform.sh supports all kinds of certificates including domain-validated certificates, extended validation (EV) certificates, high-assurance certificates and wildcard certificates.  The use of HA or EV certificates is the main reason why you may wish to use a third party issuer rather than the default certificate.  You will also need a custom certificate if you use wildcard routes, as Let's Encrypt does not support wildcard certificates.

If you do wish to use a 3rd party certificate, ensure it is purchased and active prior to going live.

---

**Everything Fine? [Go Live](/golive/steps.md).**
