
Replace with
https://docs.google.com/a/commerceguys.com/document/d/1-Z1H_WHBf69rS5H9h0IhKFwK50KkZm-4sDq5_o9ZX3Q/edit#

.. _faq_drupal_security:

Drupal Security Issue FAQ
=========================




For website customers

Why is the site blocked?
------------------------

If you are trying to get to a web site and see this message, Platform.sh has blocked your request. 

 Due to a critical security breach in Drupal core, this url is blocked until the necessary security patch has been applied. 

This is because the site you are trying to reach has a security vulnerability, 
and Platform.sh is blocking insecure requests until the site receives its security upgrade. 
This block does not mean you are at risk or your request will cause damage - 
this is a preventative measure. 

Once the security upgrade takes place, this message will disappear and 
the site will return to normal. 


For website owners 


Do I really need to pay attention to security updates? 
------------------------------------------------------
If you run Drupal, you always need to upgrade when core is patched. And you need to do that as soon as possible. Not keeping your system up-to-date can compromise your customer service. 

For more information, see the Drupal security advisories page <https://www.drupal.org/security>.
The Drupal security team regularly test for vulnerabilities and post their findings on the advisory page. 


I can't upgrade because I can't afford to have downtime. 
--------------------------------------------------------
Few sites have maintenance windows - the web is a 24/7 kind of place. Arrange for a few minutes of downtime as soon as possible. News of new exploits travels across the Internet within hours. 

Have you arranged a maintenance window for the Drupal site? If so, you could wait to upgrade then. You hae to balance the risk of damage of a security compromise against a few minutes downtime. 


What if the upgrade breaks my site? 
-----------------------------------
the security upgrade itself is a simple process. Platform.sh makes it easy to clone a site, apply the upgrade and test. 
Assuming you have a good set of automated tests, the testing process can be complete in minutes. 





There is a planned Drupal security release that will be taking place on Wednesday, October 15th 2014. 


Back everything up first
Download your modules to the directory you have your modules installed in (usually either /modules or /sites/all/modules) which will overwrite the versions you already have*
Run update.php from your browser


Why am I seeing 

Will it affect me?
------------------
Yes. This is one of the rare patches that needs to be applied to all Drupal sites.

I’m panicking. Should I panic now? Or later? Or both?
While this announcement may sound worrisome, there’s no need to panic. It’s a rather simple procedure to fix, and we’re here to help you resolve this situation. We have a plan.

When will it affect me?
-----------------------
When the patch is released. We will be sending notifications via email and the @platformsh twitter account.

Why is this happening to me?
----------------------------
Drupal does regular security reviews for just this type of situation: They want to be sure that there are no major issues that will affect the community.

What are you doing to protect me? What do I need to do?
-------------------------------------------------------
In preparation for this release, here’s how we are responding, and how you can be ready when the patch is available:

**Enterprise Platform** customers and customers who subscribe to Platform **Enterprise Support** packages or **Application Support** customers:
Your site will be patched immediately following the release. You can make yourself a drink and toast to your enterprise coverage.

**Standard Platform customers**:
You will need to apply the patch to your site. We will be sending you an email tomorrow when the patch is available with instructions on how to do this in case you aren’t sure how.

We’ve chosen to automatically block URL’s hosted on the platform in order to prevent attacks for our production customers until your patch can be applied. 
On your development environment, it will specify that there is a security risk that should be addressed. 
On production environments, it will simply state that access is unavailable at this time.

What if I have a problem or can’t apply my patch?
-------------------------------------------------
We’re here to support you.  If you have any issues, give us a shout.




