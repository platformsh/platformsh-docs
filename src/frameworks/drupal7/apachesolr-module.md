# Using Solr with the module Apache Solr Search on Drupal 7.x

This page is about configuring Solr with the module [Apache Solr Search](https://www.drupal.org/project/apachesolr). If your project uses [Search API](https://www.drupal.org/project/search_api) then you should follow the instructions [Search API](search-api-module.md).

## Requirements
ou will need either the module  [Apache Solr Search](https://www.drupal.org/project/apachesolr)

If you are using a make file, you can add those lines to your
`project.make`:


```ini
projects[apachesolr][version] = 1.8
```

## Configuration

The Apache Solr Search module allows configuration to be overridden from `settings.php`.  Just add the following to your `settings.platformsh.php` file:

```php
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  if (!empty($relationships['solr'])) {
    // Override search API server settings fetched from default configuration.
    foreach ($relationships['solr'] as $endpoint) {
      // Replace the machine name of the server here.
      $environment_machine_name = 'MACHINE_NAME_OF_SOLR_SERVER';

      $environment_url = "http://" . $endpoint['host'] . ":" . $endpoint['port'] . "/" . $endpoint['path'];
      $conf['apachesolr_default_environment'] = $environment_machine_name;
      $conf['apachesolr_environments'][$environment_machine_name]['url'] = $environment_url;
    }
  }
}
```

Replace `MACHINE_NAME_OF_SOLR_SERVER` with the Drupal machine name of the server you want to override.  The solr server must already be defined in Drupal and ideally exported to a Feature. The most comon machine name used is just `solr`.

## Relationships configuration

If you did not name the relationship `solr` in your `.platform.app.yaml` file, adjust the name accordingly.  Also, if you have multiple Solr cores defined the above `foreach()` loop will not work.  Most likely you will want to name the relationships by the machine name of the Solr server they should map to and then map each one individually.

The file `.platform.app.yaml` must have the Solr relationship enabled, such as this snippet:

```ini
relationships:
    solr: 'solrsearch:solr'
```

