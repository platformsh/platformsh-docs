# Launch

The actual cutover process is quite simple, although the details will vary a little depending on your CDN. In general, all that needs to be done is to point your domain name at the CDN, using the instructions from your CDN provider.  The change will generally be done by changing settings at your domain registrar and adding or updating DNS A and CNAME records.

If you want to use a www. prefix on your site, register a DNS CNAME record to point www.example.com to just example.com.  You can set it up this way regardless of which domain is going to be the primary.  Redirecting users to one or the other can be handled on the Platform.sh side, and should have been set up in advance based on discussion in the onboarding call.

That's it.  It may take some time for the change to propagate through the DNS network; generally speaking a good estimate is twice the time-to-live value.  (That's why it's important to set it as low as possible.)  Some users may see the change immediately, others may take a few hours.

A few days after the launch is complete, the DNS time-to-live can be set back to a higher value.

One week after the site is confirmed up and running, the onboarding Slack channel will be closed.  For support after that please file a ticket through the "Submit ticket" link in the Support menu in the development environment UI.

## Fastly-specific instructions

If Fastly is your CDN, you have the option of using either a [CNAME or a set of Anycast IP addresses](https://docs.fastly.com/guides/basic-configuration/using-fastly-with-apex-domains).  Fastly prefers that you use the CNAME but either work.  If using the Anycast IP addresses, add a new A record for your production domain for each of the IP addresses provided in the onboarding spreadsheet.  Make sure you remove any old records you have for that domain as well.
