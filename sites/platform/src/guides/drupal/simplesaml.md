---
title: "SimpleSAML"
description: |
    Configure third party authentication using SimpleSAML.
weight: -60
banner:
    title: A note on versions
    body: This page focuses on a Drupal and SimpleSAML 1.19.x combination. Documentation for later SimpleSAML versions (2.0.x) has been delayed due to compatibility issues. If, as a {{% vendor/name %}} user, you have successfully set up Drupal 9 or 10 with a SimpleSAML 2.0.x version, [we want to hear about it!](https://community.platform.sh/)
---

SimpleSAMLphp is a library for authenticating a PHP-based application against a SAML server, such as Shibboleth.
Although Drupal has modules available to authenticate using SimpleSAML some additional setup is required.

The following configuration assumes you are building Drupal using Composer.
If not, you need to download the library manually and adjust some paths accordingly.

## Download the library and Drupal module

The easiest way to download SimpleSAMLphp is via Composer.
The following command will add both the Drupal module and the PHP library to your `composer.json` file.

```bash
composer require simplesamlphp/simplesamlphp drupal/externalauth drupal/simplesamlphp_auth
```

Once that's run, commit both `composer.json` and `composer.lock` to your repository.

## Include SimpleSAML cookies in the cache key

The SimpleSAML client uses additional cookies besides the Drupal session cookie that need to be allowed for the cache.
To do so, modify your `{{< vendor/configfile "routes" >}}` file for the route that points to your Drupal site and add two additional cookies to the `cache.cookies` line.
It should end up looking approximately like this:

```yaml {configFile="routes"}
"https://{default}/":
  type: upstream
  upstream: "myapp:http"
  cache:
    enabled: true
    cookies: ['/^SS?ESS/', '/^Drupal.visitor/', 'SimpleSAMLSessionID', 'SimpleSAMLAuthToken']
```

Commit this change to the Git repository.

## Expose the SimpleSAML endpoint

The SimpleSAML library's `www` directory needs to be publicly accessible.
That can be done by mapping it directly to a path in the Application configuration.
Add the following block to the `web.locations` section of `{{< vendor/configfile "app" >}}`:

```yaml {configFile="app"}
 web:
  locations:
    '/simplesaml':
      root: 'vendor/simplesamlphp/simplesamlphp/www'
      allow: true
      scripts: true
      index:
        - index.php
```

That will map all requests to `example.com/simplesaml/` to the `vendor/simplesamlphp/www` directory, allowing static files there to be served, PHP scripts to execute, and defaulting to index.php.

## Create a configuration directory

Your SimpleSAMLphp configuration needs to be outside of the `vendor` directory.
The `composer require` downloads a template configuration file to `vendor/simplesamlphp/simplesamlphp/config`.

Rather than modifying that file in place (as it isn't included in Git),
copy the `vendor/simplesamlphp/simplesamlphp/config` directory to `simplesamlphp/config` (in [your app root](/create-apps/app-reference/single-runtime-image.md#root-directory)).
It should contain two files, `config.php` and `authsources.php`.

Additionally, create a `simplesamlphp/metadata` directory.
This directory holds your IdP definitions.
Consult the SimpleSAMLphp documentation and see the examples in `vendor/simplesamlphp/simplesamlphp/metadata-templates`.

Next, you need to tell SimpleSAMLphp where to find that directory using an environment variable.
The simplest way to set that is to add the following block to your `{{< vendor/configfile "app" >}}` file:

```yaml {configFile="app"}
variables:
  env:
    SIMPLESAMLPHP_CONFIG_DIR: /app/simplesamlphp/config
```

Commit the whole `simplesamplphp` directory and `{{< vendor/configfile "app" >}}` to Git.

## Configure SimpleSAML to use the database

SimpleSAMLphp is able to store its data either on disk or in the Drupal database.
{{% vendor/name %}} strongly recommends using the database.

Open the file `simplesamlphp/config/config.php` that you created earlier.
It contains a number of configuration properties that you can adjust as needed.
Some are best edited in-place and the file already includes ample documentation, specifically:

* `auth.adminpassword`
* `technicalcontact_name`
* `technicalcontact_email`

Others are a little more involved.
In the interest of simplicity we recommend pasting the following code snippet at the end of the file, as it will override the default values in the array.

```php {location="simplesamlphp/config/config.php"}
<?php

// Set SimpleSAML to log using error_log(), which on {{% vendor/name %}}will
// be mapped to the /var/log/app.log file.
$config['logging.handler'] = 'errorlog';

// Set SimpleSAML to use the metadata directory in Git, rather than
// the empty one in the vendor directory.
$config['metadata.sources'] = [
   ['type' => 'flatfile', 'directory' =>  dirname(__DIR__) . '/metadata'],
];

// Setup the database connection for all parts of SimpleSAML.
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);
  foreach ($relationships['database'] as $instance) {
    if (!empty($instance['query']['is_master'])) {
      $dsn = sprintf("%s:host=%s;dbname=%s",
        $instance['scheme'],
        $instance['host'],
        $instance['path']
      );
      $config['database.dsn'] = $dsn;
      $config['database.username'] = $instance['username'];
      $config['database.password'] = $instance['password'];

      $config['store.type'] = 'sql';
      $config['store.sql.dsn'] = $dsn;
      $config['store.sql.username'] = $instance['username'];
      $config['store.sql.password'] = $instance['password'];
      $config['store.sql.prefix'] = 'simplesaml';

    }
  }
}

// Set the salt value from the {{% vendor/name %}} entropy value, provided for this purpose.
if (isset($_ENV['PLATFORM_PROJECT_ENTROPY'])) {
  $config['secretsalt'] = $_ENV['PLATFORM_PROJECT_ENTROPY'];
}
```

## Generate SSL certificates (optional)

Depending on your Identity Provider (IdP),
you may need to generate an SSL/TLS certificate to connect to the service provider.
If so, you should generate the certificate locally following the instructions in the [SimpleSAMLphp documentation](https://simplesamlphp.org/docs/stable/index.html).
Your resulting IdP file should be placed in the `simplesamlphp/metadata` directory.
The certificate should be placed in the `simplesamlphp/cert` directory.
(Create it if needed.)

Then add the following line to your `simplesamlphp/config/config.php` file to tell the library where to find the certificate:

```php {location="simplesamlphp/config/config.php"}
<?php
$config['certdir'] = dirname(__DIR__) . '/cert';
```

## Deploy

Commit all changes and deploy the site, then enable the `simplesamlphp_auth` module within Drupal (usually by enabling it locally and pushing a config change).

Consult the module documentation for further information on how to configure the module itself.
Note that you shouldn't check the "Activate authentication via SimpleSAMLphp" checkbox in the module configuration until you have the rest of the configuration completed, or you may be locked out of the site.
