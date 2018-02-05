# (Optional) Cloudflare configuration

One of the main features that a modern DNS provider needs to have in order to work with Platform.sh is somethat that's colloquially known as "CName Flattening".  This solves an age-old problem (in internet years) - being able to point your "root domain" to a domain name rather then an IP address.  [This post](https://blog.cloudflare.com/introducing-cname-flattening-rfc-compliant-cnames-at-a-domains-root/) explains it well.

## Prevent the infinite redirect loop

Cloudflare offers a bit of a relief from the headache of setting up HTTPS behind a CDN with "flexible SSL".  That means that your site can use Cloudflare's SSL cert to encrypt the traffic from user to Cloudflare (remember, cloudflare is sitting in between your users and your website's server).  Traffic from Cloudflare to your website then travels unencrypted over plain old HTTP.  This is "suboptimal", but it does alleviate some of the attack vectors on your users.

```
Cloudflare's "Flexible SSL" option
        HTTPS                   HTTP
User ----->----> Cloudflare ----->----> "Origin" server (your website)
```

The effect of this setting on your site is that while you may request a page over HTTPS, the origin (your platform.sh application) receives a request over HTTP, which it then attempts to redirect to HTTPS and accidentally kicks off a redirect loop.

The solution - _always enable "Full SSL" in Cloudflare_.