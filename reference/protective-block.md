# Protective block

The [Platform.sh](https://platform.sh) service has a protective blocking
feature that, under certain circumstances, restricts access to web sites
with security vulnerabilities. We use this partial blocking method to
prevent exploitation of known security vulnerabilities.

## The Platform.sh security block

Outdated software often contains known vulnerabilities that can be
exploited from the Internet. Sites that can be exploited are protected
by [Platform.sh](https://platform.sh). The system partially blocks
access to these sites.

## How the protective block works

[Platform.sh](https://platform.sh) maintains a database of signatures of
known security vulnerabilities in open-source software that are commonly
deployed on our infrastructure. The security check only analyze known
vulnerabilities in open-source projects like Drupal, Symfony or
Wordpress. It cannot examine customizations written by
[Platform.sh](https://platform.sh) customers.

We analyze the code of your application:

-   When you push new code to Git
-   Regularly when new vulnerabilities are added to our database

If a vulnerability deemed as critical is detected in your application,
[Platform.sh](https://platform.sh) is going to reject the Git push.


We run two types of blocks:

For production websites, we run a "partial block" that allows the site
to stay mostly online. Depending on the nature of the vulnerability,
parts of a request, such as a query string, cookies or any additional
headers, may be removed from GET requests. All other requests may be
blocked entirely - this could apply to logging in, form submission or
product checkout.

For development websites, we run complete blocks, and the error message
gives you detailed information about the vulnerability.

Unblocking is automated upon resolution of the security risk. The block
is removed soon after a customer applies a security upgrade and removes
the vulnerability.

## Opting out of the protective block

The protective block is there to protect you against known vulnerability
in the software you deploy on [Platform.sh](https://platform.sh).

If nonetheless you want to opt out of the protective block, you simply
need to specify it in your `.platform.app.yaml` like this. :

    preflight:
       enabled: false

You can also explicitly opt-out of some specific check like this. :

    preflight:
       enabled: true
       ignore_rules: [ "drupal:SA-CORE-2014-005" ]
