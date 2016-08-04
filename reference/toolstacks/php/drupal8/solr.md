# Using Solr with Drupal 8.x

## Requirements

You will need to add the [Search API](https://www.drupal.org/project/search_api) and [Search API Solr](https://www.drupal.org/project/search_api_solr) modules to your project.

If you are using composer, the easiest way to add them is to simply run:

```bash
$ composer require drupal/search_api drupal/search_api_solr
```

And then commit the changes to `composer.json` and `composer.lock`.

## Configuration

Go to `/admin/config/search/search_api` and click on *Add Server*. Give
the server a name and a description.

-   Server class: *Solr service*
-   Solr host: `solr.internal`
-   Solr port: `8080`
-   Solr path: `/solr`

> **note**
> The name of the host depends on the name you the relationship in `.platform.app.yaml`. If
> you called the relationship `solrsearch` instead, then the hostname will be `solrsearch.internal`.
