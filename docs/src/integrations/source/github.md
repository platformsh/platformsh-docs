---
title: "GitHub"
description: |
  The [GitHub](https://github.com) integration allows you to manage your Platform.sh environments directly from your GitHub repository.
---

{{% description %}}

**Features supported:**

* Create a new environment when creating a branch or opening a pull request on GitHub.
* Rebuild the environment when pushing new code to GitHub.
* Delete the environment when merging a pull request.

{{% source-integration/requirements %}}

##  1. Generate a token

To integrate your Platform.sh project with an existing GitHub repository,
[generate a new token](https://github.com/settings/tokens/new) in your GitHub settings.

Give it a description and then ensure the token has the following scopes:

* To integrate with public repositories: `public_repo`
* To integrate with your own private repositories: `repo`
* To integrate with your organization's private repositories:
  `repo` and `read:org`
* To automatically create web hooks: `admin:repo_hook`

Copy the token and make a note of it (temporarily).

Note that for the integration to work,
your GitHub user needs to have permission to push code to the repository.

## 2. Enable the integration

To enable the integration, use either the [CLI](../../administration/cli/_index.md)
or the [Console](../../administration/web/_index.md).

{{< codetabs >}}
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform integration:add --type=gitlab --token={{< variable "GITHUB_ACCESS_TOKEN" >}} --server-project={{< variable "OWNER/REPOSITORY" >}} --project={{< variable "PLATFORM_SH_PROJECT_ID" >}}
```

* `GITHUB_ACCESS_TOKEN` is the token you generated.
* `OWNER/REPOSITORY` is the name of the repository in GitHub.
* `PLATFORM_SH_PROJECT_ID` is the ID for your Platform.sh project.

For example, if your repository is located at `https://github.com/platformsh/platformsh-docs`,
the command is similar to the following:

```bash
platform integration:add --type=github --token=abc123 --repository=platformsh/platformsh-docs --project=abcdefgh1234567
```

Optional parameters:

* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that don't exist in the remote GitHub repository (true by default)
* `--build-pull-requests`: Track and deploy pull-requests (true by default)
* `--build-draft-pull-requests`: If set to `true`, [draft pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) also have an environment created.
  If `false`, they're ignored.
  If `--build-pull-requests` is `false` this value is ignored.
  (`true` by default)
* `--build-pull-requests-post-merge`: `false` to have Platform.sh build the branch specified in a PR.
  `true` to build the result of merging the PR.
  (`false` by default)
* `--pull-requests-clone-parent-data`:
  Set to `false` to disable cloning of parent environment data when creating a PR environment,
  so each PR environment starts with no data. (`true` by default)
* `--base-url`: Only set if using GitHub Enterprise, hosted on your own server.
  If so, set this to the base URL of your private server (the part before the user and repository name).

Note that the `--prune-branches` option depends on `--fetch-branches` being enabled.
If `--fetch-branches` is disabled, `--prune-branches` is automatically set to false, even if specifically set to true.

<--->
---
title=In the Console
file=none
highlight=false
---

1. Select the project where you want to enable the integration.
2. Click {{< icon settings >}} **Settings**.
3. Under **Project settings**, click **Integrations**.
4. Click **+ Add integration**.
5. On the GitHub integration, click **+ Add**.
6. Add the token you generated.
7. Optional: If your GitHub instance has a custom domain, enter its base URL.
8. Choose the repository to use for the project.
9. Check that the other options match what you want.
10. Click **Add integration**.

{{< /codetabs >}}

## 3. Validate the integration

Verify that your integration is functioning properly [using the CLI](../overview.md#validating-integrations):

```bash
platform integration:validate
```

### Add the webhook

If the integration was added with correct permissions, the necessary webhook is added automatically.
If you see the message `Failed to read or write webhooks`, you need to add a webhook manually:

1. Get the webhook URL by running `platform integration:get`.
2. Copy the `hook_url`.
3. Go to your GitHub repository and click **Settings**, select the **Webhooks** tab, and click **Add webhook**.
4. Paste the hook URL, select **application/json** for the content type,
   select **Send me everything** for the events you want to receive, and click **Add webhook**.

You can now start pushing code, creating new branches or opening pull requests directly on your GitHub repository.

Note that if you have created your account using the GitHub OAuth Login then to use the Platform CLI,
you need to [set up a password](https://accounts.platform.sh/user/password).

{{% source-integration/environment-status source="GitHub" %}}

{{% source-integration/clone-commit name="GitHub" %}}

{{% source-integration/url source="GitHub" %}}
