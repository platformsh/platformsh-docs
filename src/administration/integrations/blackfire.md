# Blackfire

Platform.sh supports [Blackfire.io](https://blackfire.io/).

Blackfire is a PHP profiler and automated performance testing tool that can be
used in the development Integration, Staging, and Production environments.

It grants details information on your PHP code's resources consumption across
Wall-Time, CPU, I/O, Memory, Network Calls, HTTP requests and SQL queries.

In addition, it can profile your code automatically and notify you whenever your
code does not comply with best practices for PHP, Symfony, Drupal, eZPlatform,
Typo3 & Magento code performance management. 

For a high level overview and demo of Blackfire, check out the [full video tutorial](https://www.youtube.com/watch?v=-5icUW9pUH8).

## Version

Check the latest versions of the probe and CLI tool on [Blackfire's documentation](https://blackfire.io/docs/up-and-running/upgrade#latest-versions).

## Get Started

### 1. Get your credentials

**Sign up for the free 15 days Premium trial** at [blackfire.io](https://blackfire.io/pricing)
and install the **Blackfire Companion** web browser extension ([Chrome](https://chrome.google.com/webstore/detail/blackfire-companion/miefikpgahefdbcgoiicnmpbeeomffld)
or [Firefox](https://addons.mozilla.org/firefox/addon/blackfire/)).

> **note**
>
> Blackfire also offers a perpetually-free edition but it is for local development only and will not run on Platform.sh.

Go to your Dashboard and create a new environment [under the Environments tab](https://blackfire.io/my/environments).

![Blackfire environments](/images/blackfire-environments.png)

You will need to store the server credentials for further configuration. You can
find them any time under the "Settings" tab of your environment in Blackfire.

![Blackfire credentials](/images/blackfire-credentials.png)

### 2. Enable the Blackfire extension

Paste the credentials above in your `.platform.app.yaml` as follows:

```yaml
runtime:
    extensions:
        - name: 'blackfire'
          configuration:
              server_id: '<insert your Server ID>'
              server_token: '<Insert your Server Token'
```

Push the changes to your Platform environment to enable Blackfire as follows:

```bash
git add .platform.app.yaml
git commit -m "Enable Blackfire."
git push
```

### 3. Confirm it's running

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

## Profile

Access your site via your browser and click `Profile` in the Blackfire Companion.

![Blackfire Companion](/images/blackfire-companion.png)

That's it! Your site will be profiled and you should get all the results in your Blackfire account.

## Going further with Blackfire

Blackfire also enables to:
- collaborate with the rest of your team
- write performance tests
- automate profiling with periodic builds
- integrate further with Platform.sh by enabling to automate profiling as each
code commit
- integrate with New Relic for combined benefits of monitoring and profiling
- integrate with GitHub, Bitbucket and GitLab to show the results of Blackfire
builds at the commit status level

Check [Blackfire's documentation](https://blackfire.io/docs/introduction) for more information.

Those features may require a Premium or an Enterprise subscription.

> **note**
>
> We offer attractive bundles of Platform.sh and Blackfire.io subscriptions.
> Please [contact our sales department](https://platform.sh/contact/) to discuss how we can help you.

## Troubleshooting

### Bypassing Reverse Proxy, Cache, and Content Delivery Networks (CDN)
If you are using one of those, you will need them to let Blackfire access your servers.
[More information on how to configure a bypass](More information on how to configure a bypass).

### HTTP Cache configuration
If you are using the HTTP cache with cookies , please update in your `.platform.app.yaml`
the cookies that are allowed to go through the cache. You need to allow the `__blackfire` cookie name.

Something like:

```yaml
cache:
    enabled: true
    cookies: [“/SESS.*/“, “__blackfire”]
```

## Reaching out to the Blackfire support
If the above didn't help, collect the following and send it to the [Blackfire support](https://support.blackfire.io):

- The output of `platform ssh -- php -d display_startup_errors=on --ri blackfire` command
- The Blackfire logs

### Getting the Blackfire logs
Please execute the following in the environment where you're facing the issue:

- `platform variable:create --name php:blackfire.log_file --value /tmp/blackfire.log` 
- `platform variable:create --name php:blackfire.log_level --value 4` 
- start a profile/build again

You will get the logs with `platform ssh -- cat /tmp/blackfire.log > blackfire.log`.

### Disabling the Blackfire logs
Once you are done, please disable logging with:

- `platform variable:delete php:blackfire.log_file` 
- `platform variable:delete php:blackfire.log_level`
  