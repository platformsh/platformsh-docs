---
title: Set up a custom domain on your non-production environments
sidebarTitle: Non-production custom domains
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

You can only create the `staging.example.com` custom domain if you attach it to the `example.com` custom domain. 

You can then access your staging environment through `staging.example.com`
and still access your production environment through `example.com`.

{{< /note >}}

If you have multiple production environments,
when you create a non-production custom domain,
Platform.sh retrieves the `{default}` placeholder in your [routes configuration](../../define-routes/_index.md).
It then replaces it with the correct production custom domain
according to what you specify [in the setup command](#add-a-custom-domain-to-a-non-production-environment).

Note that you must be a project admin to add non-production custom domains.
You can add up to 5 non-production custom domains per project.

If you delete a production custom domain,
all of the attached non-production custom domains are deleted too.

If you downgrade from an Elite or Enterprise plan to a Professional plan,
all of the custom domains set on non-production environments are automatically removed.
Downgrading your plan doesn't affect custom domains set on your production environments.

## Add a custom domain to a non-production environment

The creation of non-production custom domains
from the [Platform.sh Console](../../administration/cli/_index.md) isn't available in the Beta version,
but will be soon. In the meantime, use the [Platform.sh CLI](/administration/cli/_index.md).

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