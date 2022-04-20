---
title: "Project configuration"
weight: 1
description: |
  You can access the project-wide configuration settings by selecting the project from your list of projects, then click the `Settings` tab at the top of the screen.
---

{{< description >}}

## General

From the first page of the project settings, `General`, you can update the project name, set the project timezone, and navigate to other project settings options on the left side of the screen.

![configure project](/images/management-console/settings-basics.png "0.7")

The project timezone affects [automated backups](../../dedicated/overview/backups.md).

The project timezone doesn't affect:

- [App runtime](../../create-apps/timezone.md).
- [Cron jobs](../../create-apps/app-reference.md#crons).
- [System logs](../../development/logs.md). UTC is the default timezone for all logs.

## Access

The `Access` screen allows you to manage users' access on your project.

You can invite new users to your project by clicking the `Add` button and entering their email address, or modify permissions of existing users by clicking the `Edit` link when hovering over the user.

![Project configure icon](/images/management-console/settings-project-access.png "0.7")

{{< note >}}
Permissions changes that grant or revoke SSH access to an environment take effect only after the next time that environment is deployed.
{{< /note >}}

Selecting a user will allow you to either edit that user's permissions or delete the user's access to the project entirely.

![Manage users of your Platform.sh project](/images/management-console/edit-user.png "0.7")

If you check the `Project admin` box, this user will be an administrator of the project and will have full access on all environments. If you deselect the box, you'll have the option of adjusting the user's permissions on each environment type.

{{< note >}}
The `Account owner` is locked and you can't change its permissions.
{{< /note >}}

## Domains

{{< note theme="warning">}}
 Do not add a custom domain to your project until you are fully ready to change your DNS. Until that time, continue working with the Platform.sh generated URLs.
{{< /note >}}

The `Domains` screen allows you to manage your domains that your project will be accessible at.

![project domain](/images/management-console/settings-domains.png "0.7")

More information on how to [setup your domain](/domains/steps/_index.md).

{{< note >}}
Platform.sh expects an ASCII representation of the domain here. In case you want to use an internationalized domain name you can use the [conversion tool provided by Verisign](https://www.verisign.com/en_US/channel-resources/domain-registry-products/idn/idn-conversion-tool/index.xhtml) to convert your IDN domain to ASCII.
{{< /note >}}

## Certificates

The `Certificates` screen allows you to manage your project's TLS certificates that enable HTTPS.

![project certs](/images/management-console/settings-certificates.png "0.7")

You can view current certificates by hovering over one on the list and clicking the `View` link that appears, or you can add a new certificate by clicking the `Add` button a the top of the page.

![add certs](/images/management-console/add-cert.png "0.7")

All projects get TLS certificates provided by [Let's Encrypt](../../define-routes/https.md#lets-encrypt) automatically. In most cases no user action is required. You will only need to add certificates on this page if you are using TLS certificates provided by a third party.

A more in-depth guide regarding [how to set up custom certificates can be found here](https://docs.platform.sh/domains/steps/tls.html).

## Deploy Key

The `Deploy Key` page provides the SSH key that Platform.sh will use when trying to access the external private Git repository during the build process.

This is useful if you want to reuse some code components across multiple projects and manage those components as dependencies of your project.

![project deploy key](/images/management-console/settings-deploy-key.png "0.7")

## Variables

The `Variables` screen allows you to define the variables that will be available project-wide - that is, in each environment. It also allows you define variables that will be available during the build process.

![project vars](/images/management-console/settings-variables-project.png "0.7")
