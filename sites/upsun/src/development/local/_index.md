---
title: "Set up your local development environment"
weight: 4
description: Set up a local development environment to test out changes to your app's code.
sidebarTitle: "Local development"
layout: single
---

To make changes to your app's code and test them without affecting your production environment,
set up a local development environment on your computer.

For the most effective testing, you want your local environment to match your {{% vendor/name %}} environments.
The best way to do this is to use a cross-platform tool based on Docker.
This ensures the changes you make locally appear as they would on your {{% vendor/name %}} environments.
It also means you don't have to worry about configuring your machine with
the various dependencies, certificates, and connections your app needs to run.

The **recommended tool** for local development with {{% vendor/name %}} is **[DDEV](./ddev.md)**.
The integration with DDEV is maintained by {{% vendor/name %}} to ensure it works smoothly.

If you choose to use DDEV, follow the steps [on its page](./ddev.md). Otherwise, follow these steps to run your app on your computer.

## Before you begin

You need to have:

- A {{< vendor/name >}} account:
  new users can [register here](https://upsun.com/register/)
- A working project
- [Git](https://git-scm.com/downloads)
- The [{{% vendor/name %}} CLI](../../administration/cli/_index.md)

## 1. Get your code

If you don't have your app code on your computer, download a copy.

1.  Get your project ID by running `{{% vendor/cli %}} projects`.

2.  Get the code by running the following command:

    ```bash
    {{% vendor/cli %}} get {{< variable "PROJECT_ID" >}} {{< variable "TARGET_DIRECTORY_NAME" >}}
    ```

    Or pull from your [integrated Git repository](../../integrations/source/_index.md).

You can now access your code from the project directory on your computer.
The CLI created a `{{< vendor/configfile "apps" >}}/local` directory that's excluded from Git.
It contains builds and local metadata about your project.

You can now make changes to your project without pushing to {{% vendor/name %}} each time to test them.
Instead, you can locally build your application using the {{% vendor/name %}} CLI.

Note that if your app contains services, you need to open an SSH tunnel to connect to them.
For more information, see how to [connect services](../../add-services#2-define-the-relationship).

## 2. Connect to services

If your app requires services to run, you have two options for developing locally:

- [Tethered local development](./tethered.md) involves running your app on a local web server
  but keeping all other services on {{% vendor/name %}} and connecting to them over an SSH tunnel.
- [Untethered local development](./untethered.md) involves running your entire site locally,
  including all services.

Choose the option that works for you and get your services running.
