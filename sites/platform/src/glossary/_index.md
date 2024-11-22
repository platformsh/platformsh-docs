---
title: "Glossary"
weight: -15
---

## Active environment

An environment that's deployed.
See how to [activate an environment](../environments/deactivate-environment.md#reactivate-an-environment).

## Apex domain

An apex domain is a domain name that doesn't include a subdomain.

For example, `example.com` is an apex domain and `www.example.com` is a subdomain.

## Branch

Branching an environment means creating a new branch in the Git repository and an exact copy of that environment.

The new environment includes all of the parent environment's:

- Code
- Running services and their configuration (only copies, not the data)
- Data that's stored on disk (databases, uploaded files, and so on)

This means that when you branch an environment, you also branch the complete infrastructure.

When you branch an environment, three things happen:

- A new branch is created in Git.
- Your apps are rebuilt on the new branch, if necessary.
  (This is skipped if the same code with the same [variables](../development/variables/_index.md) has been built for any environment.)
- The new branch is deployed.

To create a new branch from an existing environment:


{{< codetabs >}}

+++
title=In the Console
+++

- Navigate to the environment you want to branch from.
- Click {{< icon branch >}} **Branch**.
- Enter a name for the new branch.
- Select which environment type it should be.
- Click **Create branch**.

<--->
+++
title=Using the CLI
+++

Run:

```bash
{{% vendor/cli %}} branch <NEW_BRANCH_NAME> <PARENT_BRANCH_NAME>
```

To define the environment type for the branch, include `--type <ENVIRONMENT_TYPE>`.

For example, to create the branch `develop` as a [preview environment](#preview-environment) ([development type](#environment-type)) from the branch `main`, run:

```bash
{{% vendor/cli %}} branch develop main --type development
```

{{< note theme="warning" title="Warning" >}}

If you're using a [source integration](/integrations/source/_index.md),
running this command results in an error stating that the operation is not available.

This is because when a source integration is enabled,
all branching and merging must be managed through the upstream repository to avoid merge conflicts.

{{< /note >}}

{{< /codetabs >}}

## Ceph

Ceph is a storage platform that provides distributed object, block and file storage built on a cluster foundation. Ceph can be used to provide reliable, redundant distributed storage for your data.

## Cluster

Every active environment is deployed as a cluster,
which is a collection of independent containers
representing the different services that make up your web application.
That may include a database container, an Elasticsearch container,
a container for your application, and more.
They're always deployed together as a single unit.

## Control plane

The control plane is Platform.sh’s orchestration, control, and management environment. It helps us to establish and operate regions, provision services and networks.


## {{% names/dedicated-gen-2 %}}

[{{% names/dedicated-gen-2 %}} environments](/dedicated-environments/dedicated-gen-2/overview.md) are managed host clusters with triple redundancy.
Their dedicated architecture makes them differ from [Grid environments](#grid).
See a [list of differences](/dedicated-environments/dedicated-gen-2/environment-differences.md).

These differences aren't present with [{{% names/dedicated-gen-3 %}} projects](/dedicated-environments/dedicated-gen-3/_index.md).

## Deprecated versions

Older versions of languages and services eventually reach the end of their lives.
This means they stop getting security and other updates and may have security vulnerabilities.

When that happens, the versions in {{% vendor/name %}} are deprecated.
This means you can still use them in your project, but they aren't fully secure.
It's also possible they'll stop working at some point.

If you're using a deprecated version, you should upgrade to a supported version as soon as possible.

## Drush

Drush is a command-line shell and scripting interface for Drupal.

## Drush aliases

Drush site aliases allow you to define short names
that let you run Drush commands on specific local or remote Drupal installations.
The {{% vendor/name %}} CLI configures Drush aliases for you on your local environment
(via `{{% vendor/cli %}} get` or `{{% vendor/cli %}} drush-aliases`).
You can also configure them manually.

## Environment

An [environment](../environments/_index.md) is a standalone copy of your site,
complete with code, data, and running services.
Your production environment comes from the [default branch](../environments/_index.md#default-environment)
and you can set up any other branch as a testing environment.

## Environment type

{{< vendor/name >}} offers three environment types:

- Your **production environment** is your live site.
- A **development environment** is an isolated environment where you can safely develop new features without affecting production.
- A **staging environment** has a similar configuration to your production environment (but usually with less resources for cost optimization).
  It is useful to perform user acceptance testing in a production-like setting.

The phrase "[preview environment](#preview-environment)" can apply to both a development or staging environment,
as it merely describes a non-production environment.

Find out more about [user roles on each environment type](../administration/users.md#environment-type-roles).

## Grid

Grid environments are standard for Professional plans.
They run on shared infrastructure.
This architecture makes them different from [{{% names/dedicated-gen-2 %}} environments](#dedicated-gen-2).

## Inactive environment

An environment that isn't deployed.
It has no data of its own and no running services.
If you reactivate it, it copies data from its parent.

See how to [deactivate an environment](../environments/deactivate-environment.md).

## Live environment

A publicly accessible environment that's deployed from the Production branch under a production plan.

## MB

MB stands for megabyte, which means 1,000,000 bytes.
This unit is based on powers of 10.

Some reporting tools, such as those used by the [CLI](../administration/cli/_index.md),
use binary megabytes, also known as mebibytes and abbreviated as MiB.
This unit is based on powers of 2 and so 1&nbsp;MiB equals 1024<sup>2</sup> or 1,048,576 bytes.
So 1&nbsp;MB is less than 1&nbsp;MiB.

So you may see differences in the numbers you configure for a disk (in MB)
and the values reported when you check disk size with tools that report in MiB.

## Merge

Merging an environment means copying any code changes from that environment into its parent environment
and redeploying the parent.

When you merge an environment, three things happen:

- Any code changes are merged via Git to the parent branch.
- Your apps rebuilt on the parent branch, if necessary.
  (This is skipped if the same code with the same [variables](../development/variables/_index.md) has been built for any environment.)
- The parent branch is deployed.

## PaaS

A Platform as a Service is an end-to-end hosting solution
that includes workflow tools, APIs, and other functionality above and beyond basic hosting.
The best example is {{% vendor/name %}}(although we're a little biased).

## Preview environment

A preview environment is a non-production environment you can use to develop and/or test changes without affecting production.</br>
A preview environment can either be a development environment or a staging environment.
Staging environments have an identical software configuration to your production hardware but reduced hardware specs.
They are useful to perform user acceptance testing.

## Production plan

A subscription level that allows you to host your production website
by adding a domain and [a custom SSL certificate](../domains/steps/tls.md).

## Project

A [project](../projects/_index.md) is the site that you’re working on.
Each project corresponds to one Git repository.
A project can contain multiple apps that run in their own isolated containers.
Each branch of a project can be deployed in its own environment.

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
even though it has mostly replaced SSL for online encrypted connections.
