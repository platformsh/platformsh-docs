---
title: Symfony Server with tethered data
weight: -110
description: |
    Sync Platform.sh data with your local Symfony application to start contributing.
---

A significant amount of work developing Symfony takes place locally rather than on an active Platform.sh environment.
You want to ensure that the process of local development is as close as possible to a deployed environment.

You can achieve this through various approaches.

To test changes locally, you can connect your locally running Symfony server
to service containers on an active Platform.sh environment.

You can use these settings to set up a tethered connection to services running on a Platform.sh environment.
The settings are used to mock the conditions of the environment locally.

{{% guides/local-requirements name="Symfony" %}}


## Start your Symfony Server
At first, you need to start your web Server locally to display your Symfony application.

```bash
symfony server:start -d
symfony open:local
```

It will start the Symfony server and open the application in your local browser.

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

3.  Make Symfony uses SSH tunnels
    Connect your Symfony application to all of your Platform.sh services, using SSH tunnels

    ```bash
    symfony var:expose-from-tunnel
    ```
    This will configure automatically your local Symfony application to use remote database, remote Redis component, ...etc, all of your defined services

    Then reload your local application within your browser, and you should that now you use remote data and component from Platform.sh project

4.  When you've finished your work, close the tunnels to your services by running the following command:

    ```bash
    symfony var:expose-from-tunnel --off
    symfony tunnel:close --all -y
    ```

{{< note title="Warning" >}}
Working on remote environment data can lead your local updates to be pushed in production and thus, crash your production website.
Be careful when using this method.
{{< /note >}}

{{% guides/symfony/local-next-steps-start %}}
    {{< readFile file="snippets/guides/symfony/tethered.sh" highlight="yaml" location="init-local.sh" >}}
{{% guides/symfony/local-next-steps-end %}}
