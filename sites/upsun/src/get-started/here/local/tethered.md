---
title: Tethered
weight: -80
description: |
  Sync your local {{% vendor/name %}} with your remote environment to start contributing.
---

When you develop a project, a significant amount of work takes place
locally rather than on an active {{% vendor/name %}} environment. You want to ensure
that the process of local development is as close as possible to a deployed
environment.

You can achieve this through various approaches. For example, you can use
Symfony Server with tethered data.

To do so, when testing changes locally, you can connect your locally running
Symfony Server to service containers on an active {{% vendor/name %}} environment.

This methodology has several advantages:

- It avoids installing anything on your local machine but your stack runtime.
- It ensures that you are using the same versions of all services on your local
  machine and in production.

{{< note theme="warning" title="Warning">}}

Never use this method on the **main** environment as changes made on your local
machine will impact production data.

{{< /note >}}


## 1. Start your local Server

Use the official path to start your local server locally.

## 2. Create the tethered connection

1.  Create a new environment off of production:

    ```bash
    {{% vendor/cli %}} branch new-feature main
    ```

1.  Open an SSH tunnel to the new environment's services:

    ```bash
    {{% vendor/cli %}} tunnel:open
    ````
    This command returns the addresses for SSH tunnels to all of your services that you can then use within your local source code:

    ```bash
    {{% vendor/cli %}} tunnel:open
        SSH tunnel opened to rediscache at: redis://127.0.0.1:30000
        SSH tunnel opened to database at: pgsql://main:main@127.0.0.1:30001/main

        Logs are written to: /Users/acmeUser/.{{% vendor/alt-name %}}/tunnels.log

        List tunnels with: {{% vendor/cli %}} tunnels
        View tunnel details with: {{% vendor/cli %}} tunnel:info
        Close tunnels with: {{% vendor/cli %}} tunnel:close

        Save encoded tunnel details to the PLATFORM_RELATIONSHIPS variable using:
        export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"
    ```

1. When you've finished your work,
    close the tunnels to your services by running the following command:

    ```bash
    {{% vendor/cli %}} tunnel:close --all -y
    ```
