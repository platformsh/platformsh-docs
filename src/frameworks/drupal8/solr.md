# Using Solr with Drupal 8.x

The Drupal [Search API Solr](https://www.drupal.org/project/search_api_solr) module has a somewhat involved setup process, as it requires live access to the Solr server in order to generate the configuration files for it.  The following procedure is therefore necessary to ensure each step is able to proceed.

Search API Solr stores its configuration in the Drupal Configuration API.  However, that system does not easily support environment-aware information.  The setup process therefore depends on config-overrides in `settings.platformsh.php`, which may need to be modified slightly depending on  your Solr configuration.

Search API Solr requires Solr 6.6 or higher, and recommends Solr 8 or higher.

Advanced Solr service configuration and implementation in other frameworks other than Drupal can be found at the [Solr services page](../../configuration/services/solr.md).

## Steps

### 1. Add the Drupal modules

You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Search API Solr](https://www.drupal.org/project/search_api_solr) modules to your project. If you are using composer, the easiest way to add them is to simply run:

```bash
$ composer require drupal/search_api_solr
```
> **note**
>
> Please note there is an active issue with Search API Solr where you have to update Solarium to 5.1.x. No core patch is available yet, so this is a temporary solution awaiting a more structural one.

And then commit the changes to `composer.json` and `composer.lock`.

### 2. Add a default Solr service

Add the following to your `.platform/services.yaml` file.

```yaml
search:
    type: solr:8.0
    disk: 1024
    configuration:
        cores:
            maincore:
                conf_dir: {}
        endpoints:
            main:
                core: maincore
```

The above definition defines a single Solr 8.0 server.  That server has 1 core defined: `maincore`, which will use a default configuration.  (The default configuration is not suitable for production but will allow the module to connect to it.)

It then defines one endpoint, `main`, which is connected to the `maincore`.

### 3. Expose the Solr service to your application

In your `.platform.app.yaml` file, we now need to open a connection to the new Solr service.  Under the `relationships` section, add the following:

```yaml
relationships:
    solrsearch: 'search:main'
```

That is, the application's environment would include a `solrsearch` relationship that connects to the `main` endpoint, which is the `maincore` core.

The key (left side) is the name that will be exposed to the application in the `PLATFORM_RELATIONSHIPS` [variable](/development/variables.md).  The right hand side is the name of the service specified above (`search`) and the endpoint (`main`).  If you named the service or endpoint something than different above, change those values accordingly.

### 4. Add auto-configuration code to `settings.platformsh.php`

The configuration can be managed from `settings.platformsh.php` by adding the following code snippet.  It will override the environment-specific parts of the configuration object with the correct values to connect to the Platform.sh Solr instance.

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

* Edit the value of `$relationship_name` if you are using a different relationship.

* Edit the value of `$solr_server_name` if you want to configure a Solr server in Drupal other than the default server automatically created by Search API Solr module.

```php
$platformsh->registerFormatter('drupal-solr', function($solr) {
    // Default the solr core name to `collection1` for pre-Solr-6.x instances.
    return [
      'core' => substr($solr['path'], 5) ? : 'collection1',
      'path' => '',
      'host' => $solr['host'],
      'port' => $solr['port'],
    ];
  });

// Update these values to the relationship name (from .platform.app.yaml)
// and the machine name of the server from your Drupal configuration.
$relationship_name = 'solrsearch';
$solr_server_name = 'default_solr_server';
if ($platformsh->hasRelationship($relationship_name)) {
  // Set the connector configuration to the appropriate value, as defined by the formatter above.
  $config['search_api.server.' . $solr_server_name]['backend_config']['connector_config'] = $platformsh->formattedCredentials($relationship_name, 'drupal-solr');
}
```

If you are connecting to multiple Solr cores, repeat the second block above for each relationship/server, modifying the two variables accordingly.

Commit all of the changes above and then push to deploy.

### 5. Enable the modules

Once the site is deployed, go to the `/admin/modules` page and enable the "Search API Solr" module.  Also enable the "Search API Solr Search Defaults" module in order to get a default server configuration.  If you would rather create one yourself you may do so but then you must change the value of `$solr_server_name` in the code snippet in `settings.platformsh.php`.

### 6. Export and modify configuration

In the Drupal admin area, go to `/admin/config/search/search-api` and select your server.  (If you used the Search Defaults module, it will be named simply "Solr Server").  First verify that the module is able to connect to your Solr instance by ensuring that the "Server connection" reports "The Solr server could be reached."

You can now generate a `config.zip` file using the button at the top of the page.  That will produce a Solr configuration that is customized for your current field configuration.  Extract the file into the `.platform` directory of your site.  It should unpack into a directory named `solr_8.x_config` or similar.

Inside that directory, locate the `solrcore.properties` file.  In that file, *delete* the entry for `solr.install.dir`.  Its default value will not work and it is not required for Solr to operate.  (The server already knows its installation directory.)

A final modification would be to change the `conf_dir` in `services.yaml`. This should redirect to the directory you just created above, `conf_dir: !archive "solr_8.x_config/"` or similar.

Add the new directory to Git, commit, and push.

> **note**
>
> If you change your Solr configuration in Drupal, say to change the Solr field configuration, you may need to regenerate your configuration.  If so, repeat this entire step.

### 7. Verify that it worked

Return to the Drupal UI for your server page.  After deploying and reloading the page, the "Core Connection" field should now read "The Solr core could be accessed".
