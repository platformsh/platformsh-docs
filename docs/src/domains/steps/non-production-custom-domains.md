---
title: Set up a custom domain on your non-production environments
sidebarTitle: (Beta) Non-production custom domains
weight: 2
description: Learn how to set up custom domains on your staging and development environments
betaFlag: true
---

{{< premium-features/tiered "Elite and Enterprise" >}}

You can add a custom domain to a staging or development environment without modifying your [routes configuration](../../define-routes/_index.md).
To do so, you need to attach the new non-production custom domain
to an existing production custom domain.

{{< note title="Example" >}}

You have two environments, a production environment and a staging environment.
You've added the `example.com` custom domain to your production environment.

You want to add the `staging.example.com` custom domain to your staging environment.
To do so, you need to attach the new `staging.example.com` custom domain
to its corresponding production custom domain `example.com`. 

You can then access your staging environment through `staging.example.com`
and still access your production environment through `example.com`.

{{< /note >}}

If you have multiple custom domains on your production environment,
when you create a non-production custom domain,
you still don't need to update your [routes configuration](../../define-routes/_index.md).
Platform.sh automatically figures out the routing of your non-production environment
based on the following elements:

- The production custom domains in your existing [routes configuration](../../define-routes/_index.md)
- The non-production custom domains attached to each of those production custom domains

## Get started with non-production custom domains

You need:

- A production environment with at least one custom domain already set up
- At least one non-production (staging or development) environment
- The [Platform.sh CLI](../../administration/cli/_index.md)

In the current Beta version,
you can only add and manage non-production custom domains through the [Platform.sh CLI](../../administration/cli/_index.md).
In later versions,
you'll be able to do so in the [Platform.sh Console](../../administration/web/_index.md) too.

You can only add non-production custom domains yourself on Grid environments.
If you have {{% names/dedicated-gen-2 %}} environments
and want to add non-production custom domains to your project,
contact [Support](https://console.platform.sh/-/users/~/tickets/open).

To add non-production custom domains yourself, you must be a **project admin**.
You can add custom domains to up to 5 environments per project (production environment included).

If you delete a production custom domain,
all of the attached non-production custom domains are deleted too.

If you downgrade from an Elite or Enterprise plan to a Professional plan,
all of the custom domains set on non-production environments are automatically removed.
Downgrading your plan doesn't affect custom domains set on your production environments.

## Add a custom domain to a non-production environment

To add a custom domain to a non-production environment,
run a command similar to the following:

```bash
platform domain:add staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}} --replace {{< variable "PRODUCTION_CUSTOM_DOMAIN_TO_REPLACE" >}}
```

{{< note title="Example" >}}

You've added the `mysite.com` custom domain to your production environment.
You now want to add the `development.mysite.com` custom domain to a development environment called `Dev`.

To do so, run the following command:

```bash
platform domain:add development.mysite.com --environment Dev --replace mysite.com
```

{{< /note >}}

You can't update a non-production custom domain.
You can only delete it and create a new one as a replacement.

## List the custom domains of a non-production environment

To list all the custom domains added to a non-production environment,
run a command similar to the following:

```bash
platform domain:list --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

## Get a specific non-production custom domain

To retrieve a specific custom domain added to a non-production environment,
run a command similar to the following:

```bash
platform domain:get staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

## Remove a custom domain from a non-production environment

To remove a custom domain from a non-production environment,
run a command similar to the following:

```bash
platform domain:delete staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```