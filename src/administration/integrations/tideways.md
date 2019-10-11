# Tideways

Platform.sh supports [Tideways APM](https://tideways.com/) for PHP.  This functionality is only available on PHP 7.0 and later.
The Upstream now maintains two versions for tideways (and therefore both plugins are available on Platform.sh):
* [tideways_xhprof](https://github.com/tideways/php-xhprof-extension): Which is the Opensource version therefore no licensing required (On the downside, less integration service available). You can use it in combination with [xhprof UI](https://github.com/phacility/xhprof)
* [tideways](https://tideways.com): Which is the bundle proprietary full version of the product and plugins, which the rest of the guide is mostly aimed to cover that.

## Get Started

### 1. Get your license key

Sign up at [https://tideways.com](https://app.tideways.io/register/) and get your license key.

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

## Deployment Integration

Tideways integrates with platform.sh Deployment Hooks and provides performance comparisons
before and after deployments were released. You can find the platform CLI command to register
this hook for your application in Tideways "Application Settings" screen under the section
"Exports & Integrations". Here is an example:

```bash
$ platform integration:add --type=webhook --url="https://app.tideways.io/api/events/external/1234/abcdefghijklmnopqrstuvwxyz1234567890"
```
