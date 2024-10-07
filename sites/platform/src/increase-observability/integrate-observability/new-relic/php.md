---
title: "PHP"
---

## Get your license key

Sign up at New Relic to [get your license key](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/).

## Add your license key

Add your New Relic license key as an environment level variable:

```bash
{{% vendor/cli %}} variable:create --level environment --environment {{< variable "ENVIRONMENT_NAME" >}} --visible-build false --inheritable false --json false --sensitive true --enabled true --visible-runtime true php:newrelic.license --value {{< variable "NEW_RELIC_LICENSE_KEY" >}}
```

## Give your application a name

Add a new environment level variable to give your application a recognizable name:

```bash
{{% vendor/cli %}} variable:create --level environment --environment {{< variable "ENVIRONMENT_NAME" >}} --visible-build false --inheritable false --json false --sensitive true --enabled true --visible-runtime true php:newrelic.appname --value {{< variable "APP_NAME" >}}
```

{{< note >}}
Repeat these two steps for every environment you want to monitor, making sure you give them different application names, matching the ones you entered in the New Relic interface.
{{< /note >}}

## Enable the New Relic extension

Enable the New Relic extension in your `{{< vendor/configfile "app" >}}` as follows:

```yaml {configFile="app"}
runtime:
  extensions:
    - newrelic
```

Push the changes to your {{% vendor/name %}} environment to enable New Relic as follows:

```bash
git add {{< vendor/configfile "app" >}}
git commit -m "Enable New Relic."
git push
```

That's it! You need to wait a little bit for your New Relic dashboard to be generated.

## Configure New Relic to your needs

New Relic agent can be configured through PHP variables.

For instance, to disable the tracing and reduce the amount of data sent, set the [``distributed_tracing_enabled``](https://docs.newrelic.com/docs/apm/agents/php-agent/configuration/php-agent-configuration/#inivar-distributed-enabled) variable to `false` :

```bash
{{% vendor/cli %}} variable:create --level environment --environment {{< variable "ENVIRONMENT_NAME" >}} --visible-build false --inheritable false --json false --sensitive false --enabled true --visible-runtime true php:newrelic.distributed_tracing_enabled --value false
```

## Troubleshoot

Additionally, you can check that your application is properly connected to New Relic by looking at the `/var/log/app.log` file:

```bash
{{% vendor/cli %}} log app

2017/04/19 14:00:16.706450 (93) Info: Reporting to: https://rpm.newrelic.com/accounts/xxx/applications/xxx
2017/04/19 14:00:16.706668 (93) Info: app 'xxx-main-xxx.app' connected with run id 'xxx'
```
