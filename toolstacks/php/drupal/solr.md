Using Solr with Drupal 7.x
==========================

Requirements
------------

You will need to add the [Search
API](https://www.drupal.org/project/search_api) and [Search API
Solr](https://www.drupal.org/project/search_api_solr) modules to your
project.

If you are using a make file, you can add those lines to your
`project.make`:

``` {.sourceCode .ini}
projects[search_api][version] = 1.13
projects[search_api_solr][version] = 1.x-dev
```

> -   drush\_make\_files

Configuration
-------------

Go to `/admin/config/search/search_api` and click on *Add Server*. Give
the server a name and a description.

-   Server class: *Solr service*
-   Solr host: `solr.internal`
-   Solr port: `8080`
-   Solr path: `/solr`

