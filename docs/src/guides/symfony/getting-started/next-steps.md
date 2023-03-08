---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    With Symfony deployed, set up your local development environment, compliance requirements, and more.
---

## Local development

Once Symfony has been deployed on Platform.sh, you need to set up a local development environment to begin making revisions.
For more information, consult the [Symfony local development guides](../local).

## Use Redis component

Once Symfony has been deployed on Platform.sh, you can modify your Symfony application to use Redis component for caching.
For more information, consult the [Configure Symfony to use Redis component](../customize/redis.md).

## Use PostgreSQL

Symfony Demo comes with a default SQLite database engine. You can modify your Symfony application to use PostgreSQL database engine.
For more information, consult the [Configure Symfony to use PostgreSQL](../customize/postgresql.md).

## Sanitize data

By default, each development environment automatically inherits all data from its parent environment.
So a developer working on a small feature has access to production data,
including personally identifiable information (PII).
This workflow isn't always desirable or even acceptable based on your compliance requirements.

For how to enforce compliance requirements for user data across environments,
see how to [sanitize databases](../../../development/sanitize-db/postgresql-symfony.md).

## External resources
The community also provides a number of open-source starting points you can consult:

- [SymfonyCasts](https://symfonycasts.com/tracks/symfony) maintained by [@weaverryan](https://github.com/weaverryan)
- [Symfony blog - Introducing the Symfony Demo application](https://symfony.com/blog/introducing-the-symfony-demo-application) maintained by [@javier.eguiluz](https://connect.symfony.com/profile/javier.eguiluz)

## Tips and tricks

### Symfony CLI

{{% tips-and-tricks/symfony/cli %}}
{{% tips-and-tricks/symfony/cli-database %}}

{{< guide-buttons type="last" >}}
