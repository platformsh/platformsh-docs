---
title: "Blackfire"
description: |
  Platform.sh recommends [Blackfire.io](https://blackfire.io/). Blackfire is a full continuous observability solution (monitoring, profiling, and automated performance testing tool). It can be used in the development Integration, Staging, and Production environments. Blackfire supports PHP and Python.
---

{{< description >}}

{{< youtube bS4dzuzkir0 >}}

It grants details information on your PHP code's resources consumption across Wall-Time, CPU, I/O, Memory, Network Calls, HTTP requests and SQL queries.

In addition, it can profile your code automatically and notify you whenever your code does not comply with best practices for PHP, Symfony, Drupal, eZPlatform, Typo3 & Magento code performance management.

For a high level overview and demo of Blackfire, check out the [full video tutorial](https://www.youtube.com/watch?v=-5icUW9pUH8).

## Version

Check the latest versions of the probe and CLI tool on [Blackfire's documentation](https://blackfire.io/docs/up-and-running/upgrade#latest-versions).

## On a Grid plan

### 1. Get your credentials

**Sign up for the free 15 days Premium trial** at [Blackfire.io](https://blackfire.io/pricing) and install the **Blackfire Companion** web browser extension ([Chrome](https://chrome.google.com/webstore/detail/blackfire-companion/miefikpgahefdbcgoiicnmpbeeomffld) or [Firefox](https://addons.mozilla.org/firefox/addon/blackfire/)).


{{< note >}}
Blackfire also offers a perpetually-free edition but it is for local development only and will not run on Platform.sh.
{{< /note >}}

Go to your Dashboard and create a new environment [under the Environments tab](https://blackfire.io/my/environments).

![Blackfire environments](/images/integrations/blackfire/blackfire-environments.png "0.4")

### 2. Enable Blackfire

Follow [the step-by-step instructions](https://blackfire.io/docs/integrations/paas/platformsh) to enable Blackfire on your PHP or Python applications.

## On a Dedicated cluster

**Sign up for the free 15 days Premium trial** at [blackfire.io](https://blackfire.io/pricing) and install the **Blackfire Companion** web browser extension ([Chrome](https://chrome.google.com/webstore/detail/blackfire-companion/miefikpgahefdbcgoiicnmpbeeomffld) or [Firefox](https://addons.mozilla.org/firefox/addon/blackfire/)).

### Dedicated Generation 3
Define new Project Variables with your Blackfire Server ID, Server Token, Client ID and Client Token.

```env
env:BLACKFIRE_SERVER_ID = ...
```
```env
env:BLACKFIRE_SERVER_TOKEN = ...
```
```env
env:BLACKFIRE_CLIENT_ID = ...
```
```env
env:BLACKFIRE_CLIENT_TOKEN = ...
```

### Other Dedicated Infrastructure

Open a support ticket with the Backfire Server ID, Server Token, Client ID, Client Token. Our support team will install it for you.

Note, Blackfire integration works only on profiling your cluster via the URL to the origin. Do not profile your site going through the CDN.

## Profiling web requests

Access your site via your browser and click `Profile` in the Blackfire Companion.

![Blackfire Companion](/images/integrations/blackfire/blackfire-companion.png "0.3")

That's it! Your site will be profiled and you should get all the results in your Blackfire account.

## Profiling CLI commands

To profile your PHP CLI scripts, use the following command line:

```bash
blackfire --config /etc/platform/$USER/blackfire.ini <command>
```

## Going further with Blackfire

Blackfire also enables to:

* [monitor your applications](https://blackfire.io/docs/monitoring-cookbooks/index) and get instant and [actionable insights](https://blackfire.io/docs/testing-cookbooks/recommendations) on where to look for the most impactful optimization
* collaborate with the rest of your team
* [write performance tests](https://blackfire.io/docs/testing-cookbooks/tests)
* automate profiling with [periodic builds](https://blackfire.io/docs/builds-cookbooks/index)
* integrate further with Platform.sh by enabling to automate profiling as each code commit
* integrate with [GitHub](https://blackfire.io/docs/integrations/git/github), [Bitbucket](https://blackfire.io/docs/integrations/git/bitbucket) and [GitLab](https://blackfire.io/docs/integrations/git/gitlab) to show the results of Blackfire builds at the commit status level

Check [Blackfire's documentation](https://blackfire.io/docs/introduction) for more information.

{{< note >}}
Those features may require a Premium or an Enterprise subscription. We offer attractive bundles of Platform.sh and Blackfire.io subscriptions. Please [contact our sales department](https://platform.sh/contact/) to discuss how we can help you.
{{< /note >}}

## Enable Blackfire Monitoring

Blackfire Monitoring is [enabled by default](https://blackfire.io/docs/monitoring-cookbooks/configuration#activating-monitoring-on-an-environment) for Monitoring customers.

To disable Blackfire Monitoring, you will need to add the `BLACKFIRE_APM_ENABLED` [environment variable](/development/variables.md) with a value of `0`.

In the management console, view the environment you would like to disable Blackfire Monitoring on and add the variable `env:BLACKFIRE_APM_ENABLED` with the value `0`.
Otherwise, you can use the CLI command `platform variable:create --level environment --name BLACKFIRE_APM_ENABLED --value 0`

## Troubleshooting

### Bypassing Reverse Proxy, Cache, and Content Delivery Networks (CDN)

If you are using one of those, you will need them to let Blackfire access your servers.
[More information on how to configure a bypass](https://blackfire.io/docs/reference-guide/reverse-proxies#documentation).

### HTTP Cache configuration

If you are using the HTTP cache with cookies , please update in your `.platform/routes.yaml` the cookies that are allowed to go through the cache. You need to allow the `__blackfire` cookie name.

Something like:

```yaml
cache:
    enabled: true
    cookies: ["/SESS.*/", "__blackfire"]
```

## Reaching out to the Blackfire support

If the above didn't help, collect the following and send it to the [Blackfire support](https://support.blackfire.io):

* The output of `platform ssh -- php -d display_startup_errors=on --ri blackfire` command
* The Blackfire logs

### Getting the Blackfire logs

Please execute the following in the environment where you're facing the issue:

* `platform variable:create php:blackfire.log_file --value /tmp/blackfire.log`
* `platform variable:create php:blackfire.log_level --value 4`
* start a profile/build again

You will get the logs with `platform ssh -- cat /tmp/blackfire.log > blackfire.log`.

### Disabling the Blackfire logs

Once you are done, please disable logging with:

* `platform variable:delete php:blackfire.log_file`
* `platform variable:delete php:blackfire.log_level`
