## Active Environment

An environment which is deployed. You can deactivate an active environment from the environment configuration page on Platform.sh Web Interface.

## Cluster

Every active environment is deployed as a cluster, that is, a collection of independent containers representing different services that make up your web application. That may include a database container, an Elasticsearch container, a container for your application, etc. They are always deployed together as a single unit.

## Drush

[Drush](https://www.drush.org/) is a command-line shell and scripting interface for Drupal.

## Drush aliases

Drush [site aliases](https://docs.drush.org/en/master/usage/#site-aliases) allow you to define short names that let you run Drush commands on specific local or remote Drupal installations. The Platform.sh CLI configures Drush aliases for you on your local environment (via `platform get` or `platform drush-aliases`). You can also configure them manually.

## Inactive environment

An environment which is not deployed. You can activate an inactive environment from the
environment configuration page on Platform.sh Web Interface.

## Live Environment

An environment which is deployed from the `master` branch under a production plan.

## PaaS

A Platform as a Service is an end-to-end hosting solution that includes workflow tools, APIs, and other functionality above and beyond basic hosting. The best example is Platform.sh (although we are a little biased).

## Production plan

A subscription level which allows you to host your production website by adding a domain and a custom SSL certificate.

## TLS

[Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) is the successor of SSL (Secure Socket Layer). It provides the cryptographic "S" in HTTPS. It's often still referred to as SSL even though it has largely replaced SSL for online encrypted connections.
