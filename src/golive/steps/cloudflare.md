# (Optional) Cloudflare configuration

One of the main features that a modern DNS provider needs to have in order to work well with Platform.sh is somethat that's colloquially known as "Cname Flattening".  This solves the problem of being able to point your "root domain" (example.com) to a domain name (CNAME) rather than an IP address (A record).  [This post](https://blog.cloudflare.com/introducing-CNAME-flattening-rfc-compliant-cnames-at-a-domains-root/) explains it well.

In order to correctly point DNS to your Platform.sh project, you'll need at the very least the master environment CNAME, in other words the domain of your site before you add a custom domain on the management console for that project (or otherwise in the CLI).  This is the value you would get from [Step 2 of the pre-launch checklist](/golive/checklist.md).

Assuming that you are using both a `www.` subdomain as well as the bare domain, you'll want to point both of those DNS entries to the same place. Whether you choose the bare domain version or the www subdomain doesn't make any practical difference, as they both will reach Platform.sh and be handled correctly.

## Enable "Full SSL" option in the Cloudflare admin

Cloudflare also makes it very simple to use their free TLS/SSL service to secure your site via HTTPS, while also being behind their CDN if you so choose.  If you decide to use Cloudflare's CDN functionality in addition to their DNS service, you should be sure to choose the "Full SSL" option in the Cloudflare admin.

This means that traffic to your site is encrypted from the client (browser) to Cloudflare's servers using their certificate, and also between Cloudflare's servers and your project hosting here at Platform.sh, mostly like using your project's Let's Encrypt certificate.

```
# Cloudflare's Full SSL option
		   https                       https
User <---------------> Cloudflare <-------------> Platform.sh
```

The other option known as "Flexible SSL" will cause issues if you intend to redirect all traffic to HTTPS.  The "Flexible SSL" option will use Cloudflare's TLS/SSL certificate to encrypt traffic between your users and the CDN, but will pass requests from the CDN back to your project at Platform.sh via HTTP.  This can make it easy for sites that don't have a TLS/SSL certificate to begin ofering their users a more secure experience, by at the least eliminating the unencrypted attack vector on the the "last mile" to the user's browser.

```
# Cloudflare's Flexible SSL option
		   https                       http
User <---------------> Cloudflare <-------------> Platform.sh
```

This will cause all traffic from Cloudflare to your project to be redirected to HTTPS, which will set off an endless loop as HTTPS traffic will be presented as HTTP to your project no matter what.

In short: *Always use "Full SSL" unless you have a very clear reason to do otherwise*
