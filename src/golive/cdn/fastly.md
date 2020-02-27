# Fastly configuration

In some cases you may want to opt to use a CDN such as Fastly rather than the Platform.sh router's cache.  Using a CDN can offer a better time-to-first-byte for cached content across a wider geographic region at the cost of the CDN service.

A Fastly CDN is included for Platform.sh Dedicated instances.  Platform.sh does not offer an integrated CDN on self-service Grid projects at this time, but it is a common choice for customers to self-configure.

Launching a Platform.sh site with Fastly in front of it is nearly the same as launching normally.  There are only two notable differences.

Note that individual applications may have their own Fastly setup instructions or additional modules.  Consult the documentation for your application for specific details.

## Set the Platform.sh domain on Fastly

Rather than create a DNS CNAME for your Platform.sh master branch (for instance `master-7rqtwti-qwertyqwerty.eu.platform.sh`), [configure Fastly](https://docs.fastly.com/guides/basic-configuration/working-with-domains) to respond to requests for your domain name and to treat the Platform.sh master branch as its backend server.  Be sure to enable TLS for the backend connection to Platform.sh.  Then configure your DNS to point your domain at Fastly instead.  See the [Fastly documentation](https://docs.fastly.com/guides/basic-configuration/connecting-to-origins) for further details.

## DNS TXT records

If using the Fastly CDN that is included with a Platform.sh Enterprise subscription, You will need to obtain a DNS TXT record from your Customer Support Engineer prior to going live.  You will need to enter that as a DNS TXT record with your domain registrar.  This step should be done well in advance of the actual go-live.

## Anycast

You have the option of using either a [CNAME or a set of Anycast IP addresses](https://docs.fastly.com/guides/basic-configuration/using-fastly-with-apex-domains).  Fastly prefers that you use the CNAME but either work.  If using the Anycast IP addresses on a Dedicated production environment, open a support ticket with the new A records to provide to our support team.
