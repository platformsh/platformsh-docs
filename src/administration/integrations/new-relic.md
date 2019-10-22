# New Relic

Platform.sh supports [New Relic APM](https://newrelic.com/products/application-monitoring).

## Get Started

### 1. Get your license key

Sign up at [https://newrelic.com](https://newrelic.com/signup) and get your license key.

### 2. Add your license key

Add your New Relic license key as a project level variable:

```bash
platform variable:create --visible-build false php:newrelic.license --value '<your-new-relic-license-key>'
```

### 3. Enable the New Relic extension

Enable the New Relic extension in your `.platform.app.yaml` as follows:

```bash
runtime:
    extensions:
        - newrelic
```

Push the changes to your Platform.sh environment to enable New Relic as follows:

```bash
git add .platform.app.yaml
git commit -m "Enable New Relic."
git push
```

That's it! You need to wait a little bit for your New Relic dashboard to be generated.

## Troubleshoot

Additionally, you can check that your application is properly connected to New Relic by looking at the `/var/log/app.log` file:

```bash
platform log app

2017/04/19 14:00:16.706450 (93) Info: Reporting to: https://rpm.newrelic.com/accounts/xxx/applications/xxx
2017/04/19 14:00:16.706668 (93) Info: app 'xxx-master-xxx.app' connected with run id 'xxx'
```

## Notes

### Memory usage

This extension adds extra memory overhead to your application and each request will require more memory. So, depending on how aggressive your `sizing_hints` are, you may need to adjust them or upgrade your plan.
