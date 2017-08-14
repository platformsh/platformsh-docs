# Tideways

Platform.sh supports [Tideways APM](https://tideways.io/) for PHP.  This functionality is only available on PHP 7.0 and later.

## Get Started

### 1. Get your license key

Sign up at [https://tideways.io](https://app.tideways.io/register/) and get your license key.

### 2. Add your license key

Add your Tideways license key as a project level variable:

```bash
platform project:variable:set --no-visible-build php:tideways.api_key <your-license-key>
```

### 3. Enable the Tideways extension

Enable the Tideways extension in your `.platform.app.yaml` as follows:

```bash
runtime:
    extensions:
        - tideways
```

Enabling the extension will also activate the Tideways background process.

Push the changes to your Platform.sh environment to enable New Relic as follows:

```bash
git add .platform.app.yaml
git commit -m "Enable Tideways."
git push
```

Tideways should now be enabled.  Give it a few hours to a day to get a decent set of data before checking your Tideways dashboard.

## Email integration

Once Tideways is enabled, an additional environment variable will be available.  The `PLATFORM_SMTP_HOST` variable will contain the hostname of the Tideways SMTP server should it be needed.
