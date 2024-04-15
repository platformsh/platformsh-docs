---
title: "Symfony CLI Tips"
weight: 250
description: |
    Find out about the most useful commands when using the Symfony CLI.
---

The [Symfony CLI](https://symfony.com/download) allows you to interact with your project from the command line.

It wraps the [{{% vendor/name %}} CLI](/administration/cli/_index.md) with added features related to Symfony.
So when using Symfony, you can replace `{{% vendor/cli %}} <command>` by `symfony {{% vendor/cli %}}:<command>` in all of your commands.

## Useful Symfony CLI commands

-   Open the web administration console:

    ```bash
    symfony {{% vendor/cli %}}:web
    ```

-   Open the URL of the current environment:

    ```bash
    symfony {{% vendor/cli %}}:url
    ```

-   Open an SSH connection to your environment:

    ```bash
    symfony {{% vendor/cli %}}:ssh
    ```

-   Configure a project for {{% vendor/name %}}:

    ```bash
    symfony project:init --{{% vendor/cli %}}
    ```

-   Get a list of all the domains:

    ```bash
    symfony {{% vendor/cli %}}:domains
    ```

-   Create a new environment:

    ```bash
    symfony {{% vendor/cli %}}:branch new-branch
    ```

-   Get a list of all the environments:

    ```bash
    symfony {{% vendor/cli %}}:environments
    ```

-   Push code to the current environment:

    ```bash
    symfony {{% vendor/cli %}}:push
    ```

-   Get a list of all the active projects:

    ```bash
    symfony {{% vendor/cli %}}:projects
    ```

-   Add a user to the project:

    ```bash
    symfony {{% vendor/cli %}}:user:add
    ```

-   List variables:

    ```bash
    symfony {{% vendor/cli %}}:variables
    ```

### Useful commands when using Symfony with a database

-   Create a local dump of the remote database:

    ```bash
    symfony {{% vendor/cli %}}:db:dump --relationship database
    ```

-   Run an SQL query on the remote database:

    ```bash
    symfony {{% vendor/cli %}}:sql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    symfony {{% vendor/cli %}}:sql < my_database_backup.sql
    ```

    {{< guide-buttons previous="Back" >}}
