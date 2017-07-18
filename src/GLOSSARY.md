## Drush aliases
Drush [site aliases](http://docs.drush.org/en/master/usage/#site-aliases) allow you to define short names that let you run Drush commands on specific local or remote Drupal installations. The Platform.sh CLI configures Drush aliases for you on your local environment (via `platform get` or `platform drush-aliases`). You can also configure them manually.

## Drush
[Drush](http://www.drush.org/) is a command-line shell and scripting interface for Drupal.

## Live Environment
An environment which is deployed from the `master` branch under a production plan.

## Active Environment
An environment which is deployed. You can deactivate an active environment from the environment configuration page on Platform.sh Web Interface.

## Inactive environment
An environment which is not deployed. You can activate an inactive environment from the
environment configuration page on Platform.sh Web Interface.

## Production plan
A subscription level which allows you to host your production website by adding a domain and a custom SSL certificate.

## PaaS
A Platform as a Service is an end-to-end hosting solution that includes workflow tools, APIs, and other functionality above and beyond basic hosting.  The best example is Platform.sh (although we are a little biased).

## YAML
[YAML](https://en.wikipedia.org/wiki/YAML) ("YAML Ain't Markup Language") is a human-readable data file format, well suited to human-edited configuration files.  All user-configuration files at Platform.sh use YAML.

## Cluster
Every active environment is deployed as a cluster, that is, a collection of independent containers representing different services that make up your web application.  That may include a database container, an Elasticsearch container, a container for your application, etc.  They are always deployed together as a single unit.
