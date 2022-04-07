---
title: "Using Solr with Drupal 9.x"
sidebarTitle: "Solr"
description: |
    Add a Solr server to your site and connect it to Drupal.
weight: -50
---

The Drupal [Search API Solr](https://www.drupal.org/project/search_api_solr) module has a somewhat involved setup process, as it requires live access to the Solr server in order to generate the configuration files for it.
The following procedure is therefore necessary to ensure each step is able to proceed.

Search API Solr stores its configuration in the Drupal Configuration API.
However, that system does not support environment-aware information.
The setup process therefore depends on config-overrides in `settings.platformsh.php`, which may need to be modified slightly depending on  your Solr configuration.

Search API Solr requires Solr 6.6 or higher, and recommends Solr 8 or higher.

Advanced Solr service configuration and implementation in frameworks other than Drupal can be found at the [Solr services page](/configuration/services/solr.md).

## Steps

### 0. Upgrade Symfony Event Dispatcher

If you are running Drupal older than 8.8 and installing Search API Solr older than 4.1, a small workaround will be needed.
The Solarium library used by Search API Solr requires the 4.3 version of the Symfony Event Dispatcher, whereas Drupal core ships with 3.4.
The Search API Solr issue queue has a [more detailed description](https://www.drupal.org/project/search_api_solr/issues/3085196) of the problem.

As noted there, the workaround for now is to run:

```bash
composer require symfony/event-dispatcher:"4.3.4 as 3.4.35"
```

in your project root and commit the resulting change to `composer.json` and `composer.lock`.
That will cause Composer to install the 4.3 version of Event Dispatcher.
Once [this issue](https://www.drupal.org/project/drupal/issues/2876675) is resolved in core, this step will no longer be necessary.

If you are using the latest version of Search API Solr and running Drupal 8.8 or higher on PHP 7.2 or higher, this step is no longer necessary. You should be able to proceed directly to the next step.

{{% endpoint-description type="solr" sectionLink="/configuration/services/solr.html#solr-6-and-later" multipleText="cores" noApp=true /%}}

### 4. Configure the server core

Update the Solr server to have a single core (`maincore`) with the default configuration.
(This default isn't suitable for production, but enables connections.)
And define a single endpoint (`main`) that connects to this core.

```yaml {location=".platform/services.yaml"}
searchsearch:
    type: solr:8.6
    disk: 1024
    configuration:
        cores:
            maincore: {}
        endpoints:
            main:
                core: maincore
```

### 5. Add the Drupal modules

You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Search API Solr](https://www.drupal.org/project/search_api_solr) modules to your project. If you are using Composer to manage your Drupal site (which we recommend), run:

```bash
$ composer require drupal/search_api_solr
```

And then commit the changes to `composer.json` and `composer.lock`.

### 6. Add auto-configuration code to `settings.platformsh.php`

The configuration can be managed from `settings.platformsh.php` by adding the following code snippet.
It will override the environment-specific parts of the configuration object with the correct values to connect to the Platform.sh Solr instance.

{{< note >}}
If you do not already have the Platform.sh Config Reader library installed and referenced at the top of the file, you will need to install it with `composer require platformsh/config-reader` and then add the following code before the block below:

```php
<?php

$platformsh = new \Platformsh\ConfigReader\Config();
if (!$platformsh->inRuntime()) {
   return;
}
```
{{< /note >}}

* Edit the value of `$relationship_name` if you are using a different relationship.

* Edit the value of `$solr_server_name` if you want to configure a Solr server in Drupal other than the default server automatically created by Search API Solr module.

```php
<?php

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

### 7. Enable the modules

Once the site is deployed, go to the `/admin/modules` page and enable the "Search API Solr" module.
Also enable the "Search API Solr Search Defaults" module in order to get a default server configuration.
If you would rather create one yourself you may do so but then you must change the value of `$solr_server_name` in the code snippet in `settings.platformsh.php`.

### 8. Export and modify configuration

In the Drupal admin area, go to `/admin/config/search/search-api` and select your server.
(If you used the Search Defaults module, it will be named "Solr Server").
First verify that the module is able to connect to your Solr instance by ensuring that the "Server connection" reports "The Solr server could be reached."

You can now generate a `config.zip` file using the button at the top of the page.
That will produce a Solr configuration that is customized for your current field configuration.
Extract the file into the `.platform` directory of your site.
It should unpack into a directory named `solr_8.x_config` or similar.

Inside that directory, locate the `solrcore.properties` file.
In that file, *delete* the entry for `solr.install.dir` if it exists.
Its default value will not work, and it is not required for Solr to operate.
(The server already knows its installation directory.)

Finally, move that directory to `.platform/`, and update the `maincore.conf_dir` to point to it.
The `services.yaml` entry should now look approximately like this:

```yaml
solrsearch:
    type: solr:8.6
    disk: 1024
    configuration:
        cores:
            maincore:
                conf_dir: !archive "solr_8.x_config/"
        endpoints:
            main:
                core: maincore
```

Add the new directory and updated `services.yaml` to Git, commit, and push.

{{< note >}}
If you change your Solr configuration in Drupal, say to change the Solr field configuration, you may need to regenerate your configuration.
If so, repeat this entire step.
{{< /note >}}

### 9. Verify that it worked

Return to the Drupal UI for your server page.
After deploying and reloading the page, the "Core Connection" field should now read "The Solr core could be accessed".
