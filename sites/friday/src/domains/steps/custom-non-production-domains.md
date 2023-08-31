---
title: Set up a custom domain on your non-production environments
sidebarTitle: Non-production environments
weight: 3
description: Learn how to set up custom domains on your staging and development environments
---

When a custom domain is [set up on your production environment](../steps/_index.md),
it can't be used for the other, non-production environments in your project.

Therefore, by default and for each non-production environment,
{{< vendor/name >}} automatically replaces the custom production domain
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
{{< vendor/name >}} automatically figures out the routing of your non-production environment
based on the following elements:

- The custom production domains in your existing [routes configuration](../../define-routes/_index.md)
- The custom non-production domains attached to each of those custom production domains

## Before you start

You need:

- A {{< vendor/name >}} project on which you have **admin rights** <BR> 
- A production environment with at least one custom domain already set up
- At least one non-production (staging or development) environment
- Optional: The [{{< vendor/name >}} CLI](../../administration/cli/_index.md) (v4.8.0+)

To prevent abuse, by default you can add custom domains to up to 5 environments per project only.
This limit doesn't include the production environment,
and you can increase it without charge.
To do so, [contact Support](../../overview/get-support.md).

{{< note >}}

If you delete a custom production domain,
all of the attached custom non-production domains are deleted too.
You need to rebuild the affected non-production environments for the deletion to be complete.

 {{< /note >}}

## Add a custom domain to a non-production environment

To add a custom domain to a non-production environment, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

1. To get the target for your non-production environment,
   run the following command:

   ```bash
   platform environment:info edge_hostname --environment {{< variable "ENVIRONMENT_NAME" >}}
   ```

2. [Configure your DNS provider](../steps/_index.md#3-configure-your-dns-provider).
   In particular, make sure your DNS record points to the target of your non-production environment.

   {{< note >}}

   Using the target of your production environment to configure your DNS provider is technically possible,
   but {{< vendor/name >}} recommends using the target of your non-production environment as a best practice.

   {{< /note >}}

3. Run a command similar to the following:

   ```bash
   platform domain:add staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}} --attach {{< variable "PRODUCTION_CUSTOM_DOMAIN_TO_ATTACH" >}}
   ```

<--->
+++
title=In the Console
+++

1.  Get the target for your non-production environment.</br>
    To do so, navigate to your non-production environment and click **{{< icon settings >}} Settings**.</br>
    Select the **Domains** tab.</br>
    In the **Configure your domain** section, copy the content of the **CNAME record** field.</br>
    Save it for later use at step 7.

2.  Click **Add domain**.

3.  Enter a name for your custom non-production domain.

4.  If you have multiple production domains,
    select the one you want to attach your custom non-production domain to.

5.  Click **Add**.

6.  Click **Okay**.

7.  [Configure your DNS provider](../steps/_index.md#3-configure-your-dns-provider).</br>
    In particular, make sure your DNS record points to the target of your non-production environment.

{{< note >}}

Using the target of your production environment to configure your DNS provider is technically possible,
but {{< vendor/name >}} recommends using the target of your non-production environment as a best practice.

{{< /note >}}

{{< /codetabs >}}

{{< note >}}

You can’t update a custom non-production domain.
You can only delete it and create a new one as a replacement.

{{< /note >}}

### Example

You've added the `mysite.com` custom domain to your production environment.
You now want to add the `mydev.com` custom domain to a development environment called `Dev`.

To do so, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
platform domain:add mydev.com --environment Dev --attach mysite.com
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

3.  Enter `mydev.com` as a name for your custom non-production domain.

4.  Select `mysite.com` as the production custom domain you want to attach `mydev.com` to.

5.  Click **Add**.</br>

6.  Click **Okay**.

7.  [Configure your DNS provider](../steps/_index.md#3-configure-your-dns-provider).</br>
    In particular, make sure your DNS record points to `Dev`'s target.

{{< /codetabs >}}

In the above example, the `Dev` environment needs to exist
for you to add the `mydev.com` custom domain successfully.
If the `Dev` environment is later removed,
the `mydev.com` custom domain is removed too.

## List the custom domains of a non-production environment

{{< codetabs >}}
+++
title=Using the CLI
+++

Run a command similar to the following:

```bash
platform domain:list --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

<--->
+++
title=In the Console
+++

1. Navigate to your non-production environment and click **{{< icon settings >}} Settings**.
2. Select the **Domains** tab.</br>
   All the custom domains for your non-production environment are displayed.

{{< /codetabs >}}

## Get a specific custom non-production domain

{{< codetabs >}}
+++
title=Using the CLI
+++

Run a command similar to the following:

```bash
platform domain:get staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

<--->
+++
title=In the Console
+++

1. Navigate to your non-production environment and click **{{< icon settings >}} Settings**.</br>
2. Select the **Domains** tab.</br>
   All the custom domains for the selected environment are displayed.
3. Click **{{< icon "more" >}} More** on a specific custom non-production domain to see which actions you can perform on it.

{{< /codetabs >}}

## Remove a custom domain from a non-production environment

{{< codetabs >}}
+++
title=Using the CLI
+++

Run a command similar to the following:

```bash
platform domain:delete staging.example.com --environment {{< variable "STAGING_ENVIRONMENT_ID" >}}
```

<--->
+++
title=In the Console
+++

1. Navigate to your non-production environment and click **{{< icon settings >}} Settings**.
2. Select the **Domains** tab.</br>
   All the custom domains for the selected environment are displayed.
3. Click **{{< icon "more" >}} More** on the custom non-production domain you want to delete.
4. Click **Delete**.
5. Click **Yes, delete**.

{{< /codetabs >}}