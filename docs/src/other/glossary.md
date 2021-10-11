---
title: "Glossary"
weight: 1
sidebarIgnore: true
aliases:
  - "/glossary.html"
  - "/GLOSSARY.html"
---

## Active environment

An environment which is deployed.
You can deactivate an active environment from the environment configuration page on the Platform.sh management console.

## Cluster

Every active environment is deployed as a cluster,
which is a collection of independent containers
representing the different services that make up your web application.
That may include a database container, an Elasticsearch container,
a container for your application, and more.
They're always deployed together as a single unit.

## Drush

Drush is a command-line shell and scripting interface for Drupal.

## Drush aliases

Drush site aliases allow you to define short names
that let you run Drush commands on specific local or remote Drupal installations.
The Platform.sh CLI configures Drush aliases for you on your local environment
(via `platform get` or `platform drush-aliases`).
You can also configure them manually.

## Inactive environment

An environment that isn't deployed.
You can activate an inactive environment from the environment configuration page on the Platform.sh management console.

## Live environment

An environment that's deployed from the production branch under a production plan.

## PaaS

A Platform as a Service is an end-to-end hosting solution
that includes workflow tools, APIs, and other functionality above and beyond basic hosting.
The best example is Platform.sh (although we're a little biased).

## Production plan

A subscription level that allows you to host your production website
by adding a domain and a custom SSL certificate.

## Transport Layer Security (TLS)

TLS is the successor of Secure Socket Layer (SSL).
It provides the cryptographic "S" in HTTPS.
It's often still referred to as SSL
even though it has largely replaced SSL for online encrypted connections.
