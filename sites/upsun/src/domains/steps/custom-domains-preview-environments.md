---
title: Set up a custom domain on a preview environment
sidebarTitle: Preview environments
weight: 3
description: Learn how to set up custom domains on your preview environments
---

[Preview environments](/glossary.md#preview-environment) in your project can't use the custom domain [set up on your production environment](../steps/_index.md).<br/>
By default and for each preview environment,
{{< vendor/name >}} automatically replaces the custom production domain
with an automatically generated URL.

If you don't want to use these default URLs,
you can add a custom domain to each of your preview environments
(`staging` or `development` [environment types](/glossary.md#environment-type)).

To do so, no need to modify your [routes configuration](../../define-routes/_index.md).
When you add a new custom domain for a preview environment,
just attach it to the custom production domain it replaces.
If you have multiple custom production domains,
you need to select which one you're replacing.

{{< note title="Example" >}}

You have two environments, a production environment and a staging environment.
You've added the `example.com` custom domain to your production environment.

You want to add the `staging.example.com` custom domain to your staging environment.
To do so, you need to attach the new `staging.example.com` custom domain
to its corresponding custom production domain `example.com`. 

You can then access your staging environment through `staging.example.com`,
and still access your production environment through `example.com`.

{{< /note >}}

If you have multiple custom domains on your production environment,
when you set up a custom domain on a preview environment,
you don't need to update your [routes configuration](../../define-routes/_index.md) either.
{{< vendor/name >}} automatically figures out the routing of your preview environment
based on the following elements:

- The custom production domains in your existing [routes configuration](../../define-routes/_index.md)
- The custom domains for preview environments attached to each of those custom production domains

## Before you start

You need:

- A production environment with at least one custom domain already set up
- At least one preview (staging or development) environment
- Optional: The [{{< vendor/name >}} CLI](../../administration/cli/_index.md) (v4.8.0+)

To prevent abuse, by default you can add custom domains to up to 5 preview environments per project only.
This limit doesn't include the production environment,
and you can increase it without charge.
To do so, [contact Support](/learn/overview/get-support.md).

{{< note >}}
If you delete a custom production domain,
all of the attached custom domains for preview environments are deleted too.
You need to rebuild the affected preview environments for the deletion to be complete.
{{< /note >}}

## Add a custom domain to a preview environment

To add a custom domain to a preview environment, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

1. To get the target for your preview environment,
   run the following command:

   ```bash
   {{% vendor/cli %}} environment:info edge_hostname --environment {{< variable "ENVIRONMENT_NAME" >}}
   ```

2. [Configure your DNS provider](../steps/_index.md#2-configure-your-dns-provider).
   In particular, make sure your DNS record points to the target of your preview environment.

   {{< note >}}

   Using the target of your production environment to configure your DNS provider is technically possible,
   but {{< vendor/name >}} recommends using the target of your preview environment as a best practice.

   {{< /note >}}

3. Run a command similar to the following:

   ```bash
   {{% vendor/cli %}} domain:add staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}} --attach {{< variable "PRODUCTION_CUSTOM_DOMAIN_TO_ATTACH" >}}
   ```

<--->
+++
title=In the Console
+++

1.  Get the target for your preview environment.</br>
    To do so, navigate to your preview environment and click **{{< icon settings >}} Settings**.</br>
    Select the **Domains** tab.</br>
    In the **Configure your domain** section, copy the content of the **CNAME record** field.</br>
    Save it for later use at step 7.

2.  Click **Add domain**.

3.  Name the custom domain for your preview environment.

4.  Attach the custom domain for your preview environment to the desired production custom domain.

5.  Click **Add**.

6.  Click **Okay**.

7.  [Configure your DNS provider](../steps/_index.md#2-configure-your-dns-provider).</br>
    In particular, make sure your DNS record points to the target of your preview environment.

{{< note >}}

Using the target of your production environment to configure your DNS provider is technically possible,
but {{< vendor/name >}} recommends using the target of your preview environment as a best practice.

{{< /note >}}

{{< /codetabs >}}

{{< note >}}

You can’t update a custom domain when it's used on a preview environment.
You can only delete it and create a new one as a replacement.

{{< /note >}}

### Example

You've added the `mysite.com` custom domain to your production environment.
You now want to add the `mydev.com` custom domain to a preview environment called `Dev`.

To do so, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} domain:add mydev.com --environment Dev --attach mysite.com
```

<--->
+++
title=In the Console
+++

1.  Get the target for `Dev`.</br>
    To do so, navigate to `Dev` and click **{{< icon settings >}} Settings**.</br>
    Select the **Domains** tab.</br>
    In the **Configure your domain** section, copy the content of the **CNAME record** field.</br>
    Save it for later use at step 7.

2.  Click **Add domain**.

3.  Enter `mydev.com` as a name for the custom domain you want to add to `Dev`.

4.  Select `mysite.com` as the production custom domain you want to attach `mydev.com` to.

5.  Click **Add**.</br>

6.  Click **Okay**.

7.  [Configure your DNS provider](../steps/_index.md#2-configure-your-dns-provider).</br>
    In particular, make sure your DNS record points to `Dev`'s target.

{{< /codetabs >}}

In the above example, the `Dev` environment needs to exist
for you to add the `mydev.com` custom domain successfully.
If the `Dev` environment is later removed,
the `mydev.com` custom domain is removed too.

## List the custom domains of a preview environment

{{< codetabs >}}
+++
title=Using the CLI
+++

Run a command similar to the following:

```bash
{{% vendor/cli %}} domain:list --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

<--->
+++
title=In the Console
+++

1. Navigate to your preview environment and click **{{< icon settings >}} Settings**.
2. Select the **Domains** tab.</br>
   All the custom domains for your preview environment are displayed.

{{< /codetabs >}}

## Get a specific custom domain used on a preview environment

{{< codetabs >}}
+++
title=Using the CLI
+++

Run a command similar to the following:

```bash
{{% vendor/cli %}} domain:get staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

<--->
+++
title=In the Console
+++

1. Navigate to your preview environment and click **{{< icon settings >}} Settings**.</br>
2. Select the **Domains** tab.</br>
   All the custom domains for the selected environment are displayed.
3. To see which actions you can perform on a displayed custom domain,
   click **{{< icon "more" >}} More** next to it.

{{< /codetabs >}}

## Remove a custom domain from a preview environment

{{< codetabs >}}
+++
title=Using the CLI
+++

Run a command similar to the following:

```bash
{{% vendor/cli %}} domain:delete staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

<--->
+++
title=In the Console
+++

1. Navigate to your preview environment and click **{{< icon settings >}} Settings**.
2. Select the **Domains** tab.</br>
   All the custom domains for the selected environment are displayed.
3. Click **{{< icon "more" >}} More** on the custom domain you want to delete.
4. Click **Delete**.
5. Click **Yes, delete**.

{{< /codetabs >}}