---
title: Integrate with GitHub
sidebarTitle: GitHub
description: See how to manage your {{% vendor/name %}} environments directly from your GitHub repository.
keywords:
- "source integration"
- "source integrations"
---

{{% source-integration/intro source="GitHub" %}}
{{% source-integration/requirements source="GitHub" %}}

## 1. Generate a token

To integrate your {{% vendor/name %}} project with an existing GitHub repository,
you need to [generate a new token](https://github.com/settings/tokens/new).
You can generate a classic personal access token,
or a [fine-grained personal access token](https://github.blog/changelog/2022-10-18-introducing-fine-grained-personal-access-tokens/)
for even greater control over the permissions you grant.

For the integration to work,
your GitHub user needs to have permission to push code to the repository.

When you set up or update an integration, it also needs permission to manage its webhooks.
This means your user needs to be a repository admin to create the integration.
You can remove this permission after setup.

Make sure you give your token a description.

If you're generating a classic personal access token,
ensure the token has the appropriate scopes based on what you want to do:

| Scope                 | Purpose                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| `admin:repo_hook`     | To create webhooks for events in repositories. Always needed.          |
| `public_repo`         | To integrate with public repositories.                                 |
| `repo`                | To integrate with your private repositories.                           |
| `repo` and `read:org` | To integrate with private repositories in organizations you belong to. |

If you're generating a fine-grained personal access token,
ensure the token has the right [repository permissions](https://docs.github.com/en/rest/overview/permissions-required-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28)
for the integration to work:

| Permission        | Access level    |
| ------------------| ----------------|
| `Commit statuses` | Read and write  |
| `Contents`        | Read and write  |
| `Metadata`        | Read-only       |
| `Pull request`    | Read and write  |
| `Webhooks`        | Read and write  |

After you've set the needed scopes or permissions,
generate and copy your token.

## 2. Enable the integration

To enable the integration, use either the [CLI](/administration/cli.html) or the [Console](/administration/web.html).

{{< codetabs >}}

+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} integration:add \
  --project {{% variable "PROJECT_ID" %}} \
  --type github \
  --repository {{% variable "OWNER/REPOSITORY" %}} \
  --token {{% variable "GITHUB_ACCESS_TOKEN" %}} \
  --base-url {{% variable "GITHUB_URL" %}}
```

- `PROJECT_ID` is the ID of your {{% vendor/name %}} project.
- `OWNER/REPOSITORY` is the name of your repository in GitHub.
- `GITHUB_ACCESS_TOKEN` is the [token you generated](#1-generate-a-token).
- `GITHUB_URL` is the base URL for your GitHub server if you self-host.
   If you use the public `https://github.com`, omit the `--base-url` flag when running the command.

For example, if your repository is located at `https://github.com/platformsh/platformsh-docs`,
the command is similar to the following:

```bash
{{% vendor/cli %}} integration:add \
  --project abcdefgh1234567 \
  --type github \
  --repository platformsh/platformsh-docs \
  --token abc123
```

<--->

+++
title=In the Console
+++

1. Select the project where you want to enable the integration.
1. Click **{{< icon settings >}} Settings**.
1. Under **Project settings**, click **Integrations**.
1. Click **+ Add integration**.
1. Under **GitHub**, click **+ Add**.
1. Add the [token you generated](#1-generate-a-token).
1. Optional: If your GitHub project isn’t hosted at `github.com`, enter your GitHub custom domain.
1. Click **Continue**.
1. Choose the repository to use for the project.
1. Check that the other options match what you want.
1. Click **Add integration**.

{{< /codetabs >}}

In both the CLI and Console, you can choose from the following options:

| CLI flag         | Default | Description                                                               |
| ---------------- | ------- | ------------------------------------------------------------------------- |
| `fetch-branches` | `true`  | Whether to mirror and update branches on {{% vendor/name %}} and create inactive environments from them. When enabled, merging on a {{% vendor/name %}} isn't possible. That is, merging environments must be done on the source repository rather than on the {{% vendor/name %}} project. See note below for details related to this flag and synchronizing code from a parent environment. |
| `prune-branches` | `true`  | Whether to delete branches from {{% vendor/name %}} that don’t exist in the GitHub repository. When enabled, branching (creating environments) must be done on the source repository rather than on the {{% vendor/name %}} project. Branches created on {{% vendor/name %}} that are not on the source repository will not persist and will be quickly pruned. Automatically disabled when fetching branches is disabled. |
| `build-pull-requests` | `true` | Whether to track all pull requests and create active environments from them, which builds the pull request. |
| `build-draft-pull-requests` | `true` | Whether to also track and build draft pull requests. Automatically disabled when pull requests aren’t built. |
| `pull-requests-clone-parent-data` | `true` | 	Whether to clone data from the parent environment when creating a pull request environment. |
| `build-pull-requests-post-merge`| `false` | Whether to build what would be the result of merging each pull request. Turning it on forces rebuilds any time something is merged to the target branch. |
| `resources-init` | `false` | To [specify a resource initialization strategy](/manage-resources/resource-init.md#first-deployment) for new containers. Once set, the strategy applies to **all** the deployments you launch through your source integration. See more information on [available resource initialization strategies](/manage-resources/resource-init.md#specify-a-resource-initialization-strategy). |

To [keep your repository clean](/learn/bestpractices/clean-repository) and avoid performance issues, make sure you enable both the `fetch-branches` and `prune-branches` options.

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

### Sync, fetch, and prune

{{% source-integration/sync-fetch-prune service="GitHub" %}}

{{% source-integration/url source="GitHub" %}}
