---
title: Integrate with GitHub
sidebarTitle: GitHub
description: See how to manage your Platform.sh environments directly from your GitHub repository.
---

{{% source-integration/intro source="GitHub" %}}
{{% source-integration/requirements source="GitHub" %}}

## 1. Generate a token

To integrate your Platform.sh project with an existing GitHub repository,
[generate a new token](https://github.com/settings/tokens/new).
Fine-grained access tokens aren't currently supported.
For the integration to work,
your GitHub user needs to have permission to push code to the repository.

When you set up or update an integration, it also needs permission to manage its webhooks.
This means your user needs to be a repository admin to create the integration.
You can remove this permission after setup.

Give your token a description and then ensure the token has the scopes that correspond to what you want to do:

| Scope                 | Purpose                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| `admin:repo_hook`     | To create webhooks for events in repositories. Always needed.          |
| `public_repo`         | To integrate with public repositories.                                 |
| `repo`                | To integrate with your private repositories.                           |
| `repo` and `read:org` | To integrate with private repositories in organizations you belong to. |

Copy the token.

## 2. Enable the integration

{{< source-integration/enable-integration source="GitHub" >}}

{{% source-integration/validate source="GitHub" %}}
1. In your GitHub repository, click **Settings** > **Webhooks** > **Add webhook**.
1. In the **Payload URL** field, paste the URL you copied.
1. For the content type, select **application/json**.
1. Select **Send me everything**.
1. Click **Add webhook**.
{{% /source-integration/validate %}}

{{% source-integration/environment-status source="GitHub" %}}

## Source of truth

{{< source-integration/source-of-truth source="GitHub" >}}

{{% source-integration/url source="GitHub" %}}
