---
title: "Glossary"
weight: 1
sidebarIgnore: true
aliases:
  - "/glossary.html"
  - "/GLOSSARY.html"
---

## Active environment

An environment that's deployed.
See how to [deactivate an environment](../overview/environments/deactivate-environment.md).

## Branch

Branching an environment means creating a new branch in the Git repository and an exact copy of that environment.

The new environment includes all of the parent environment's:

* Code
* Running services and their configuration (only copies, not the data)
* Data that's stored on disk (databases, uploaded files, and so on)

This means that when you branch an environment, you also branch the complete infrastructure.

When you branch an environment, three things happen:

* A new branch is created in Git.
* Your apps are rebuilt on the new branch, if necessary.
  (This is skipped if the same code with the same [variables](../development/variables/_index.md) has been built for any environment.)
* The new branch is deployed.

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
It has no data of its own.
If you reactivate it, it copies data from its parent.

See how to [reactivate an environment](../overview/environments/deactivate-environment.md#reactivate-an-environment).

## Live environment

A publicly accessible environment that's deployed from the Production branch under a production plan.

## Merge

Merging an environment means copying any code changes from that environment into its parent environment
and redeploying the parent.

When you merge an environment, three things happen:

* Any code changes are merged via Git to the parent branch.
* Your apps rebuilt on the parent branch, if necessary.
  (This is skipped if the same code with the same [variables](../development/variables/_index.md) has been built for any environment.)
* The parent branch is deployed.

## PaaS

A Platform as a Service is an end-to-end hosting solution
that includes workflow tools, APIs, and other functionality above and beyond basic hosting.
The best example is Platform.sh (although we're a little biased).

## Production plan

A subscription level that allows you to host your production website
by adding a domain and a custom SSL certificate.

## Sync

Synchronizing an environment means copying changes from a parent into a child environment
and then redeploying the child environment.
You can synchronize only the code, only the data (databases, files), or both.

Be aware that sync has the same process and same concerns as [backups](../administration/backup-and-restore.md#backups-and-downtime).

Sync is only available if your branch has no unmerged commits and can be fast-forwarded.

It's good practice to take a backup of your environment before synchronizing it.

## Transport Layer Security (TLS)

TLS is the successor of Secure Socket Layer (SSL).
It provides the cryptographic "S" in HTTPS.
It's often still referred to as SSL
even though it has largely replaced SSL for online encrypted connections.
