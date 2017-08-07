# Going Live - Pre-Launch Checklist

<!-- toc -->

Before you  go live you should go through the following check-list.

## 1. Register a domain name with a supported provider
You have a domain name registered for your site with a Registrar of your choice. The registrar must allow you to use CNAMEs for your domain.  (Some registrars may call these Aliases or similar.). If your domain is currently active elsewhere, the Time-To-Live (TTL) on your domain is set to the lowest possible value in order to minimize transition time.

> **note**
> You will not be able to use a `A` record. Verify your DNS provider supports CNAMES (if it does not you will want to run away from it anyway). Also You will be much happier if it supports Apex domains (more in the next chapter).

## 2. Note the target address (CNAME) for your DNS configuration
 You have the auto-generated domain for your master branch.  This is the domain you see in "Access site" in the UI.

 ![Master Access](/images/master-access.png)

You can also retrieve this value from the command line by running `platform environment:url` to see a list of all URLs that Platform.sh will serve for the current environment.  
 
 ![Platform Cli Master Url](/images/platform-cli-master-url.png)
 
Write this down. This is what you will be using as the target for the CNAME you will configure with your DNS provider. Note that what you will see there is the URL, so you will need to remove http:// or https:// to get the name of the environment. 


## 3. Test your site!
Make sure your site is running and configured as you want it to be, on your master branch.  In particular, see the [Routes documentation](/configuration/routes.md). You will need your routes configured appropriately before you begin.  Make sure you have turned off [basic-authentication](https://docs.platform.sh/administration/web/configure-environment.html) if it was turned on during development.

> **4.  Optionally configure SSL**
> If you want to use a 3rd party SSL certificate to encrypt your production site, you can obtain one from any number of 3rd party 
> SSL issuers.  Platform.sh automatically provides SSL certificates for all sites issued by [Let's Encrypt](https://letsencrypt.org/) at no charge, and there is no charge for using a 3rd party SSL cert instead.

---

**Everything Fine? [Let's Go Live.](/golive/steps.md)**