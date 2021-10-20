---
title: "GitLab"
description: |
  The [GitLab](https://gitlab.com) integration allows you to manage your Platform.sh environments directly from your GitLab repository.
---

{{< description >}}

**Features supported:**

* Create a new environment when creating a branch or opening a pull request on GitLab.
* Rebuild the environment when pushing new code to GitLab.
* Delete the environment when merging a pull request.

## Setup

{{< note >}}

If the repository you are trying to integrate with a Platform.sh project has a default branch that is not `master` (such as `main`),
there are a few additional steps you will need to perform to setup the integration.
See the [Renaming the default branch guide](/guides/general/default-branch.md) for more information.

{{< /note >}}

### 1. Generate a token

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
1. Copy the token and save it somewhere (you won't be able to see it again.).

### 2. Enable the integration

Note that only `project owner` or `project admin` can manage the integrations.

Open a terminal window (you need to have the Platform.sh CLI installed).
Enable the GitLab integration as follows:

```bash
platform integration:add --type=gitlab --token=GITLAB-ACCESS-TOKEN --base-url=THE-URL-OF-YOUR-GITLAB --server-project=MY-NAMESPACE/MY-PROJECTNAME --project=PLATFORMSH_PROJECT_ID
```

where
* `PLATFORMSH_PROJECT_ID` is the project ID for your Platform.sh project
* `GITLAB-ACCESS-TOKEN` is the token you generated in step 1
* `THE-URL-OF-YOUR-GITLAB` is the base URL to call the GitLab API;
  it should be `https://gitlab.com` if your project is hosted on GitLab
  or the URL for your own GitLab instance otherwise.
  It should **not** include your namespace and project name.
* `MY-NAMESPACE/MY-PROJECTNAME` describes the namespace of your GitLab project, not including the base URL.

For example, if your repository is located at `https://gitlab.com/sandbox/my_application`, the integration command would be

```bash
platform integration:add --type=gitlab --token=GITLAB-ACCESS-TOKEN --base-url=https://gitlab.com --server-project=sandbox/my_application --project=PLATFORMSH_PROJECT_ID
```

Optional parameters:
* `--build-merge-requests`: Track and deploy merge-requests (true by default)
* `--build-wip-merge-requests`: If set to `true`,
  [WIP merge requests](https://docs.gitlab.com/ee/user/project/merge_requests/work_in_progress_merge_requests.html)
  will also have an environment created.
  If false, they will be ignored.
  If `--build-merge-requests` is `false`, this value is ignored.
  (`true` by default)
* `--merge-requests-clone-parent-data`: Should merge requests clone the data from the parent environment (true by default)
* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that do not exist in the remote GitLab repository (true by default)
* `--base-url`: Only set if using self-hosted GitLab on your own server.
  If so, set this to the base URL of your private server (the part before the user and repository name).

Note that the `--prune-branches` option depends on `--fetch-branches` being enabled.
If `--fetch-branches` is disabled, `--prune-branches` will automatically be set to false, even if specifically set to true.

### 3. Add the webhook

The previous command, if successful should output the configuration of the integration.
The last element would look like:

```bash
| hook_url | https://{region}.platform.sh/api/projects/{projectid}/integrations/{hook_id}/hook |
```

The CLI creates the necessary webhook using the above URL for you when there's correct permission set in the given token.
If you see the message `Failed to read or write webhooks`, you need to add a webhook manually:

1. Copy the hook URL shown in the message.
2. Go to your GitLab repository and click Settings > Webhooks.
3. Paste the hook URL.
   In the Triggers section choose Push events, Tag push events and Merge Request events.
   Click on Add webhook.


You can now start pushing code, creating new branches or opening merge requests directly on your GitLab repository.
You will see environments get automatically created and updated on the Platform.sh side.

### 4. Validate the integration

You can then verify that your integration is functioning properly [using the CLI](/integrations/overview.md#validating-integrations):

```bash
platform integration:validate
```

## Types of environments

Environments based on GitLab **merge requests** will have the correct 'parent' environment on Platform.sh;
they will be activated automatically with a copy of the parent's data
(unless you have set the option `merge-requests-clone-parent-data` to false).

However, environments based on (non-merge-request) **branches** cannot have parents;
they will inherit directly from your default branch and start inactive by default.

## Clones and commits

When you run `platform get <projectID>` or use the clone command shown in the "Git" dropdown in the management console to clone the project,
you will actually be cloning from your remote integrated repository,
so long as you have the [appropriate access to do so](/administration/users.md#user-access-and-integrations). 

Your GitLab repository is considered by Platform.sh to be the "source of truth" for the project.
The project is only a mirror of that repository, and all commits should be pushed only to GitLab.
