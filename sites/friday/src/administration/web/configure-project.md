---
title: Configure a project
weight: 1
description: Configure settings that apply across a project, such as the name, access, and domain.
---

Each project has settings that apply to everything within that project, including all its environments.
You can only see and update settings for projects where you are a [Project Admin](../users.md).
To access the settings, click {{< icon settings >}} **Settings** from the main project page.

The settings are divided into several sections.

## General

The **General** section shows you the project's region and allows you to update the project name and [timezone](../../projects/change-project-timezone.md).

![configure project](/images/console/settings-general.png "1.0")

## Access

The **Access** section allows you to [manage user access to the project](../users.md).

<!-- @todo: for the release of teams -->
<!-- The **Access** section allows you to [manage user access](../users.md),
and [teams access](../teams.md) to a project. -->

![Project configure icon](/images/console/settings-access-users.png "0.7")

## Certificates

The **Certificates** section shows a list of your project's TLS certificates.
To see details about a certificate or delete one, click **Edit {{< icon chevron >}}**.
See how to [add custom certificates](../../domains/steps/tls.md).

![A list of certificates in a project](/images/management-console/settings-certificates.png "0.7")

## Domains

The **Domains** section allows you to manage the domains where your project is accessible.
See how to [set up your domain](../../domains/steps/_index.md).

![project domain](/images/management-console/settings-domains.png "0.7")

## Deploy Key

The **Deploy Key** section shows you the public SSH key you can add to your private repositories.
Adding it lets {{% vendor/name %}} access the repositories during the build process.
This is useful if you want to reuse some code components across multiple projects and manage those components as dependencies of your project.

![Project deploy key](/images/management-console/settings-deploy-key.png "0.7")

## Integrations

The **Integrations** section allows you to manage all of your [integrations](../../integrations/_index.md).

![Integrations](/images/management-console/settings-integrations.png "0.7")

## Variables

The **Variables** section allows you to manage all project-wide [variables](../../development/variables/_index.md).

![Project variables](/images/management-console/settings-variables-project.png "0.7")
