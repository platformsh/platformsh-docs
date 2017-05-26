# Using Solr with Drupal 8.x

## Requirements

### Get a Solr configuration files set

Copy the Solr 6.x configuration folder from the  [Search API Solr module](https://www.drupal.org/project/search_api_solr) to your `.platform` folder.

The folder to be copied is located at the Search API Solr module subdirectory `./solr-conf/6.x/`. Then, the structure in your Platform repository will be `./platform//solr-conf/6.x/`.

### Add a Solr service

First you need to create a Redis service.  In your `.platform/services.yaml` file, add or uncomment the following:

```yaml
solrsearch:
    type: solr:6.3
    disk: 1024
    configuration:
        cores:
            maincore:
                conf_dir: !archive "solr-conf/6.x"
        endpoints:
            main:
                core: maincore
```
The above definition defines a single Solr 6.3 server.  That server has 1 core defined: `maincore` &mdash; the configuration for which is in the `.platform/solr-conf/6.x` directory.

It then defines one endpoints: `main` is connected to the `maincore`.

### Expose the Solr service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new Solr service.  Under the `relationships` section, add the following:

```
relationships:
    solr1: 'solrsearch:main'
```

That is, the application's environment would include a `solr1` relationship that connects to the `main` endpoint, which is the `maincore` core

The key (left side) is the name that will be exposed to the application in the `PLATFORM_RELATIONSHIPS` [variable](/development/variables.md).  The right hand side is the name of the service we specified above (`solrsearch`) and the endpoint (`main`).  If you named the service something different above, change `solrsearch` to that. The same rule is valid for the value of the endpoint named `main`.

### Add the Drupal modules

You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Search API Solr](https://www.drupal.org/project/search_api_solr) modules to your project. If you are using composer, the easiest way to add them is to simply run:

```bash
$ composer require drupal/search_api drupal/search_api_solr
```

And then commit the changes to `composer.json` and `composer.lock`.

## Configuration

The configuration can be managed from `settings.platformsh.php` by adding this code snippet:

```php
<?php
// Configures the Solr server.
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  // The Solr relationship name defined in your '.platform.app.yaml' file. In
  // this example it is 'solr1'.
  $relationship_name = 'solr1';

  if (!empty($relationships[$relationship_name][0])) {
    $solr = $relationships[$relationship_name][0];

    // The the machine name of the Solr server in Drupal. The default server
    // automatically created by Search API is 'default_solr_server'.
    $solr_server_name = 'default_solr_server';

    // The path is always 'solr'.
    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['path'] = 'solr';

    // The name of the Solr core defined in your '.platform/services.yaml'
    // file. In this example it is 'maincore'
    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['core'] = 'maincore';

    // Gets the host and port from the values returned from the relationship.
    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['host'] = $solr['host'];
    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['port'] = $solr['port'];
  }
}
```

> **note**
> At this time, bugs in Drupal 8 prevent the Solr configuration from adding new Solr servers other than the default which is already created by the Search API module (`default_solr_server`). If you are using multiple cores or a different than the default one, then you must also  add them at the Search API admin page `/admin/config/search/search-api/add-server`. See [these](https://www.drupal.org/node/2682369) [issues](https://www.drupal.org/node/2744057) for more information.
