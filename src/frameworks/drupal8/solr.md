# Using Solr with Drupal 8.x

Platform.sh recommends using Solr version 6.6, yet we support [other versions](../../configuration/services/solr.md#supported-versions). The following instructions are for Solr 6, but they also work for the previous versions if you change the version numbers accordingly.

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
    type: solr:6.6
    disk: 1024
    configuration:
        cores:
            maincore:
                conf_dir: !archive "solr-conf/6.x"
        endpoints:
            main:
                core: maincore
```

The above definition defines a single Solr 6.6 server.  That server has 1 core defined: `maincore` - the configuration for which is in the `.platform/solr-conf/6.x` directory.

It then defines one endpoint: `main` is connected to the `maincore`.

### Expose the Solr service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new Solr service.  Under the `relationships` section, add or uncomment the following:

```
relationships:
    solr: 'solrsearch:main'
```

That is, the application's environment would include a `solr` relationship that connects to the `main` endpoint, which is the `maincore` core.

The key (left side) is the name that will be exposed to the application in the `PLATFORM_RELATIONSHIPS` [variable](/development/variables.md).  The right hand side is the name of the service we specified above (`solrsearch`) and the endpoint (`main`).  If you named the service something different above, change `solrsearch` to that. The same rule is valid for the value of the endpoint named `main`.

## Configuration

The configuration can be managed from `settings.platformsh.php` by adding the following code snippet.

> **note**
>
> If you do not already have the Platform.sh Config Reader library installed and referenced at the top of the file, you will need to install it with `composer require platformsh/config-reader` and then add the following code before the block below:
>
> ```php
> $platformsh = new \Platformsh\ConfigReader\Config();
> if (!$platformsh->inRuntime()) {
>   return;
> }
> ```

- Edit the value of `$relationship_name` if you are using a different relationship.

- Edit the value of `$solr_server_name` if you want to configure a Solr server in Drupal other than the default server automatically created by Search API Solr module.

```php
// Update these values to the relationship name (from .platform.app.yaml)
// and the machine name of the server from your Drupal configuration.
$relationship_name = 'solr';
$solr_server_name = 'default_solr_server';
if ($platformsh->hasRelationship($relationship_name)) {
  $platformsh->registerFormatter('drupal-solr', function($solr) {
    // Default the solr core name to `collection1` for pre-Solr-6.x instances.
    return [
      'core' => substr($solr['path'], 5) ? : 'collection1',
      'path' => '/solr',
      'host' => $solr['host'],
      'port' => $solr['port'],
    ];
  });

  // Set the connector configuration to the appropriate value, as defined by the formatter above.
  $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config'] = $platformsh->formattedCredentials($relationship_name, 'drupal-solr');
}
```

Commit that code and push.  The specified cluster will now always point to the Solr service on the specified core.  Then configure Search API as normal.


> **note**
> At this time, bugs in Drupal 8 configuration system prevent new Solr servers from being added via configuration. The default server is automatically created by Search API Solr module if you enable its Solr Search Defaults sub-module, so this configuration will work fine for it. For multiple Solr servers or a different one other than the default you must add the new server(s) at the Search API administration page `/admin/config/search/search-api/add-server`. The newly created server(s) will use its configuration from code. See this [issue](https://www.drupal.org/node/2744057) for more information.
> Moreover, the configuration in effect will always be the configuration in code, even if a matching server is edited via the Search API Solr administration pages.
