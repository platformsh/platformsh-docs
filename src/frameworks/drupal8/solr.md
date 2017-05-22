# Using Solr with Drupal 8.x

## Steps
  - Enable Solr Service
  - Enable the Solr relationship
  - Download and enable the modules
  - Configure Search API Solr

### Enable Solr Service
Different Solr versions are supported. Advanced configuration may be found at the [Solr Service documentation page](../../configuration/services/solr.md).

Basically, uncomment or add these lines to your ``.platform/services.yaml``:
```yaml
solrsearch:
    type: "solr:4.10"
    disk: 1024
```
### Enable the Solr relationship
Again, this is the basic configuration. For multi core and additional information read the [Solr Service documentation page](../../configuration/services/solr.md).

In your ``.platform/services.yaml``, uncomment or add:
```yaml
relationships:
    solr: 'solrsearch:solr'
```

### Download and enable the modules
You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Search API Solr](https://www.drupal.org/project/search_api_solr) modules to your project.

If you are using composer, the easiest way to add them is to simply run:

```bash
$ composer require drupal/search_api drupal/search_api_solr
```

And then commit the changes to `composer.json` and `composer.lock`.

Now, enable the modules in your Platform website via the Drupal UI or via a command line tool like Drush or Drupal Console.

### Configuration

Go to `/admin/config/search/search_api` and click on *Add Server*. Give
the server a name and a description.

-   Server class: *Solr service*
-   Solr host: `solr.internal`
-   Solr port: `8080`
-   Solr path: `/solr`

> **note**
> The name of the host depends on the name you gave the relationship in `.platform.app.yaml`. If
> you called the relationship `solrsearch` instead, then the hostname will be `solrsearch.internal`.

> **note**
> At this time, bugs in Drupal 8 prevent the Solr configuration from being managed from `settings.platformsh.php`.  See [these](https://www.drupal.org/node/2682369) [issues](https://www.drupal.org/node/2744057) for more information.
