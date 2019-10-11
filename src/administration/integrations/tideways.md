# Tideways

Platform.sh supports [Tideways APM](https://tideways.io/) for PHP.  This functionality is only available on PHP 7.0 and later.  
The [Upstream](https://tideways.io/) now maintains two versions for tideways (and therefore both plugins are available on Platform.sh):
* tideways-xhprof: Which is the Opensource version therefore no licensing required (On the downside, less integration service available).
* tideways: Which is the bundle proprietary full version of the product and plugins, which the rest of the guide is mostly aimed to cover that.

## Get Started

### 1. Get your license key

Sign up at [https://tideways.io](https://app.tideways.io/register/) and get your license key.

### 2. Add your license key

Add your Tideways license key as a project level variable:

```bash
platform variable:create --visible-build false php:tideways.api_key --value '<your-license-key>'
```

### 3. Enable the Tideways extension

Enable the Tideways extension in your `.platform.app.yaml` as follows:

```bash
runtime:
    extensions:
        - tideways
```

Enabling the extension will also activate the Tideways background process.

Push the changes to your Platform.sh environment to enable Tideways as follows:

```bash
git add .platform.app.yaml
git commit -m "Enable Tideways."
git push
```

Tideways should now be enabled.  Give it a few hours to a day to get a decent set of data before checking your Tideways dashboard.

## Email integration

Once Tideways is enabled, an additional environment variable will be available.  The `PLATFORM_SMTP_HOST` variable will contain the hostname of the Tideways SMTP server should it be needed.
