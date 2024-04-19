---
title: Integrate with Bitbucket
sidebarTitle: Bitbucket
description: See how to manage your {{% vendor/name %}} environments directly from your Bitbucket repository.
keywords:
- "source integration"
- "source integrations"
---

{{% source-integration/intro source="Bitbucket" %}}

You can set up an integration with either Bitbucket Cloud
or a self-hosted [Bitbucket Server](https://confluence.atlassian.com/bitbucketserver/).

{{% source-integration/requirements source="Bitbucket" %}}

## Bitbucket Cloud

### 1. Create an OAuth consumer

To integrate your {{% vendor/name %}} project with an existing Bitbucket Cloud repository,
[create an OAuth consumer](https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/):

![A screenshot of how to setup the Bitbucket OAuth consumer](/images/integrations/bitbucket/bitbucket-oauth-consumer.svg "0.35")

{{< note theme="info" >}}
Be sure to define the above as a _private_ consumer by checking the **This is a private consumer** box.
{{< /note >}}
The **Callback URL** isn't important in this case.
You can set it to `http://localhost`.

Copy the **Key** and **Secret** for your consumer.

### 2. Enable the Cloud integration

To enable the integration, use either the [CLI](/administration/cli.html) or the [Console](/administration/web.html).

{{< codetabs >}}

+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} integration:add \
  --project {{% variable "PROJECT_ID" %}} \
  --type bitbucket \
  --repository {{% variable "OWNER/REPOSITORY" %}} \
  --key {{% variable "CONSUMER_KEY" %}} \
  --secret {{% variable "CONSUMER_SECRET" %}}
```

- `PROJECT_ID` is the ID of your {{% vendor/name %}} project.
- `OWNER/REPOSITORY` is the name of your repository in Bitbucket.
- `CONSUMER_KEY` is the key of the [OAuth consumer you created](#1-create-an-oauth-consumer).
- `CONSUMER_SECRET` is the secret of the [OAuth consumer you created](#1-create-an-oauth-consumer).

For example, if your repository is located at `https://bitbucket.org/platformsh/platformsh-docs`,
the command is similar to the following:

```bash
{{% vendor/cli %}} integration:add \
  --project abcdefgh1234567 \
  --type bitbucket \
  --repository platformsh/platformsh-docs \
  --key abc123 \
  --secret abcd1234 \
```

<--->

+++
title=In the Console
+++

1. Select the project where you want to enable the integration.
1. Click **{{< icon settings >}} Settings**.
1. Under **Project settings**, click **Integrations**.
1. Click **+ Add integration**.
1. Under **Bitbucket**, click **+ Add**.
1. Complete the form with:
   - The repository in the form `owner/repository`
   - The [key and secret you generated](#1-create-an-oauth-consumer)
1. Check that the other options match what you want.
1. Click **Add integration**.

{{< /codetabs >}}

In both the CLI and Console, you can choose from the following options:

| CLI flag         | Default | Description                                                               |
| ---------------- | ------- | ------------------------------------------------------------------------- |
| `fetch-branches` | `true`  | Whether to mirror and update branches on {{% vendor/name %}} and create inactive environments from them. When enabled, merging on a {{% vendor/name %}} isn't possible. That is, merging environments must be done on the source repository rather than on the {{% vendor/name %}} project. See note below for details related to this flag and synchronizing code from a parent environment. |
| `prune-branches` | `true`  | Whether to delete branches from {{% vendor/name %}} that don’t exist in the Bitbucket repository. When enabled, branching (creating environments) must be done on the source repository rather than on the {{% vendor/name %}} project. Branches created on {{% vendor/name %}} that are not on the source repository will not persist and will be quickly pruned. Automatically disabled when fetching branches is disabled. |
| `build-pull-requests` | `true` | Whether to track all pull requests and create active environments from them, which builds the pull request. |
| `resync-pull-requests` | `false` | Whether to sync data from the parent environment on every push to a pull request. |

To [keep your repository clean](/learn/bestpractices/clean-repository) and avoid performance issues, make sure you enable both the `fetch-branches` and `prune-branches` options.

{{% source-integration/validate source="Bitbucket" %}}
1. Follow the [Bitbucket instructions to create a webhook](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/#Create-webhooks)
   using the URL you copied.
   Make sure to update the triggers to include all pull request events except comments and approval.
{{% /source-integration/validate %}}

## Bitbucket Server

### 1. Generate a token

To integrate your {{% vendor/name %}} project with a repository on a Bitbucket Server instance,
you first need to create an access token associated with your account.

[Generate a token](https://confluence.atlassian.com/display/BitbucketServer/HTTP+access+tokens).
and give it at least read access to projects and admin access to repositories.
Copy the token.

### 2. Enable the Server integration

{{< source-integration/enable-integration source="Bitbucket server" >}}

{{% source-integration/validate source="Bitbucket" %}}
1. Follow the [Bitbucket instructions to create a webhook](https://confluence.atlassian.com/bitbucketserver076/managing-webhooks-in-bitbucket-server-1026535073.html#ManagingwebhooksinBitbucketServer-creatingwebhooksCreatingwebhooks)
   using the URL you copied.
   Send all events except comments and approval.
{{% /source-integration/validate %}}

{{% source-integration/environment-status source="Bitbucket" %}}

## Source of truth

{{< source-integration/source-of-truth source="Bitbucket" >}}

### Sync, fetch, and prune

{{% source-integration/sync-fetch-prune service="Bitbucket" %}}

{{% source-integration/url source="Bitbucket" %}}
