---
title: "GitLab"
description: |
  The [GitLab](https://gitlab.com) integration allows you to manage your Platform.sh environments directly from your GitLab repository.
---

{{% description %}}

**Features supported:**

* Create a new environment when creating a branch or opening a pull request on GitLab.
* Rebuild the environment when pushing new code to GitLab.
* Delete the environment when merging a pull request.

{{% source-integration/requirements %}}

## 1. Generate a token

To integrate your Platform.sh project with an existing GitLab repository,
generate a [project access token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)
(you can use a personal access token but a project access token has more limited permissions).
Note that for the integration to work, your GitLab user needs push access to the repository.

1. In GitLab, navigate to the project you want to integrate.
1. In the **Settings** menu, choose **Access Tokens**.
1. Give the token a name such as "Platform.sh Integration".
1. (Optional) set an expiration date.
1. Ensure the token has the following scopes:
   * `api` (to access your API)
   * `read_repository` (to read the repository)
1. Create the token.
1. Copy the token and save it somewhere (you can't see it again.).

{{< note >}}

To create a project access token, you need to have a [sufficient GitLab license tier](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html).
If you don't see **Access Tokens** under **Settings**, upgrade your GitLab tier.
Alternatively, you can create a [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html),
but that's attached to a specific user rather than the project as a whole.

{{< /note >}}

## 2. Enable the integration

To enable the integration, use either the [CLI](../../administration/cli/_index.md)
or the [Console](../../administration/web/_index.md).

{{< codetabs >}}
---
title:Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform integration:add --type=gitlab --token={{< variable "GITLAB_ACCESS_TOKEN" >}} --base-url={{< variable "GITLAB_URL" >}}--server-project={{< variable "NAMESPACE/PROJECTNAME" >}} --project={{< variable "PLATFORM_SH_PROJECT_ID" >}}
```

* `GITLAB_ACCESS_TOKEN` is the token you generated in step 1.
* `GITLAB_URL` is the base URL to call the GitLab API.
  It's `https://gitlab.com` if your repository is hosted on GitLab.
  Otherwise, it's the base URL for your GitLab instance.
* `NAMESPACE/PROJECTNAME` is the namespace of your GitLab repository, not including the base URL.
* `PLATFORM_SH_PROJECT_ID` is the ID for your Platform.sh project.

For example, if your repository is located at `https://gitlab.com/sandbox/application`,
the command is similar to the following:

```bash
platform integration:add --type=gitlab --token=abc123 --base-url=https://gitlab.com --server-project=sandbox/application --project=abcdefgh1234567
```

Optional parameters:

* `--build-merge-requests`: Track and deploy merge-requests (true by default)
* `--build-wip-merge-requests`: If set to `true`,
  [draft merge requests](https://docs.gitlab.com/ee/user/project/merge_requests/drafts.html)
  also have an environment created.
  If false, they're ignored.
  If `--build-merge-requests` is `false`, this value is ignored.
  (`true` by default)
* `--merge-requests-clone-parent-data`: Should merge requests clone the data from the parent environment (true by default)
* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that don't exist in the remote GitLab repository (true by default)
* `--base-url`: Only set if using self-hosted GitLab on your own server.
  If so, set this to the base URL of your private server (the part before the user and repository name).

Note that the `--prune-branches` option depends on `--fetch-branches` being enabled.
If `--fetch-branches` is disabled, `--prune-branches` is automatically be set to false, even if specifically set to true.

<--->
---
title:In the Console
file=none
highlight=false
---

1. Select the project where you want to enable the integration.
2. Click {{< icon settings >}} **Settings**.
3. Under **Project settings**, click **Integrations**.
4. Click **+ Add integration**.
5. On the GitLab integration, click **+ Add**.
6. Add the token you generated.
7. Optional: If your GitLab instance is not hosted at `https://gitlab.com`, enter its base URL.
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

1. Get the webhook URL by running `platform integration:get`
2. Copy the `hook_url`.
3. Go to your GitLab repository and click **Settings** > **Webhooks**.
4. Paste the hook URL.
   In the **Trigger** section select **Push events**, **Tag push events**, and **Merge request events**.
   Click **Add webhook**.

You can now start pushing code, creating new branches or opening merge requests directly on your GitLab repository.
You see environments get automatically created and updated on the Platform.sh side.

{{% source-integration/environment-status source="GitLab" %}}

{{% source-integration/clone-commit name="GitLab" %}}

{{% source-integration/url source="GitLab" %}}
