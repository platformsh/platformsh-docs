---
title: Set up a custom domain on your non-production environments
sidebarTitle: (Beta) Non-production environments
weight: 3
description: Learn how to set up custom domains on your staging and development environments
banner: 
    type: beta
---

When a custom domain is [set up on your production environment](../steps/_index.md),
it can't be used for the other, non-production environments in your project.
Therefore, by default and for each non-production environment,
Platform.sh automatically replaces the custom production domain 
with an automatically generated URL.

If you don't want to use these default URLs,
you can add a custom domain to each of your non-production environments
(`staging` or `development` environment types).

To do so, you don't need to modify your [routes configuration](../../define-routes/_index.md).
You just need to attach each new custom non-production domain to the custom production domain it replaces.
If you have multiple custom production domains,
you need to select which one you are replacing when you add a custom non-production domain.

{{< note title="Example" >}}

You have two environments, a production environment and a staging environment.
You've added the `example.com` custom domain to your production environment.

You want to add the `staging.example.com` custom domain to your staging environment.
To do so, you need to attach the new `staging.example.com` custom domain
to its corresponding custom production domain `example.com`. 

You can then access your staging environment through `staging.example.com`
and still access your production environment through `example.com`.

{{< /note >}}

If you have multiple custom domains on your production environment,
when you create a custom non-production domain,
you don't need to update your [routes configuration](../../define-routes/_index.md) either.
Platform.sh automatically figures out the routing of your non-production environment
based on the following elements:

- The custom production domains in your existing [routes configuration](../../define-routes/_index.md)
- The custom non-production domains attached to each of those custom production domains

## Before you start

You need:

- A Grid or {{% names/dedicated-gen-3 %}} project on which you have **admin rights** <BR> 

  {{< note theme="warning" >}}

  If you have a {{% names/dedicated-gen-2 %}} project,
  currently you can only add a custom domain to the dedicated environments of your project (production and staging).
  To do so, contact [Support](https://console.platform.sh/-/users/~/tickets/open).

  {{< /note >}}

  If you use a [Managed Fastly](../cdn/managed-fastly.md) CDN,
  it needs to be configured to operate with custom non-production domains.
  For more information, contact [Support](https://console.platform.sh/-/users/~/tickets/open).   
- A production environment with at least one custom domain already set up
- At least one non-production (staging or development) environment
- The [Platform.sh CLI](../../administration/cli/_index.md) (v4.8.0+) <BR>
  In the current Beta version, you can only add and manage non-production custom domains
  through the [Platform.sh CLI](../../administration/cli/_index.md).
  In future versions, you'll be able to do so in the [Platform.sh Console](../../administration/web/_index.md) too.

To prevent abuse, by default you can add custom domains to up to 5 environments per project only.
This limit doesn't include the production environment,
and you can increase it without charge.
To do so, [contact Support](../../overview/get-support.md).

{{< note >}}

If you delete a custom production domain,
all of the attached custom non-production domains are deleted too.
You need to rebuild the affected non-production environments for the deletion to be complete.

 {{< /note >}}

If you downgrade from an Elite or Enterprise plan to a Professional plan,
all of the custom domains set on non-production environments are automatically removed.
Downgrading your plan doesn't affect custom domains set on your production environments.

## Add a custom domain to a non-production environment

To add a custom domain to a non-production environment, follow these steps:

1. Get the target for your non-production environment.

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
platform environment:info edge_hostname --environment {{< variable "ENVIRONMENT_NAME" >}}
```

<--->
+++
title=In the Console
+++

1. In the Console, open your non-production environment.
2. Click **URLs** and copy the URL to your site excluding `https://`.

   For example, if the automatically generated URL is `https://dev-abcd123.abcdefgh1234567.eu.platformsh.site`,
   the target is `dev-abcd123.abcdefgh1234567.eu.platformsh.site`.

{{< /codetabs >}}

2. [Configure your DNS provider](../steps/_index.md#3-configure-your-dns-provider).
   In particular, make sure your DNS record points to the target of your non-production environment.

   {{< note >}}

   Using the target of your production environment to configure your DNS provider is technically possible,
   but Platform.sh recommends using the target of your non-production environment as a best practice.

   {{< /note >}}

3. Run a command similar to the following:

   ```bash
   platform domain:add staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}} --attach {{< variable "PRODUCTION_CUSTOM_DOMAIN_TO_ATTACH" >}}
   ```

   {{< note title="Example" >}}

   You've added the `mysite.com` custom domain to your production environment.
   You now want to add the `mydev.com` custom domain to a development environment called `Dev`.

   To do so, run the following command:

   ```bash
   platform domain:add mydev.com --environment Dev --attach mysite.com
   ```

   {{< /note >}}

   In the above example, the `Dev` environment needs to exist
   for you to add the `mydev.com` custom domain successfully.
   If the `Dev` environment is later removed,
   the `mydev.com` custom domain is removed too.

   As shown in the example, you can use any domain for your non-production environments,
   and not necessarily a subdomain of the production.

{{< note >}}

You can’t update a custom non-production domain.
You can only delete it and create a new one as a replacement.

{{< /note >}}

## List the custom domains of a non-production environment

To list all the custom domains added to a non-production environment,
run a command similar to the following:

```bash
platform domain:list --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

## Get a specific custom non-production domain

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
