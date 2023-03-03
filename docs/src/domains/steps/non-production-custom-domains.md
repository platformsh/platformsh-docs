---
title: Set up a custom domain on your non-production environments
sidebarTitle: Non-production custom domains
weight: 2
description: Learn how to set up custom domains on your staging and development environments
betaFlag: true
---

{{< premium-features/tiered "Elite and Enterprise" >}}

Your Platform.sh environments are organized [in a hierarchy featuring parent and child environments](../../environments/_index.md#hierarchy).
Once you've added a custom domain to your production environment,
you might want to do the same for its [child development and/or staging environments](../../administration/users.md#environment-types).

To add a custom domain to a non-production environment,
check that its parent production environment has its own custom domain set up first.

To create a new custom domain for a non-production environment,
Platform.sh retrieves the parent environment's custom domain from your [routes configuration](../../define-routes/_index.md).
It then replaces it with the new custom domain to use for the non-production environment.
This operation happens under the hood and doesn't affect your production environment's custom domain.

{{< note title="Example" >}}

You have a production environment (**Main**) and a child staging environment (**Staging**).

![Hierarchy tree showing the **Main** production environment as parent and the **Staging** environment as child.](/images/custom-domains/custom-domains-non-prod.png "0.4")

As you've added the `example.com` custom domain to your production environment,
your [routes configuration](../../define-routes/_index.md) is the following:

```yaml
https://{default}/:
  type: upstream
  upstream: "example:http"
```

To add a custom domain to your staging environment,
Platform.sh retrieves the `example.com` custom domain from your routes configuration
and replaces it with `staging.example.com`.

You can then access your staging environment through `staging.example.com`
and still access your production environment through `example.com`.

{{< /note >}}

Each non-production environment's custom domain is therefore attached to a production environment's custom domain.
If you delete a production environment's custom domain,
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