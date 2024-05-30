---
title: Integrate with GitLab
sidebarTitle: GitLab
description: See how to manage your {{% vendor/name %}} environments directly from your GitLab repository.
keywords:
- "source integration"
- "source integrations"
---

{{% source-integration/intro source="GitLab" %}}
{{% source-integration/requirements source="GitLab" %}}

## 1. Generate a token

To integrate your {{% vendor/name %}} project with an existing GitLab repository,
generate a [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html#create-a-project-access-token).
Ensure the token has the following scopes:

- `api` to access your API
- `read_repository` to read the repository

For the integration to work, your GitLab user needs push access to the repository and to configure a webhook on a GitLab repository, you need to have Maintainer or Owner user permissions.

Copy the token.

{{< note >}}

To create a project access token, you need to have a [sufficient GitLab license tier](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html).
If you don't see **Access Tokens** under **Settings**, upgrade your GitLab tier.
Alternatively, you can create a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html),
but that's attached to a specific user rather than the project as a whole
and grants more permissions.

{{< /note >}}

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
  --type gitlab \
  --server-project {{% variable "PROJECT/SUBPROJECT" %}} \
  --token {{% variable "GITLAB_ACCESS_TOKEN" %}} \
  --base-url {{% variable "GITLAB_URL" %}}
```

- `PROJECT_ID` is the ID of your {{% vendor/name %}} project.
- `PROJECT/SUBPROJECT` is the name of your repository in GitLab.
- `GITLAB_ACCESS_TOKEN` is the [token you generated](#1-generate-a-token).
- `GITLAB_URL` is the base URL for your GitLab server if you self-host.
   If you use the public `https://gitlab.com`, omit the `--base-url` flag when running the command.

For example, if your repository is located at `https://gitlab.com/platformsh/platformsh-docs`,
the command is similar to the following:

```bash
{{% vendor/cli %}} integration:add \
  --project abcdefgh1234567 \
  --type gitlab \
  --server-project platformsh/platformsh-docs \
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
1. Under **GitLab**, click **+ Add**.
1. Add the [token you generated](#1-generate-a-token).
1. Optional: If your GitLab project isn’t hosted at `gitlab.com`, enter your GitLab custom domain.
1. Click **Continue**.
1. Choose the repository to use for the project.
1. Check that the other options match what you want.
1. Click **Add integration**.

{{< /codetabs >}}

In both the CLI and Console, you can choose from the following options:

| CLI flag         | Default | Description                                                               |
| ---------------- | ------- | ------------------------------------------------------------------------- |
| `fetch-branches` | `true`  | Whether to mirror and update branches on {{% vendor/name %}} and create inactive environments from them. When enabled, merging on a {{% vendor/name %}} isn't possible. That is, merging environments must be done on the source repository rather than on the {{% vendor/name %}} project. See note below for details related to this flag and synchronizing code from a parent environment. |
| `prune-branches` | `true`  | Whether to delete branches from {{% vendor/name %}} that don’t exist in the GitLab repository. When enabled, branching (creating environments) must be done on the source repository rather than on the {{% vendor/name %}} project. Branches created on {{% vendor/name %}} that are not on the source repository will not persist and will be quickly pruned. Automatically disabled when fetching branches is disabled. |
| `build-merge-requests` | `true` | Whether to track all merge requests and create active environments from them, which builds the merge request. |
| `build-wip-merge-requests` | `true` | Whether to also track and build draft merge requests. Automatically disabled when merge requests aren’t built. |
| `merge-requests-clone-parent-data` | `true` | Whether to clone data from the parent environment when creating a merge request environment. |

To [keep your repository clean](/learn/bestpractices/clean-repository) and avoid performance issues, make sure you enable both the `fetch-branches` and `prune-branches` options.

{{% source-integration/validate source="GitLab" %}}
1. In your GitLab repository, click **Settings** > **Webhooks**.
1. In the **URL** field, paste the URL you copied.
1. Under **Trigger**, select **Push events** and **Merge request events**.
1. Click **Add webhook**.
{{% /source-integration/validate %}}

{{% source-integration/environment-status source="GitLab" %}}

## Source of truth

{{< source-integration/source-of-truth source="GitLab" >}}

### Sync, fetch, and prune

{{% source-integration/sync-fetch-prune service="GitLab" %}}

{{% source-integration/url source="GitLab" %}}
