# Using Solr with Drupal 8.x

Platform.sh recommends using Solr version 6.3, yet we support [other versions](../../configuration/services/solr.md#supported-versions). The following instructions are for Solr 6, but they also work for the previous versions if you change the version numbers accordingly.

Advanced Solr service configuration and implementation in other frameworks other than Drupal can be found at the [Solr services page](../../configuration/services/solr.md)

## Requirements

### Add the Drupal modules

You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Search API Solr](https://www.drupal.org/project/search_api_solr) modules to your project. If you are using composer, the easiest way to add them is to simply run:

```bash
$ composer require drupal/search_api drupal/search_api_solr
```

And then commit the changes to `composer.json` and `composer.lock`.

### Get a Solr configuration files set

Copy the Solr 6.x configuration folder from the  [Search API Solr module](https://www.drupal.org/project/search_api_solr) to your `.platform` folder.

Assuming you got the module in the [previous step](#add-the-drupal-modules) and your application's web root is set to the default `web` folder, you can get the configuration files from with these commands:

```bash
mkdir .platform/solr-conf
cp -r web/modules/contrib/search_api_solr/solr-conf/6.x .platform/solr-conf
``` 

Then, the structure in your Platform repository will be `./platform/solr-conf/6.x/`.

### Add a Solr service

First you need to create a Solr service.  In your `.platform/services.yaml` file, add or uncomment the following:

```yaml
solrsearch:
    type: solr:6.3
    disk: 1024
    configuration:
        cores:
            maincore:
                conf_dir: !archive "solr-conf/6.x"
        endpoints:
            solr:
                core: maincore
```
The above definition defines a single Solr 6.3 server.  That server has 1 core defined: `maincore` - the configuration for which is in the `.platform/solr-conf/6.x` directory.

It then defines one endpoints: `main` is connected to the `maincore`.

### Expose the Solr service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new Solr service.  Under the `relationships` section, add or uncomment the following:

```
relationships:
    solr: 'solrsearch:main'
```

That is, the application's environment would include a `solr` relationship that connects to the `main` endpoint, which is the `maincore` core

The key (left side) is the name that will be exposed to the application in the `PLATFORM_RELATIONSHIPS` [variable](/development/variables.md).  The right hand side is the name of the service we specified above (`solrsearch`) and the endpoint (`main`).  If you named the service something different above, change `solrsearch` to that. The same rule is valid for the value of the endpoint named `main`.

## Configuration

The configuration can be managed from `settings.platformsh.php` by adding the following code snippet.

- Edit the value of `$relationship_name` if you are using a different relationship.

- Edit the value of `$solr_server_name` if you want to configure a Solr server in Drupal other than the default server automatically created by Search API Solr module.

```php
<?php
// Configures the Solr server.
if (isset($_ENV['PLATFORM_RELATIONSHIPS'])) {
  $relationships = json_decode(base64_decode($_ENV['PLATFORM_RELATIONSHIPS']), TRUE);

  // Edit this value to match the Solr relationship name defined in your
  // '.platform.app.yaml' file. In this example it is 'solr'.
  $relationship_name = 'solr';

  if (!empty($relationships[$relationship_name][0])) {
    // Edit this value to use the the machine name of the Solr server in Drupal
    // if you are using a different server than the default one automatically
    // created by the module Search API Solr, which is named 'default_solr_server'.
    $solr_server_name = 'default_solr_server';

    $solr = $relationships[$relationship_name][0];

    // Gets the name of the Solr core from the Platform.sh relationship. Uses
    // 'collection1' if empty to conform with the default Solr service single
    // core configuration for versions lower than 6.x.
    $core = substr($solr['path'], 5) ? : 'collection1';

    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['core'] = $core;

    // The path is always 'solr'.
    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['path'] = '/solr';

    // Gets the host and port from the values returned from the relationship.
    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['host'] = $solr['host'];
    $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config']['port'] = $solr['port'];
  }
}
```

> **note**
> At this time, bugs in Drupal 8 configuration system prevent new Solr servers from being added via configuration. The default server is automatically created by Search API Solr module if you enable its Solr Search Defaults sub-module, so this configuration will work fine for it. For multiple Solr servers or a different one other than the default you must add the new server(s) at the Search API administration page `/admin/config/search/search-api/add-server`. The newly created server(s) will use its configuration from code. See this [issue](https://www.drupal.org/node/2744057) for more information.
> Moreover, the configuration in effect will always be the configuration in code, even if a matching server is edited via the Search API Solr administration pages.
