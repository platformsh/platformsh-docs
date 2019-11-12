# Blackfire

Platform.sh supports [Blackfire.io](https://blackfire.io/).

Blackfire is a PHP profiler and automated performance testing tool that can be used in the development Integration, Staging, and Production environments.

It grants details information on your PHP code's resources consumption across Wall-Time, CPU, I/O, Memory, Network Calls, HTTP requests and SQL queries.

In addition, it can profile your code automatically and notify you whenever your code does not comply with best practices for PHP, Symfony, Drupal, eZPlatform, Typo3 & Magento code performance management.

For a high level overview and demo of Blackfire, check out the [full video tutorial](https://www.youtube.com/watch?v=-5icUW9pUH8).

## Version

Check the latest versions of the probe and CLI tool on [Blackfire's documentation](https://blackfire.io/docs/up-and-running/upgrade#latest-versions).

## On a Grid plan

### 1. Get your credentials

**Sign up for the free 15 days Premium trial** at [blackfire.io](https://blackfire.io/pricing) and install the **Blackfire Companion** web browser extension ([Chrome](https://chrome.google.com/webstore/detail/blackfire-companion/miefikpgahefdbcgoiicnmpbeeomffld) or [Firefox](https://addons.mozilla.org/firefox/addon/blackfire/)).

> **note**
>
> Blackfire also offers a perpetually-free edition but it is for local development only and will not run on Platform.sh.

Go to your Dashboard and create a new environment [under the Environments tab](https://blackfire.io/my/environments).

![Blackfire environments](/images/integrations/blackfire/blackfire-environments.png)

You will need to store the server credentials for further configuration. You can find them any time under the "Settings" tab of your environment in Blackfire.

![Blackfire credentials](/images/integrations/blackfire/blackfire-credentials.png)

### 2. Enable the Blackfire extension

Configure the extension in your `.platform.app.yaml` as follows:

```yaml
runtime:
    extensions:
        - blackfire
```

Push the changes to your Platform environment to enable Blackfire as follows:

```bash
git add .platform.app.yaml
git commit -m "Enable Blackfire."
git push
```

### 3. Configure your server credentials

Blackfire enables to have a fine grained configuration of server credentials across branches and environments on Platform.sh.

#### Configuring global server credentials

Configuring server credentials on your master branch will enable you to make sure you can profile any other branch:

```bash
platform variable:create -e master env:BLACKFIRE_SERVER_ID <insert your Server ID>
platform variable:create -e master env:BLACKFIRE_SERVER_TOKEN <insert your Server Token>
```

#### Configuring server credentials per branch

A recommendation is to have a [Blackfire environment](https://blackfire.io/docs/reference-guide/environments#documentation) for production, another one for staging, and another one for development/integration. That can be mapped in Platform.sh to one Blackfire environment for the production branch, one for the staging branch, and one for all feature branches.

```bash
platform variable:create -e=<insert your branch name> env:BLACKFIRE_SERVER_ID <insert your Server ID>
platform variable:create -e=<insert your branch name> env:BLACKFIRE_SERVER_TOKEN <insert your Server Token>
```

### 4. Confirm it's running

Login via SSH to your container and confirm that Blackfire is running as follows:

```bash
php --ri blackfire

blackfire

blackfire => enabled
blackfire => 1.16.1
Timing measurement => gtod
Num of CPU => 8
...
```

## On a Dedicated cluster

**Sign up for the free 15 days Premium trial** at [blackfire.io](https://blackfire.io/pricing) and install the **Blackfire Companion** web browser extension ([Chrome](https://chrome.google.com/webstore/detail/blackfire-companion/miefikpgahefdbcgoiicnmpbeeomffld) or [Firefox](https://addons.mozilla.org/firefox/addon/blackfire/)).

Then open a support ticket with the Backfire server ID and token.  The client ID and token is optional.  Our support team will install it for you.

Note, Blackfire integration works only on profiling your cluster via the URL to the origin. Do not profile your site going through the CDN.

## Profiling web requests

Access your site via your browser and click `Profile` in the Blackfire Companion.

![Blackfire Companion](/images/integrations/blackfire/blackfire-companion.png)

That's it! Your site will be profiled and you should get all the results in your Blackfire account.

## Profiling CLI commands

To profile your PHP CLI scripts, use the following command line:

```
blackfire --config /etc/platform/$USER/blackfire.ini <command>
```

## Going further with Blackfire

Blackfire also enables to:

* collaborate with the rest of your team
* write performance tests
* automate profiling with periodic builds
* integrate further with Platform.sh by enabling to automate profiling as each code commit
* integrate with New Relic for combined benefits of monitoring and profiling
* integrate with GitHub, Bitbucket and GitLab to show the results of Blackfire builds at the commit status level

Check [Blackfire's documentation](https://blackfire.io/docs/introduction) for more information.

> **note**
>
> Those features may require a Premium or an Enterprise subscription.
> We offer attractive bundles of Platform.sh and Blackfire.io subscriptions.
> Please [contact our sales department](https://platform.sh/contact/) to discuss how we can help you.

## Troubleshooting

### Bypassing Reverse Proxy, Cache, and Content Delivery Networks (CDN)

If you are using one of those, you will need them to let Blackfire access your servers.
[More information on how to configure a bypass](https://blackfire.io/docs/reference-guide/reverse-proxies#documentation).

### HTTP Cache configuration

If you are using the HTTP cache with cookies , please update in your `.platform.app.yaml` the cookies that are allowed to go through the cache. You need to allow the `__blackfire` cookie name.

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

* `platform variable:create php:blackfire.log_file /tmp/blackfire.log`
* `platform variable:create php:blackfire.log_level 4`
* start a profile/build again

You will get the logs with `platform ssh -- cat /tmp/blackfire.log > blackfire.log`.

### Disabling the Blackfire logs

Once you are done, please disable logging with:

* `platform variable:delete php:blackfire.log_file`
* `platform variable:delete php:blackfire.log_level`
