---
title: Symfony Server
weight: -110
layout: single
description: |
    Set up an environment with Platform.sh's recommended local development tool, Symfony Server.
sectionBefore: Integrated environments
---


{{% guides/local-requirements name="Symfony" %}}
- DDEV installed on your computer.

{{% ddev/requirements %}}

{{% ddev/install %}}

{{% guides/symfony/local-assumptions redis-guide-link=../customize/redis postgresql-guide-link=../customize/postgresql %}}

## Set up DDEV

1.  Create a new environment off of production.

    ```bash
    symfony branch new-feature main
    ```

    If you're using a [source integration](../../../integrations/source/_index.md),
    open a merge/pull request.

2.  Add DDEV configuration to the project.

    ```bash
    ddev config
        Project name (sfcon-bigfoot1-workshop): <enter>
        Docroot Location (public): public
        Project Type [backdrop, craftcms, drupal10, drupal6, drupal7, drupal8, drupal9, laravel, magento, magento2, php, shopware6, typo3, wordpress] (php): php
    ```

3.  Create an API Token

    To pull data from your Platform.sh project, you need to create a [Platform.sh API Token](../../../administration/cli/api-tokens.html#2-create-a-platformsh-api-token)

4.  Connect DDEV to your project and the `new-feature` environment.

    {{% ddev/connect %}}

5.  Get your Platform.sh project data locally.

    ```bash
    ddev pull platform
    ```

6. Launch your DDEV site.

    As `ddev pull platform` already started all needed services, no need to run `ddev start`, you can use the DDEV CLI to open your application

    ```bash
    ddev launch
    ```

{{% guides/symfony/local-next-steps-start name="DDEV" %}}

{{< readFile file="snippets/guides/symfony/ddev/local.sh" highlight="yaml" location="init-local.sh" >}}

{{% guides/symfony/local-next-steps-end %}}

## Tips and tricks

{{% tips-and-tricks/ddev %}}
