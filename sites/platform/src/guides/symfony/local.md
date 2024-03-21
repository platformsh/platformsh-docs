---
title: Local development
weight: -80
description: |
    Sync {{% vendor/name %}} with your local environments to start contributing.
---

When you develop a Symfony project, a significant amount of work takes place
locally rather than on an active {{% vendor/name %}} environment. You want to ensure
that the process of local development is as close as possible to a deployed
environment.

You can achieve this through various approaches. For example, you can use
Symfony Server with tethered data

To do so, when testing changes locally, you can connect your locally running
Symfony Server to service containers on an active {{% vendor/name %}} environment.

This methodology has several advantages:

- It avoids installing anything on your local machine but PHP;
- It ensures that you are using the same versions of all services on your local
  machine and in production.

{{< note theme="warning" title="Warning">}}

Never use this method on the **main** environment as changes made on your local
machine will impact production data.

{{< /note >}}

{{% guides/local-requirements name="Symfony" %}}

## 1. Start your Symfony Server

To start your [Symfony
Server](https://symfony.com/doc/current/setup/symfony_server.html) locally and
display your Symfony app, run the following command:

```bash
symfony server:start -d
symfony open:local
```

This starts the Symfony Server and opens the app in your local browser.

## 2. Create the tethered connection

1.  Create a new environment off of production:

    ```bash
    symfony branch new-feature main
    ```

2.  Open an SSH tunnel to the new environment's services:

    ```bash
    symfony tunnel:open
    ````
    This command returns the addresses for SSH tunnels to all of your services:

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

3.  To expose {{% vendor/name %}} services to your Symfony app, run the following
    command:

    ```bash
    symfony var:expose-from-tunnel
    ```

    This automatically configures your local Symfony app to use all your
    remote {{% vendor/name %}} services (remote database, remote Redis component, etc.).

    To check that you're now using remote data and components from {{% vendor/name %}},
    reload your local app within your browser.

4.  When you've finished your work,
    close the tunnels to your services by running the following command:

    ```bash
    symfony var:expose-from-tunnel --off
    symfony tunnel:close --all -y
    ```

{{< guide-buttons previous="Back" next="FAQ" >}}