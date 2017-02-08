# Using Solr with Drupal 7.x

## Requirements

You will need either the module  [Apache Solr Search](https://www.drupal.org/project/apachesolr) **or** the module [Search API](https://www.drupal.org/project/search_api). Each have different configurations.

### Requirements for Apache Solr Search module
You will need either the module  [Apache Solr Search](https://www.drupal.org/project/apachesolr)

If you are using a make file, you can add those lines to your
`project.make`:

```ini
projects[apachesolr][version] = 1.8
```

### Requirements for module Search API module
You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Search API
Solr](https://www.drupal.org/project/search_api_solr) modules to your project. The [Search API Override](https://www.drupal.org/project/search_api_override) module is strongly recommended in order to allow the Solr configuration to be populated from `settings.php`.

If you are using a make file, you can add those lines to your
`project.make`:

```ini
projects[entity][version] = 1.8
projects[search_api][version] = 1.20
projects[search_api_solr][version] = 1.11
projects[search_api_override][version] = 1.0-rc1
```

## Configuration

### Configuration for Apache Solr Search module

The Apache Solr Search module allows configuration to be overridden from `settings.php`.  Just add the following to your `settings.platformsh.php` file:

```php
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  if (!empty($relationships['solr'])) {
    // Override search API server settings fetched from default configuration.
    foreach ($relationships['solr'] as $endpoint) {
      // Replace the machine name of the server here.
      $environment_machine_name = 'MACHINE_NAME_OF_SOLR_SERVER';
      
      $environment_url = "http://" . $endpoint['host'] . ":" . $endpoint['port'] . "/solr";
      $conf['apachesolr_default_environment'] = $environment_machine_name;
      $conf['apachesolr_environments'][$environment_machine_name]['url'] = $environment_url;
    }
  }
}
```

Replace `MACHINE_NAME_OF_SOLR_SERVER` with the Drupal machine name of the server you want to override.  The solr server must already be defined in Drupal and ideally exported to a Feature. The most comon machine name used is just `solr`.

### Configuration for Search API module

The Search API module includes recommended configuration files to use with Drupal.  See the [Solr](/configuration/services/solr.md) configuration page for details of how to configure your Solr server to use the Drupal configuration files.  Note that the Drupal 7 version of Search API Solr does not include configuration files for Solr 6.  The Drupal 8 version of the module does, however, and should work acceptably.  It can also be customized as desired.

The Search API Override module (listed above) allows Search API configuration to be overridden from `settings.php`.  Once it has been enabled, add the following to your `settings.platformsh.php` file:

```php
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  if (!empty($relationships['solr'])) {
    // Override search API server settings fetched from default configuration.
    $conf['search_api_override_mode'] = 'load';
    foreach ($relationships['solr'] as $endpoint) {
      $conf['search_api_override_servers'] = array(
        'MACHINE_NAME_OF_SOLR_SERVER' => array(
          'options' => array(
            'host' => $endpoint['host'],
            'port' => $endpoint['port'],
            'path' => '/' . $endpoint['path'],
            'http_method' => 'POST',
          ),
        ),
      );
    }
  }
}
```

Replace `MACHINE_NAME_OF_SOLR_SERVER` with the Drupal machine name of the server you want to override.  The solr server must already be defined in Drupal and ideally exported to a Feature.

## Relationships configuration

If you did not name the relationship `solr` in your `.platform.app.yaml` file, adjust the name accordingly.  Also, if you have multiple Solr cores defined the above `foreach()` loop will not work.  Most likely you will want to name the relationships by the machine name of the Solr server they should map to and then map each one individually.

For both modules, your `.platform.app.yaml` file must have the Solr relationship enabled, such as this snippet:

```ini
relationships:
    solr: 'solrsearch:solr'
```

