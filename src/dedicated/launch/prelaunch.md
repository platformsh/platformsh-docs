# Prepare to launch

## Develop your application

Build out your site on your development project, periodically merging it to the `staging` and `production` branches to verify everything still works.  The end of each sprint (if you're working in sprints) is a good time to replicate your site over to staging and production.

> **Your role**
>
> Don't forget to test merge code to the `staging` and `production` branches periodically to ensure they run properly on the Enterprise Cluster!  If anything is amiss or you need to make a configuration change, file a ticket through the Dev control panel so our team can take care of it.  If you update your `routes.yaml`, `services.yaml`, or `.platform.app.yaml` files, include those in the ticket along with a brief description of what you changed so we can update the cluster to match.

## Launch preparations 

When you're close to done with development it's time to start thinking about your go-live plan.  A week or two before you plan to go live do the following:

* Set the time-to-live on your DNS records down to as short as your DNS registrar allows.
* Make sure to avoid scheduling any major updates or social media drivers around the time of your launch.  There will be an overlap period while the DNS change propagates during which some users will get the new site and some the old site, if any, so be prepared for that.
* Make sure your code and data on the production instance are up to date and tested.  That's what you'll be launching, so make it good.
* Open a ticket to schedule a pre-check call with our team where we can go over any last-minute actions needed.
* Check your onboarding spreadsheet for the setup information for your CDN.  Depending on the CDN this may be a series of IP addresses or a domain name to which to add a DNS CNAME record.

## Fastly-specific instructions

* Check that the onboarding spreadsheet has four IP addresses or CNAME information listed for the CDN information.  That will be needed for the go-live process.
* Obtain the DNS TXT record needed for your SSL certificate from your CSE.  You will need to enter that as a DNS TXT record with your domain registrar.  This step should be done well in advance of the actual go-live.
