---
title: Tethered local
weight: -90
description: Connect a locally running Symfony server directly to active services on a Platform.sh environment.
sectionBefore: Supported environments
---

{{< note theme="info" >}}
{{% ddev/local-note name="Symfony" link="/guides/symfony/local/ddev" %}}
{{< /note >}}

To test changes locally, you can connect your locally running Django server
to service containers on an active Platform.sh environment.

{{% guides/local-requirements name="Symfony" %}}

{{% guides/symfony/local-assumptions redis-guide-link=../customize/redis postgresql-guide-link=../customize/postgresql %}}

You can use these settings to set up a tethered connection to services running on a Platform.sh environment.
The settings are used to mock the conditions of the environment locally.

## Create the tethered connection

1.  Create a new environment off of production.

    ```bash
    symfony branch new-feature main
    ```

2.  Open an SSH tunnel to the new environment's services by running the following command:

    ```bash
    symfony tunnel:open
        SSH tunnel opened to rediscache at: redis://127.0.0.1:30000
        SSH tunnel opened to database at: pgsql://main:main@127.0.0.1:30001/main

        Logs are written to: /Users/acmeUser/.platformsh/tunnels.log

        List tunnels with: symfony tunnels
        View tunnel details with: symfony tunnel:info
        Close tunnels with: symfony tunnel:close

        Save encoded tunnel details to the PLATFORM_RELATIONSHIPS variable using:
        export PLATFORM_RELATIONSHIPS="$(symfony tunnel:info --encode)"
    ```

    This command returns the addresses for SSH tunnels to all of your services.

3.  Make Symfony uses SSH tunnel to database connection

    Modify you `.env` file with given SSH tunnel opened to database
    ``` {location=".env"}
    DATABASE_URL="pgsql://main:main@127.0.0.1:30001/new-feature"
    ```

4.  Add ``predis/predis`` to your composer dependencies
    ````bash
    symfony composer require "predis/predis"
    ````

5.  Make Symfony uses SSH tunnel to Redis component

    ```yaml {location="config/packages/cache.yaml"}
    framework:
        cache:
            # Redis
            app: cache.adapter.redis
            default_redis_provider: redis://127.0.0.1:30000
    ```

6. Clear all Symfony Caches
    ```bash
    symfony console cache:clear && symfony console cache:pool:clear cache.app
    ```

7.  When you've finished your work, close the tunnels to your services by running the following command:

    ```bash
    platform tunnel:close --all -y
    ```

{{% guides/symfony/local-next-steps-start %}}

{{< readFile file="snippets/guides/symfony/tethered/local.sh" highlight="yaml" location="init-local.sh" >}}

{{% guides/symfony/local-next-steps-end %}}
