# SimpleSAML

SimpleSAMLphp is a library for authenticating a PHP-based application against a SAML server, such as Shibboleth.  Although Drupal has modules available to authenticate using SimpleSAML some additional setup is required.

The following setup assumes you're using the `drupal` build flavor and building your site with Drush Make.  If not, you may need to adjust some paths in the configuration but the basics are the same.

## Download the library

First, download the 3rd party [SimpleSAMLphp library](https://simplesamlphp.org/download).  When you unpack the `tar.gz` file it will contain a directory named `simplesamplephp-???`, where the `???` is the version number of the library.  Place that directory at the root of your application, as a sibling of your `.platform.app.yaml` file, named `simplesamplephp`.  (The directory name doesn't really matter but removing the version number means that it won't change in future updates.) 

The `drupal` build flavor will move that directory to the `public/sites/default/` directory during build.  The rest of the configuration is based on that behavior.

## Expose the SimpleSAML endpoint

The SimpleSAML library's `www` directory needs to be publicly accessible.  That can be done by mapping it directly to a path in the Application configuration.  Add the following block to the `web.locations` section of `.platform.app.yaml`:

```yaml
 web:
    locations:
        '/simplesaml':
            root: 'public/sites/default/simplesamlphp/www'
            allow: true
            scripts: true
            index:
                - index.php
```

That will map all requests to `example.com/simplesaml/` to the `simplesamlphp/www` directory, allowing static files there to be served, PHP scripts to execute, and defaulting to index.php.

## Install the `simpleSAMLphp Authentication` module

You will need to install the [simpleSAMLphp Authentication](https://www.drupal.org/project/simplesamlphp_auth) module.  If using Drush Make then the easiest way to do so is simply to add the following line to your `project.make` file:

```ini
projects[simplesamlphp_auth][version] = 2.0-alpha2
```

(Adjust the version to whatever is current.)

Deploy the site and enable the `simplesamlphp_auth` module.

@todo document how to setup the SimpleSaml module properly.  May be better to use settings.platformsh.php.

## Configure SimpleSAML to use the database

SimpleSAMLphp is able to store its data either on disk or in the Drupal database.  Platform.sh strongly recommends using the database.

Open the file `simplesamlphp/config/config.php`.  It contains a number of configuration properties that you can adjust as needed.  Some are best edited in-place and the file already includes ample documentation, specifically:

* `auth.adminpassword`
* `technicalcontact_name`
* `technicalcontact_email`

Others are a little more involved.  In the interest of simplicity we recommend simply pasting the following code snippet at the end of the file, as it will override the default values in the array.

```php

// Set SimpleSAML to log to a file in the Platform.sh log directory.
$config['logging.handler'] = 'file';
$config['loggingdir'] = '/var/log';

// Setup the database connection for all parts of SimpleSAML.
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);
  foreach ($relationships['database'] as $instance) {
    if (!empty($instance['query']['is_master'])) {
      $dsn = sprintf("%s:host=%s;dbname=%s", 
        $instance['schema'], 
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

// Set the salt value from the Platform.sh entropy value, provided for this purpose.
if (isset($_ENV['PLATFORM_PROJECT_ENTROPY'])) {
  $config['secretsalt'] = $_ENV['PLATFORM_PROJECT_ENTROPY'];
}
```

