---
title: "Glossary"
weight: 1
sidebarIgnore: true
---

## Active environment

An environment that's deployed.
See how to [deactivate an environment](../environments/deactivate-environment.md).

## Apex domain

An apex domain is a domain name that doesn't include a subdomain.

For example, `example.com` is an apex domain and `www.example.com` is a subdomain.

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

To create a new branch from an existing environment:


{{< codetabs >}}

+++
title=In the Console
file=none
highlight=false
+++

- Navigate to the environment you want to branch from.
- Click {{< icon branch >}} **Branch**.
- Enter a name for the new branch.
- Select which environment type it should be.
- Click **Create branch**.

<--->
+++
title=Using the CLI
file=none
highlight=false
+++

Run:

```bash
platform branch <NEW_BRANCH_NAME> <PARENT_BRANCH_NAME>
```

To define the environment type for the branch, include `--type <ENVIRONMENT_TYPE>`.

For example, to create the branch `develop` as a Development environment from the branch `main`, run:

```bash
platform branch develop main --type development
```

{{< /codetabs >}}

## Cluster

Every active environment is deployed as a cluster,
which is a collection of independent containers
representing the different services that make up your web application.
That may include a database container, an Elasticsearch container,
a container for your application, and more.
They're always deployed together as a single unit.

## {{% names/dedicated-gen-2 %}}

[{{% names/dedicated-gen-2 %}} environments](../dedicated-gen-2/overview/_index.md) are managed virtual machine clusters with triple redundancy.
Their dedicated architecture makes them differ from [Grid environments](#grid).
See a [list of differences](../dedicated-gen-2/overview/grid.md).

These differences aren't present with [{{% names/dedicated-gen-3 %}} projects](../dedicated-gen-3/overview.md).

## Deprecated versions

Older versions of languages and services eventually reach the end of their lives.
This means they stop getting security and other updates and may have security vulnerabilities.

When that happens, the versions in Platform.sh are deprecated.
This means you can still use them in your project, but they aren't fully secure.
It's also possible they'll stop working at some point.

If you're using a deprecated version, you should upgrade to a supported version as soon as possible.

## Drush

Drush is a command-line shell and scripting interface for Drupal.

## Drush aliases

Drush site aliases allow you to define short names
that let you run Drush commands on specific local or remote Drupal installations.
The Platform.sh CLI configures Drush aliases for you on your local environment
(via `platform get` or `platform drush-aliases`).
You can also configure them manually.

## Grid

Grid environments are standard for Professional plans.
They run on shared infrastructure.
This architecture makes them different from [{{% names/dedicated-gen-2 %}} environments](#dedicated-gen-2).

## Inactive environment

An environment that isn't deployed.
It has no data of its own and no running services.
If you reactivate it, it copies data from its parent.

See how to [reactivate an environment](../environments/deactivate-environment.md#reactivate-an-environment).

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
by adding a domain and [a custom SSL certificate](../domains/steps/tls.md).

## Sync

Synchronizing an environment means copying changes from a parent into a child environment
and then redeploying the child environment.
You can synchronize only the code, only the data (databases, files), or both.

Be aware that sync has the same process and same concerns as [backups](../environments/backup.md#backups-and-downtime).

Sync is only available if your branch has no unmerged commits and can be fast-forwarded.

It's good practice to take a backup of your environment before synchronizing it.

## Transport Layer Security (TLS)

TLS is the successor of Secure Socket Layer (SSL).
It provides the cryptographic "S" in HTTPS.
It's often still referred to as SSL
even though it has largely replaced SSL for online encrypted connections.
