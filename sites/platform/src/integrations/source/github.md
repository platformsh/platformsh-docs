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
| `fetch-branches` | `true`  | Whether to track all branches and create inactive environments from them. When enabled, merging environments must be done on the source repository rather than on the Platform.sh project. When enabled, merging on a Platform.sh isn't possible. See note below for details related to this flag and synchronizing code from a parent environment. |
| `prune-branches` | `true`  | Whether to delete branches from {{% vendor/name %}} that don’t exist in the GitHub repository. When enabled, branching (creating environments) must be done on the source repository rather than on the Platform.sh project. Branches created on Platform.sh that are not on the source repository will not persist and will be quickly pruned. Automatically disabled when fetching branches is disabled. |
| `build-pull-requests` | `true` | Whether to track all pull requests and create active environments from them, which builds the pull request. |
| `build-draft-pull-requests` | `true` | Whether to also track and build draft pull requests. Automatically disabled when pull requests aren’t built. |
| `pull-requests-clone-parent-data` | `true` | 	Whether to clone data from the parent environment when creating a pull request environment. |
| `build-pull-requests-post-merge`| `false` | Whether to build what would be the result of merging each pull request. Turning it on forces rebuilds any time something is merged to the target branch. |

To [keep your repository clean](/learn/bestpractices/clean-repository) and avoid performance issues, make sure you enable both the `fetch-branches` and `prune-branches` options.

{{< note theme="info" title="Sync, fetch, and prune">}}
An integration from GitHub to Platform.sh establishes that

1. GitHub is the source of truth, where Git operations occur, and
2. Platform.sh is a mirror of that repository - provisioning infrastructure according to configuration, and orchestrating environments according to the branch structure of the GitHub repository.

Actions that take place on Platform.sh should not, by default, affect commits on GitHub.
Because of this you will notice that the GitHub integration enables both `fetch-branches` (track branches on GitHub) and `prune-branches` (delete branches that don't exist on GitHub) by default. 

You can change these settings if you would need to, but we recommend keeping them as is in most cases.

When enabled by default, you are limited by design as to what actions can be performed within the context of a Platform.sh project with a GitHub integration:

| Action         | Observation         | Intended behavior |
| :---------------- | :---------------- | :------- |
| Branch from parent | Running [`environment:branch`](/administration/cli/reference#environmentbranch) with the CLI, or selecting **Branch** in Console produces a new child environment, but it's deleted shortly after automatically. | Contribute to the GitHub repository itself by creating a branch and pull request. When the PR has been opened, a new environment will be provisioned for it.  |
| Merge in parent | Running [`environment:merge`](/administration/cli/reference#environmentmerge) with the CLI fails locally, and the **Merge** option in Console is not clickable. | Review and merge pull requests and/or branches on the GitHub repository. |
| Merge into child (sync code) | Running [`environment:synchronize`](/administration/cli/reference#environmentsynchronize) with the CLI fails locally, and the **Sync** option in Console won't allow me to include `code` in that sync. | Perform the merge locally from a matching branch on GitHub. For example, clone the most recent parent (`git pull origin parent-branch`), switch to the pull request branch (`git checkout ga-staging`), and then merge the parent into the current branch (`git merge main`). |
{{< /note >}}

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
